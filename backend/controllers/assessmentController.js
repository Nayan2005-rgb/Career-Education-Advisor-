const Assessment = require('../models/Assessment');

exports.submitAssessment = async (req, res) => {
  try {
    const { interests, strongSubjects, skills, personality, workStylePreference, skillScores } = req.body;

    const assessment = await Assessment.create({
      user: req.user.id,
      interests,
      strongSubjects,
      skills,
      personality,
      workStylePreference,
      skillScores: skillScores || {} // Optional: detailed skill proficiency scores
    });

    res.status(201).json(assessment);
  } catch (err) {
    res.status(500).json({ message: 'Unable to submit assessment. Please try again.' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const assessments = await Assessment.find({ user: req.user.id });
    // Sort by createdAt descending (newest first)
    assessments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ message: 'Unable to load assessment history. Please try again.' });
  }
};
