const { getRecommendations } = require('../utils/recommendationEngine');

exports.getRecommendationsForUser = async (req, res) => {
  try {
    const { interests, strongSubjects, skills, personality, workStylePreference } = req.body;

    const recommendations = getRecommendations({
      interests,
      strongSubjects,
      skills,
      personality,
      workStylePreference,
    });

    res.json({ recommendations });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate recommendations', error: err.message });
  }
};
