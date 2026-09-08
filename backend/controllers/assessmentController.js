const Assessment = require('../models/Assessment');

exports.submitAssessment = async (req, res) => {
  try {
    const { interests, strongSubjects, skills, personality, workStylePreference } = req.body;

    const assessment = await Assessment.create({
      user: req.user.id,
      interests,
      strongSubjects,
      skills,
      personality,
      workStylePreference,
    });

    res.status(201).json(assessment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit assessment', error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const assessments = await Assessment.find({ user: req.user.id });
    // Sort by createdAt descending (newest first)
    assessments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch history', error: err.message });
  }
};
