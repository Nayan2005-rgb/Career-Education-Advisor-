const Resume = require('../models/Resume');
const User = require('../models/User');

/**
 * Create a new resume
 */
exports.createResume = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      name,
      template,
      personalInfo,
      summary,
      education,
      technicalSkills,
      softSkills,
      projects,
      experience,
      certifications,
      achievements,
      courses,
      socialLinks
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Resume name is required' });
    }

    if (!template) {
      return res.status(400).json({ message: 'Template selection is required' });
    }

    const resume = await Resume.create({
      userId,
      name,
      template,
      personalInfo: personalInfo || {},
      summary: summary || '',
      education: education || [],
      technicalSkills: technicalSkills || [],
      softSkills: softSkills || [],
      projects: projects || [],
      experience: experience || [],
      certifications: certifications || [],
      achievements: achievements || [],
      courses: courses || [],
      socialLinks: socialLinks || {}
    });

    res.status(201).json({
      message: 'Resume created successfully',
      resume
    });
  } catch (err) {
    console.error('Error creating resume:', err);
    res.status(500).json({ message: 'Unable to create resume. Please try again.' });
  }
};

/**
 * Get all resumes for the current user
 */
exports.getUserResumes = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumes = Resume.findByUserId(userId);

    res.json({
      resumes,
      count: resumes.length
    });
  } catch (err) {
    console.error('Error getting user resumes:', err);
    res.status(500).json({ message: 'Unable to load resumes. Please try again.' });
  }
};

/**
 * Get a specific resume by ID
 */
exports.getResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const resume = Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Verify ownership
    if (resume.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(resume);
  } catch (err) {
    console.error('Error getting resume:', err);
    res.status(500).json({ message: 'Unable to load resume. Please try again.' });
  }
};

/**
 * Update a resume
 */
exports.updateResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const resume = Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Verify ownership
    if (resume.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const {
      name,
      template,
      personalInfo,
      summary,
      education,
      technicalSkills,
      softSkills,
      projects,
      experience,
      certifications,
      achievements,
      courses,
      socialLinks
    } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (template !== undefined) updates.template = template;
    if (personalInfo !== undefined) updates.personalInfo = personalInfo;
    if (summary !== undefined) updates.summary = summary;
    if (education !== undefined) updates.education = education;
    if (technicalSkills !== undefined) updates.technicalSkills = technicalSkills;
    if (softSkills !== undefined) updates.softSkills = softSkills;
    if (projects !== undefined) updates.projects = projects;
    if (experience !== undefined) updates.experience = experience;
    if (certifications !== undefined) updates.certifications = certifications;
    if (achievements !== undefined) updates.achievements = achievements;
    if (courses !== undefined) updates.courses = courses;
    if (socialLinks !== undefined) updates.socialLinks = socialLinks;

    const updatedResume = await Resume.updateById(id, updates);

    res.json({
      message: 'Resume updated successfully',
      resume: updatedResume
    });
  } catch (err) {
    console.error('Error updating resume:', err);
    res.status(500).json({ message: 'Unable to update resume. Please try again.' });
  }
};

/**
 * Delete a resume
 */
exports.deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const resume = Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Verify ownership
    if (resume.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const deleted = await Resume.deleteById(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({
      message: 'Resume deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting resume:', err);
    res.status(500).json({ message: 'Unable to delete resume. Please try again.' });
  }
};

/**
 * Get user profile data for resume integration
 */
exports.getUserProfileData = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove sensitive data
    const { password, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  } catch (err) {
    console.error('Error getting user profile data:', err);
    res.status(500).json({ message: 'Unable to load profile data. Please try again.' });
  }
};
