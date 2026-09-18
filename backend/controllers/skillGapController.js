const { analyzeSkillGap, generateDetailedLearningPath } = require('../utils/skillGapAnalyzer');
const SkillGap = require('../models/SkillGap');
const Assessment = require('../models/Assessment');
const LearningPath = require('../models/LearningPath');

/**
 * Generate skill gap analysis for a specific career
 */
exports.generateSkillGap = async (req, res) => {
  try {
    const { careerTitle } = req.params;
    const userId = req.user.id;

    // Get student's latest assessment
    const assessments = await Assessment.find({ user: userId });
    const latestAssessment = assessments.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    )[0];

    if (!latestAssessment) {
      return res.status(400).json({ 
        message: 'No assessment found. Please complete the career assessment first.' 
      });
    }

    // Build student profile from assessment
    const studentProfile = {
      skills: latestAssessment.skills || [],
      strongSubjects: latestAssessment.strongSubjects || [],
      interests: latestAssessment.interests || [],
      personality: latestAssessment.personality,
      workStylePreference: latestAssessment.workStylePreference,
      skillScores: latestAssessment.skillScores || {}
    };

    // Perform skill gap analysis
    const analysis = analyzeSkillGap(studentProfile, careerTitle);

    // Check if skill gap analysis already exists for this user and career
    const existingAnalysis = await SkillGap.findOne({
      user: userId,
      careerTitle: careerTitle
    });

    let savedAnalysis;
    if (existingAnalysis) {
      // Update existing analysis
      savedAnalysis = await SkillGap.updateById(existingAnalysis.id, {
        analysis,
        updatedAt: new Date().toISOString()
      });
    } else {
      // Create new analysis
      savedAnalysis = await SkillGap.create({
        user: userId,
        careerTitle,
        analysis
      });
    }

    res.json({
      analysis,
      savedAnalysisId: savedAnalysis.id
    });
  } catch (err) {
    console.error('Error generating skill gap analysis:', err);
    res.status(500).json({ 
      message: err.message || 'Unable to generate skill gap analysis. Please try again.' 
    });
  }
};

/**
 * Get skill gap analysis for a specific career
 */
exports.getSkillGap = async (req, res) => {
  try {
    const { careerTitle } = req.params;
    const userId = req.user.id;

    const skillGap = await SkillGap.findOne({
      user: userId,
      careerTitle: careerTitle
    });

    if (!skillGap) {
      return res.status(404).json({ 
        message: 'Skill gap analysis not found. Generate one first.' 
      });
    }

    res.json(skillGap.analysis);
  } catch (err) {
    console.error('Error retrieving skill gap analysis:', err);
    res.status(500).json({ 
      message: 'Unable to retrieve skill gap analysis. Please try again.' 
    });
  }
};

/**
 * Get all skill gap analyses for the current user
 */
exports.getUserSkillGaps = async (req, res) => {
  try {
    const userId = req.user.id;
    const skillGaps = await SkillGap.find({ user: userId });

    // Sort by most recent
    skillGaps.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.json(skillGaps);
  } catch (err) {
    console.error('Error retrieving user skill gaps:', err);
    res.status(500).json({ 
      message: 'Unable to retrieve skill gap analyses. Please try again.' 
    });
  }
};

/**
 * Delete a specific skill gap analysis
 */
exports.deleteSkillGap = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const skillGap = await SkillGap.findById(id);
    
    if (!skillGap) {
      return res.status(404).json({ message: 'Skill gap analysis not found' });
    }

    if (skillGap.user !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this analysis' });
    }

    await SkillGap.deleteById(id);
    res.json({ message: 'Skill gap analysis deleted successfully' });
  } catch (err) {
    console.error('Error deleting skill gap analysis:', err);
    res.status(500).json({ 
      message: 'Unable to delete skill gap analysis. Please try again.' 
    });
  }
};

/**
 * Generate detailed learning path for a specific career
 */
