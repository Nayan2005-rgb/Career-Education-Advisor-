const Opportunity = require('../models/Opportunity');
const SavedOpportunity = require('../models/SavedOpportunity');
const ApplicationTracking = require('../models/ApplicationTracking');
const Assessment = require('../models/Assessment');
const User = require('../models/User');

/**
 * Search and filter opportunities
 */
exports.searchOpportunities = async (req, res) => {
  try {
    const {
      search,
      opportunityType,
      location,
      workMode,
      experienceLevel,
      skills,
      educationLevel,
      sortBy = 'postingDate',
      page = 1,
      limit = 20
    } = req.query;

    const filters = {};
    if (search) filters.search = search;
    if (opportunityType) filters.opportunityType = opportunityType;
    if (location) filters.location = location;
    if (workMode) filters.workMode = workMode;
    if (experienceLevel) filters.experienceLevel = experienceLevel;
    if (skills) filters.skills = Array.isArray(skills) ? skills : [skills];
    if (educationLevel) filters.educationLevel = educationLevel;

    let opportunities = Opportunity.search(filters);
    opportunities = Opportunity.sort(opportunities, sortBy);

    // Pagination
    const validPage = Math.max(1, parseInt(page) || 1);
    const validLimit = Math.max(1, Math.min(100, parseInt(limit) || 20));
    const startIndex = (validPage - 1) * validLimit;
    const endIndex = startIndex + validLimit;
    const paginatedOpportunities = opportunities.slice(startIndex, endIndex);

    res.json({
      opportunities: paginatedOpportunities,
      pagination: {
        currentPage: validPage,
        totalPages: Math.ceil(opportunities.length / validLimit),
        totalItems: opportunities.length,
        itemsPerPage: validLimit
      }
    });
  } catch (err) {
    console.error('Error searching opportunities:', err);
    res.status(500).json({ message: 'Unable to search opportunities. Please try again.' });
  }
};

/**
 * Get opportunity details by ID
 */
exports.getOpportunityDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const opportunity = Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Check if user has saved this opportunity (if authenticated)
    let isSaved = false;
    if (req.user) {
      isSaved = SavedOpportunity.isSaved(req.user.id, id);
    }

    res.json({
      ...opportunity,
      isSaved
    });
  } catch (err) {
    console.error('Error getting opportunity details:', err);
    res.status(500).json({ message: 'Unable to load opportunity details. Please try again.' });
  }
};

/**
 * Get personalized recommendations for the current user
 */
exports.getPersonalizedRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's latest assessment
    const assessments = await Assessment.find({ user: userId });
    const latestAssessment = assessments.sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    )[0];

    // Get user profile
    const user = await User.findById(userId);

    if (!latestAssessment && !user) {
      return res.status(400).json({
        message: 'No assessment or profile found. Please complete the career assessment first.'
      });
    }

    // Build user profile
    const userProfile = {
      skills: latestAssessment?.skills || [],
      interests: latestAssessment?.interests || [],
      educationLevel: user?.educationLevel || null,
      state: user?.state || null
    };

    // Get all opportunities
    const allOpportunities = Opportunity.findAll();

    // Calculate match scores for each opportunity
    const recommendations = allOpportunities.map(opportunity => {
      const matchDetails = calculateMatchScore(userProfile, opportunity);
      return {
        ...opportunity,
        matchScore: matchDetails.score,
        matchExplanation: matchDetails.explanation,
        matchingSkills: matchDetails.matchingSkills,
        missingSkills: matchDetails.missingSkills
      };
    });

    // Sort by match score (highest first)
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    // Return top recommendations
    const topRecommendations = recommendations.slice(0, 20);

    res.json({
      recommendations: topRecommendations,
      userProfile: {
        skills: userProfile.skills,
        interests: userProfile.interests,
        educationLevel: userProfile.educationLevel
      }
    });
  } catch (err) {
    console.error('Error getting personalized recommendations:', err);
    res.status(500).json({ message: 'Unable to load recommendations. Please try again.' });
  }
};

/**
 * Calculate match score between user profile and opportunity
 */
