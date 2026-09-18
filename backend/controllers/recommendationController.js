const { getRecommendations } = require('../utils/recommendationEngine');
const careers = require('../data/careers.json');

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
    res.status(500).json({ message: 'Unable to load recommendations. Please try again.' });
  }
};

exports.getCareerDetails = async (req, res) => {
  try {
    const { careerTitle } = req.params;
    
    // Find career by title (case-insensitive)
    const career = careers.find(c => 
      c.title.toLowerCase() === decodeURIComponent(careerTitle).toLowerCase()
    );

    if (!career) {
      return res.status(404).json({ message: 'Career not found' });
    }

    res.json(career);
  } catch (err) {
    res.status(500).json({ message: 'Unable to load career details. Please try again.' });
  }
};