exports.generateLearningPath = async (req, res) => {
  try {
    const { careerTitle } = req.params;
    const userId = req.user.id;

    // Get student's latest assessment
    const assessments = await Assessment.find({ user: userId });
    const latestAssessment = assessments.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    )[0];

    if (!latestAssessment) {
      return res.status(400).json({ 
        message: 'No assessment found. Please complete the career assessment first.' 
      });
    }

    // Build student profile from assessment
    const studentProfile = {
      skills: latestAssessment.skills || [],
      strongSubjects: latestAssessment.strongSubjects || [],
      interests: latestAssessment.interests || [],
      personality: latestAssessment.personality,
      workStylePreference: latestAssessment.workStylePreference,
      skillScores: latestAssessment.skillScores || {}
    };

    // Perform skill gap analysis to get detailed learning path
    const analysis = analyzeSkillGap(studentProfile, careerTitle);
    const detailedLearningPath = analysis.detailedLearningPath;

    // Check if learning path already exists for this user and career
    const existingPath = await LearningPath.findOne({
      user: userId,
      careerTitle: careerTitle
    });

    let savedPath;
    if (existingPath) {
      // Preserve completion status for existing items
      const updatedLearningItems = detailedLearningPath.map(newItem => {
        const existingItem = existingPath.learningItems.find(
          existing => existing.skill === newItem.skill && existing.topic === newItem.topic
        );
        return {
          ...newItem,
          completed: existingItem ? existingItem.completed : false,
          completedAt: existingItem ? existingItem.completedAt : null
        };
      });

      savedPath = await LearningPath.updateById(existingPath.id, {
        learningItems: updatedLearningItems,
        careerTitle: careerTitle,
        updatedAt: new Date().toISOString()
      });
    } else {
      // Create new learning path
      savedPath = await LearningPath.create({
        user: userId,
        careerTitle,
        learningItems: detailedLearningPath
      });
    }

    res.json({
      learningPath: savedPath.learningItems,
      savedPathId: savedPath.id,
      careerTitle: careerTitle
    });
  } catch (err) {
    console.error('Error generating learning path:', err);
    res.status(500).json({ 
      message: err.message || 'Unable to generate learning path. Please try again.' 
    });
  }
};

/**
 * Get learning path for a specific career
 */
exports.getLearningPath = async (req, res) => {
  try {
    const { careerTitle } = req.params;
    const userId = req.user.id;

    const learningPath = await LearningPath.findOne({
      user: userId,
      careerTitle: careerTitle
    });

    if (!learningPath) {
      return res.status(404).json({ 
        message: 'Learning path not found. Generate one first.' 
      });
    }

    res.json({
      learningPath: learningPath.learningItems,
      careerTitle: learningPath.careerTitle,
      id: learningPath.id
    });
  } catch (err) {
    console.error('Error retrieving learning path:', err);
    res.status(500).json({ 
      message: 'Unable to retrieve learning path. Please try again.' 
    });
  }
};

/**
 * Update learning item completion status
 */
exports.updateLearningItem = async (req, res) => {
  try {
    const { careerTitle, itemIndex } = req.params;
    const { completed } = req.body;
    const userId = req.user.id;

    const learningPath = await LearningPath.findOne({
      user: userId,
      careerTitle: careerTitle
    });

    if (!learningPath) {
      return res.status(404).json({ 
        message: 'Learning path not found.' 
      });
    }

    if (itemIndex < 0 || itemIndex >= learningPath.learningItems.length) {
      return res.status(400).json({ 
        message: 'Invalid learning item index.' 
      });
    }

    // Update the specific learning item
    learningPath.learningItems[itemIndex].completed = completed;
    learningPath.learningItems[itemIndex].completedAt = completed ? new Date().toISOString() : null;

    // Save the updated learning path
    const updatedPath = await LearningPath.updateById(learningPath.id, {
      learningItems: learningPath.learningItems,
      updatedAt: new Date().toISOString()
    });

    res.json({
      learningPath: updatedPath.learningItems,
      message: 'Learning item updated successfully'
    });
  } catch (err) {
    console.error('Error updating learning item:', err);
    res.status(500).json({ 
      message: 'Unable to update learning item. Please try again.' 
    });
  }
};

/**
 * Get all learning paths for the current user
 */
exports.getUserLearningPaths = async (req, res) => {
  try {
    const userId = req.user.id;
    const learningPaths = await LearningPath.find({ user: userId });

    // Sort by most recent
    learningPaths.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.json(learningPaths);
  } catch (err) {
    console.error('Error retrieving user learning paths:', err);
    res.status(500).json({ 
      message: 'Unable to retrieve learning paths. Please try again.' 
    });
  }
};