function calculateMatchScore(userProfile, opportunity) {
  let score = 0;
  const explanation = [];
  const matchingSkills = [];
  const missingSkills = [];

  const requiredSkills = (opportunity.requiredSkills || []).map(s => s.toLowerCase());
  const userSkills = (userProfile.skills || []).map(s => s.toLowerCase());
  const userInterests = (userProfile.interests || []).map(i => i.toLowerCase());

  // Skills match (40% weight)
  if (requiredSkills.length > 0) {
    const skillMatches = requiredSkills.filter(skill =>
      userSkills.some(userSkill => userSkill.includes(skill) || skill.includes(userSkill))
    );

    if (skillMatches.length > 0) {
      const skillScore = (skillMatches.length / requiredSkills.length) * 40;
      score += skillScore;
      explanation.push(`You have ${skillMatches.length} of ${requiredSkills.length} required skills`);
      matchingSkills.push(...skillMatches);
    }

    const missing = requiredSkills.filter(skill =>
      !userSkills.some(userSkill => userSkill.includes(skill) || skill.includes(userSkill))
    );
    missingSkills.push(...missing);
  }

  // Interest match (30% weight)
  if (userInterests.length > 0) {
    const opportunityKeywords = (opportunity.keywords || []).map(k => k.toLowerCase());
    const interestMatches = userInterests.filter(interest =>
      opportunityKeywords.some(keyword =>
        keyword.includes(interest) || interest.includes(keyword)
      )
    );

    if (interestMatches.length > 0) {
      const interestScore = (interestMatches.length / userInterests.length) * 30;
      score += interestScore;
      explanation.push(`Your interests align with this opportunity`);
    }
  }

  // Education compatibility (20% weight)
  if (userProfile.educationLevel && opportunity.requiredEducation) {
    const educationLevels = ['High School', 'Diploma', 'Bachelor\'s', 'Master\'s', 'PhD'];
    const userLevelIndex = educationLevels.indexOf(userProfile.educationLevel);
    const requiredLevelIndex = educationLevels.indexOf(opportunity.requiredEducation);

    if (userLevelIndex >= requiredLevelIndex) {
      score += 20;
      explanation.push('Your education meets the requirement');
    } else if (userLevelIndex === requiredLevelIndex - 1) {
      score += 10;
      explanation.push('Your education is close to the requirement');
    }
  }

  // Location preference (10% weight) - if user state matches opportunity location
  if (userProfile.state && opportunity.location) {
    if (opportunity.location.toLowerCase().includes(userProfile.state.toLowerCase())) {
      score += 10;
      explanation.push('Location matches your preference');
    } else if (opportunity.workMode === 'remote') {
      score += 5;
      explanation.push('Remote work option available');
    }
  }

  // Cap score at 100
  score = Math.min(score, 100);

  return {
    score: Math.round(score),
    explanation: explanation.length > 0 ? explanation : ['No specific match criteria found'],
    matchingSkills: [...new Set(matchingSkills)], // Remove duplicates
    missingSkills: [...new Set(missingSkills)]
  };
}

/**
 * Save an opportunity
 */
exports.saveOpportunity = async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const userId = req.user.id;

    // Check if opportunity exists
    const opportunity = Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Check if already saved
    if (SavedOpportunity.isSaved(userId, opportunityId)) {
      return res.status(400).json({ message: 'Opportunity already saved' });
    }

    const saved = await SavedOpportunity.create({
      userId,
      opportunityId,
      savedAt: new Date().toISOString()
    });

    res.status(201).json({
      message: 'Opportunity saved successfully',
      saved
    });
  } catch (err) {
    console.error('Error saving opportunity:', err);
    res.status(500).json({ message: 'Unable to save opportunity. Please try again.' });
  }
};

/**
 * Get saved opportunities for the current user
 */
exports.getSavedOpportunities = async (req, res) => {
  try {
    const userId = req.user.id;
    const savedItems = SavedOpportunity.findByUserId(userId);

    // Get full opportunity details for each saved item
    const opportunities = savedItems.map(saved => {
      const opportunity = Opportunity.findById(saved.opportunityId);
      return opportunity ? { ...opportunity, savedAt: saved.savedAt, savedId: saved.id } : null;
    }).filter(Boolean);

    // Sort by saved date (newest first)
    opportunities.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));

    res.json({
      opportunities,
      count: opportunities.length
    });
  } catch (err) {
    console.error('Error getting saved opportunities:', err);
    res.status(500).json({ message: 'Unable to load saved opportunities. Please try again.' });
  }
};

/**
 * Remove a saved opportunity
 */
exports.removeSavedOpportunity = async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const userId = req.user.id;

    const removed = SavedOpportunity.removeByUserAndOpportunity(userId, opportunityId);

    if (!removed) {
      return res.status(404).json({ message: 'Saved opportunity not found' });
    }

    res.json({ message: 'Opportunity removed from saved' });
  } catch (err) {
    console.error('Error removing saved opportunity:', err);
    res.status(500).json({ message: 'Unable to remove saved opportunity. Please try again.' });
  }
};

