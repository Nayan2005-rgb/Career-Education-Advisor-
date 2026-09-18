const careers = require('../data/careers.json');

/**
 * Weighted scoring recommendation engine.
 *
 * Each user input category is weighted by how strongly it should influence
 * the final match. Tune these weights to change how the engine behaves.
 */
const WEIGHTS = {
  interests: 3,
  strongSubjects: 2,
  skills: 2,
  personality: 2,
  workStylePreference: 1,
};

function normalize(value) {
  return (value || '').toString().trim().toLowerCase();
}

function toSet(arr) {
  return new Set((arr || []).map(normalize));
}

/**
 * Scores every career in the dataset against the user's assessment answers
 * and returns the top matches, ranked highest first.
 *
 * @param {Object} answers - { interests, strongSubjects, skills, personality, workStylePreference }
 * @param {number} topN - how many recommendations to return
 * @returns {Array} ranked career recommendations with a match score (0-100)
 */
function getRecommendations(answers, topN = 5) {
  const userInterests = toSet(answers.interests);
  const userSubjects = toSet(answers.strongSubjects);
  const userSkills = toSet(answers.skills);
  const userPersonality = normalize(answers.personality);
  const userWorkStyle = normalize(answers.workStylePreference);

  let maxPossibleScore = 0;
  Object.values(WEIGHTS).forEach((w) => (maxPossibleScore += w));

  const scored = careers.map((career) => {
    const careerTags = toSet(career.tags);
    let score = 0;

    // Interests overlap
    if ([...userInterests].some((i) => careerTags.has(i))) score += WEIGHTS.interests;

    // Strong subjects overlap
    if ([...userSubjects].some((s) => careerTags.has(s))) score += WEIGHTS.strongSubjects;

    // Skills overlap
    if ([...userSkills].some((s) => careerTags.has(s))) score += WEIGHTS.skills;

    // Personality fit
    const careerPersonalities = toSet(career.personalityFit);
    if (userPersonality && careerPersonalities.has(userPersonality)) score += WEIGHTS.personality;

    // Work style — currently a light bonus if it matches a tag (extend as needed)
    if (userWorkStyle && careerTags.has(userWorkStyle)) score += WEIGHTS.workStylePreference;

    const matchPercent = Math.round((score / maxPossibleScore) * 100);

    return {
      ...career,
      matchScore: matchPercent,
    };
  });

  return scored
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, topN)
    .filter((c) => c.matchScore > 0);
}

module.exports = { getRecommendations };