/**
 * Create application tracking entry
 */
exports.createApplicationTracking = async (req, res) => {
  try {
    const { opportunityId } = req.params;
    const { status, notes, interviewDate } = req.body;
    const userId = req.user.id;

    // Check if opportunity exists
    const opportunity = Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Check if application tracking already exists
    const existing = ApplicationTracking.findByUserAndOpportunity(userId, opportunityId);
    if (existing) {
      return res.status(400).json({ message: 'Application tracking already exists for this opportunity' });
    }

    const application = await ApplicationTracking.create({
      userId,
      opportunityId,
      status: status || 'Saved',
      applicationDate: status === 'Applied' ? new Date().toISOString() : null,
      notes: notes || '',
      interviewDate: interviewDate || null
    });

    res.status(201).json({
      message: 'Application tracking created successfully',
      application
    });
  } catch (err) {
    console.error('Error creating application tracking:', err);
    res.status(500).json({ message: 'Unable to create application tracking. Please try again.' });
  }
};

/**
 * Get application tracking for the current user
 */
exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    let applications;
    if (status) {
      applications = ApplicationTracking.findByUserIdAndStatus(userId, status);
    } else {
      applications = ApplicationTracking.findByUserId(userId);
    }

    // Get full opportunity details for each application
    const applicationsWithDetails = applications.map(app => {
      const opportunity = Opportunity.findById(app.opportunityId);
      return opportunity ? { ...app, opportunity } : null;
    }).filter(Boolean);

    // Sort by application date (newest first)
    applicationsWithDetails.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      applications: applicationsWithDetails,
      count: applicationsWithDetails.length
    });
  } catch (err) {
    console.error('Error getting user applications:', err);
    res.status(500).json({ message: 'Unable to load applications. Please try again.' });
  }
};

/**
 * Update application tracking
 */
exports.updateApplicationTracking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, interviewDate } = req.body;
    const userId = req.user.id;

    const application = ApplicationTracking.findById(id);

    if (!application) {
      return res.status(404).json({ message: 'Application tracking not found' });
    }

    // Verify ownership
    if (application.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    const updates = {};
    if (status !== undefined) {
      updates.status = status;
      // Update application date if status changes to Applied
      if (status === 'Applied' && !application.applicationDate) {
        updates.applicationDate = new Date().toISOString();
      }
    }
    if (notes !== undefined) updates.notes = notes;
    if (interviewDate !== undefined) updates.interviewDate = interviewDate;

    const updated = await ApplicationTracking.updateById(id, updates);

    res.json({
      message: 'Application tracking updated successfully',
      application: updated
    });
  } catch (err) {
    console.error('Error updating application tracking:', err);
    res.status(500).json({ message: 'Unable to update application tracking. Please try again.' });
  }
};

/**
 * Delete application tracking
 */
exports.deleteApplicationTracking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const application = ApplicationTracking.findById(id);

    if (!application) {
      return res.status(404).json({ message: 'Application tracking not found' });
    }

    // Verify ownership
    if (application.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this application' });
    }

    await ApplicationTracking.deleteById(id);

    res.json({ message: 'Application tracking deleted successfully' });
  } catch (err) {
    console.error('Error deleting application tracking:', err);
    res.status(500).json({ message: 'Unable to delete application tracking. Please try again.' });
  }
};

/**
 * Get filter options for opportunities
 */
exports.getFilterOptions = async (req, res) => {
  try {
    const opportunities = Opportunity.findAll();

    // Extract unique values for filters
    const opportunityTypes = [...new Set(opportunities.map(o => o.opportunityType).filter(Boolean))];
    const locations = [...new Set(opportunities.map(o => o.location).filter(Boolean))];
    const workModes = [...new Set(opportunities.map(o => o.workMode).filter(Boolean))];
    const experienceLevels = [...new Set(opportunities.map(o => o.experienceLevel).filter(Boolean))];
    const educationLevels = [...new Set(opportunities.map(o => o.requiredEducation).filter(Boolean))];

    // Extract all skills
    const allSkills = [...new Set(
      opportunities.flatMap(o => [...(o.requiredSkills || []), ...(o.preferredSkills || [])])
    )];

    res.json({
      opportunityTypes,
      locations,
      workModes,
      experienceLevels,
      educationLevels,
      skills: allSkills
    });
  } catch (err) {
    console.error('Error getting filter options:', err);
    res.status(500).json({ message: 'Unable to load filter options. Please try again.' });
  }
};
