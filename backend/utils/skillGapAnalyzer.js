const careers = require('../data/careers.json');

/**
 * Skill Gap Analysis Utility
 * Compares student's current skills with career requirements and generates detailed analysis
 */

/**
 * Normalize skill names for comparison
 */
function normalizeSkill(skill) {
  return skill.toLowerCase().trim();
}

/**
 * Calculate skill match percentage based on overlap between student skills and career requirements
 */
function calculateSkillMatch(studentSkills, requiredSkills) {
  if (!requiredSkills || requiredSkills.length === 0) return 100;
  if (!studentSkills || studentSkills.length === 0) return 0;

  const normalizedStudentSkills = studentSkills.map(normalizeSkill);
  const normalizedRequiredSkills = requiredSkills.map(normalizeSkill);

  let matchCount = 0;
  normalizedRequiredSkills.forEach(required => {
    const hasMatch = normalizedStudentSkills.some(student => 
      student.includes(required) || required.includes(student)
    );
    if (hasMatch) matchCount++;
  });

  return Math.round((matchCount / normalizedRequiredSkills.length) * 100);
}

/**
 * Generate individual skill comparisons with current vs required levels
 */
function generateSkillComparisons(studentSkills, studentSubjects, requiredSkills, softSkills, skillScores = {}) {
  const comparisons = [];
  
  // Process required technical skills
  requiredSkills?.forEach(skill => {
    const normalizedSkill = normalizeSkill(skill);
    const studentSkill = studentSkills?.find(s => normalizeSkill(s).includes(normalizedSkill));
    const studentSubject = studentSubjects?.find(s => normalizeSkill(s).includes(normalizedSkill));
    
    let currentLevel = 0;
    let requiredLevel = 80; // Default required level
    
    // Use detailed skill scores if available
    if (skillScores[normalizedSkill]) {
      currentLevel = skillScores[normalizedSkill];
    } 
    // Base current level on whether student has the skill or related subject
    else if (studentSkill) {
      currentLevel = 60; // Student has the skill
    } else if (studentSubject) {
      currentLevel = 40; // Student has related subject
    }
    
    // Check for partial matches based on skill keywords
    const skillKeywords = ['programming', 'python', 'java', 'javascript', 'sql', 'data', 'design', 'communication', 'problem-solving', 'leadership', 'creativity', 'research'];
    const hasKeywordMatch = skillKeywords.some(keyword => 
      normalizedSkill.includes(keyword) && 
      studentSkills?.some(s => normalizeSkill(s).includes(keyword))
    );
    
    if (hasKeywordMatch && currentLevel === 0) {
      currentLevel = 30; // Partial match based on keywords
    }
    
    // Adjust required level based on skill complexity
    if (skill.toLowerCase().includes('advanced') || skill.toLowerCase().includes('expert')) {
      requiredLevel = 95;
    } else if (skill.toLowerCase().includes('basic') || skill.toLowerCase().includes('fundamental')) {
      requiredLevel = 60;
    }
    
    comparisons.push({
      skill: skill,
      current: currentLevel,
      required: requiredLevel,
      gap: requiredLevel - currentLevel,
      hasSkill: currentLevel > 0
    });
  });

  // Process soft skills
  softSkills?.forEach(skill => {
    const normalizedSkill = normalizeSkill(skill);
    const studentSkill = studentSkills?.find(s => normalizeSkill(s).includes(normalizedSkill));
    
    let currentLevel = 0;
    let requiredLevel = 75; // Soft skills generally have moderate requirements
    
    if (studentSkill) {
      currentLevel = 70; // Student has the soft skill
    }
    
    // Check for partial matches for soft skills
    const softSkillKeywords = ['communication', 'problem-solving', 'leadership', 'creativity', 'teamwork', 'analytical'];
    const hasKeywordMatch = softSkillKeywords.some(keyword => 
      normalizedSkill.includes(keyword) && 
      studentSkills?.some(s => normalizeSkill(s).includes(keyword))
    );
    
    if (hasKeywordMatch && currentLevel === 0) {
      currentLevel = 40; // Partial match based on keywords
    }
    
    comparisons.push({
      skill: skill,
      current: currentLevel,
      required: requiredLevel,
      gap: requiredLevel - currentLevel,
      hasSkill: currentLevel > 0,
      isSoftSkill: true
    });
  });

  return comparisons;
}

/**
 * Categorize skills by priority based on gap size and importance
 */
function categorizeSkills(skillComparisons) {
  const highPriority = [];
  const mediumPriority = [];
  const lowPriority = [];
  const missingSkills = [];

  skillComparisons.forEach(comparison => {
    if (!comparison.hasSkill) {
      missingSkills.push(comparison.skill);
    }

    if (comparison.gap > 50) {
      highPriority.push(comparison);
    } else if (comparison.gap > 25) {
      mediumPriority.push(comparison);
    } else if (comparison.gap > 0) {
      lowPriority.push(comparison);
    }
  });

  return {
    highPriority,
    mediumPriority,
    lowPriority,
    missingSkills
  };
}

/**
 * Generate detailed learning recommendations based on skill gaps
 */
function generateLearningRecommendations(skillComparisons, careerTitle) {
  const recommendations = [];

  skillComparisons.forEach(comparison => {
    if (comparison.gap > 30) {
      const skill = comparison.skill.toLowerCase();
      let learningPath = '';

      // Generate specific learning paths based on skill type
      if (skill.includes('python') || skill.includes('programming') || skill.includes('java')) {
        learningPath = `Start with online courses (Coursera, edX), practice on LeetCode/HackerRank, build small projects`;
      } else if (skill.includes('sql') || skill.includes('database')) {
        learningPath = `Learn SQL basics through SQLZoo, practice with real datasets, take database design courses`;
      } else if (skill.includes('design') || skill.includes('figma') || skill.includes('ui')) {
        learningPath = `Complete UI/UX design courses, build portfolio projects, study design systems`;
      } else if (skill.includes('communication') || skill.includes('presentation')) {
        learningPath = `Join public speaking clubs (Toastmasters), practice presentation skills, take business communication courses`;
      } else if (skill.includes('leadership') || skill.includes('management')) {
        learningPath = `Take leadership courses, seek mentorship opportunities, lead small team projects`;
      } else if (skill.includes('machine learning') || skill.includes('data')) {
        learningPath = `Complete ML specialization courses, work on Kaggle competitions, implement algorithms from scratch`;
      } else if (skill.includes('cad') || skill.includes('engineering')) {
        learningPath = `Learn CAD software through tutorials, complete engineering design projects, obtain certifications`;
      } else {
        learningPath = `Take online courses, practice through hands-on projects, seek mentorship in this area`;
      }

      recommendations.push({
        skill: comparison.skill,
        gap: comparison.gap,
        recommendation: learningPath,
        priority: comparison.gap > 50 ? 'high' : comparison.gap > 25 ? 'medium' : 'low'
      });
    }
  });

  return recommendations;
}

/**
 * Generate detailed learning path with structured learning items
 */
function generateDetailedLearningPath(skillComparisons, careerTitle) {
  const learningItems = [];

  skillComparisons.forEach(comparison => {
    if (comparison.gap > 30) {
      const skill = comparison.skill.toLowerCase();
      let topic = '';
      let difficulty = 'Intermediate';
      let estimatedDuration = '4-6 weeks';
      let prerequisites = [];
      let recommendedResource = '';
      let learningSteps = [];

      // Generate detailed learning paths based on skill type
      if (skill.includes('python') || skill.includes('programming') || skill.includes('java')) {
        topic = 'Programming Fundamentals';
        difficulty = 'Beginner';
        estimatedDuration = '6-8 weeks';
        prerequisites = ['Basic computer literacy', 'Mathematical aptitude'];
        recommendedResource = 'Coursera - Python for Everybody, edX - CS50';
        learningSteps = [
          'Complete basic syntax and data types course',
          'Practice with 50+ coding exercises',
          'Build 3 small projects (calculator, to-do list, weather app)',
          'Learn OOP concepts and apply to projects'
        ];
      } else if (skill.includes('sql') || skill.includes('database')) {
        topic = 'Database Management';
        difficulty = 'Beginner';
        estimatedDuration = '4-5 weeks';
        prerequisites = ['Basic programming knowledge', 'Understanding of data concepts'];
        recommendedResource = 'SQLZoo, Coursera - SQL for Data Science';
        learningSteps = [
          'Learn SQL basics (SELECT, WHERE, ORDER BY)',
          'Practice with SQLZoo tutorials',
          'Work with sample databases',
          'Learn JOINs and complex queries'
        ];
      } else if (skill.includes('design') || skill.includes('figma') || skill.includes('ui')) {
        topic = 'UI/UX Design';
        difficulty = 'Intermediate';
        estimatedDuration = '8-10 weeks';
        prerequisites = ['Creativity', 'Basic computer skills'];
        recommendedResource = 'Figma Academy, Coursera - UI/UX Design Specialization';
        learningSteps = [
          'Learn design principles and typography',
          'Master Figma interface and tools',
          'Create wireframes and prototypes',
          'Build a portfolio of 3-5 projects'
        ];
      } else if (skill.includes('communication') || skill.includes('presentation')) {
        topic = 'Communication Skills';
        difficulty = 'Beginner';
        estimatedDuration = '6-8 weeks';
        prerequisites = ['Basic language proficiency'];
        recommendedResource = 'Toastmasters International, Coursera - Communication Skills';
        learningSteps = [
          'Join Toastmasters or similar group',
          'Practice public speaking weekly',
          'Learn presentation structure',
          'Deliver 5 presentations with feedback'
        ];
      } else if (skill.includes('leadership') || skill.includes('management')) {
        topic = 'Leadership & Management';
        difficulty = 'Advanced';
        estimatedDuration = '8-12 weeks';
        prerequisites = ['Communication skills', 'Team experience'];
        recommendedResource = 'Harvard Business School Online, LinkedIn Learning';
        learningSteps = [
          'Complete leadership fundamentals course',
          'Lead a small team project',
          'Seek mentorship from experienced leaders',
          'Practice decision-making scenarios'
        ];
      } else if (skill.includes('machine learning') || skill.includes('data')) {
        topic = 'Machine Learning';
        difficulty = 'Advanced';
        estimatedDuration = '12-16 weeks';
        prerequisites = ['Python programming', 'Statistics', 'Linear algebra'];
        recommendedResource = 'Coursera - Machine Learning Specialization, Kaggle Learn';
        learningSteps = [
          'Complete ML fundamentals course',
          'Implement algorithms from scratch',
          'Participate in Kaggle competitions',
          'Build 2-3 ML projects with real data'
        ];
      } else if (skill.includes('cad') || skill.includes('engineering')) {
        topic = 'CAD & Engineering Design';
        difficulty = 'Intermediate';
        estimatedDuration = '8-10 weeks';
        prerequisites = ['Engineering fundamentals', 'Technical drawing'];
        recommendedResource = 'Autodesk University, SolidWorks tutorials';
        learningSteps = [
          'Learn CAD software interface',
          'Complete tutorial projects',
          'Design mechanical components',
          'Obtain CAD certification'
        ];
      } else {
        topic = comparison.skill;
        difficulty = 'Intermediate';
        estimatedDuration = '6-8 weeks';
        prerequisites = ['General subject knowledge'];
        recommendedResource = 'Coursera, edX, Udemy';
        learningSteps = [
          'Research best practices in this area',
          'Complete introductory course',
          'Practice with hands-on exercises',
          'Apply knowledge to real-world scenario'
        ];
      }

      learningItems.push({
        skill: comparison.skill,
        topic: topic,
        difficulty: difficulty,
        estimatedDuration: estimatedDuration,
        prerequisites: prerequisites,
        recommendedResource: recommendedResource,
        learningSteps: learningSteps,
        gap: comparison.gap,
        priority: comparison.gap > 50 ? 'high' : comparison.gap > 25 ? 'medium' : 'low',
        completed: false,
        completedAt: null
      });
    }
  });

  // Sort by priority and gap size
  learningItems.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.gap - a.gap;
  });

  return learningItems;
}

/**
 * Generate project recommendations based on career and skill gaps
 */
function generateProjectRecommendations(careerTitle, skillComparisons) {
  const projects = [];
  const career = careers.find(c => c.title.toLowerCase() === careerTitle.toLowerCase());

  if (!career) return projects;

  const topGaps = skillComparisons
    .filter(c => c.gap > 30)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3);

  const careerType = career.title.toLowerCase();

  // Generate career-specific project recommendations
  if (careerType.includes('software') || careerType.includes('developer')) {
    projects.push({
      title: 'Full-Stack Web Application',
      description: 'Build a complete web app using modern frameworks, database integration, and deployment',
      skills: topGaps.slice(0, 2).map(g => g.skill),
      difficulty: 'Intermediate',
      estimatedTime: '4-6 weeks'
    });
    projects.push({
      title: 'API Development Project',
      description: 'Design and implement RESTful APIs with proper authentication and documentation',
      skills: topGaps.slice(0, 2).map(g => g.skill),
      difficulty: 'Beginner',
      estimatedTime: '2-3 weeks'
    });
  } else if (careerType.includes('data') || careerType.includes('machine learning')) {
    projects.push({
      title: 'Predictive Analytics Dashboard',
      description: 'Build a data visualization dashboard with ML models for prediction',
      skills: topGaps.slice(0, 2).map(g => g.skill),
      difficulty: 'Advanced',
      estimatedTime: '6-8 weeks'
    });
    projects.push({
      title: 'Kaggle Competition Project',
      description: 'Participate in a Kaggle competition to apply data science skills',
      skills: topGaps.slice(0, 2).map(g => g.skill),
      difficulty: 'Intermediate',
      estimatedTime: '4-6 weeks'
    });
  } else if (careerType.includes('design') || careerType.includes('ux')) {
    projects.push({
      title: 'Mobile App Redesign',
      description: 'Redesign an existing mobile app with improved UX and updated UI',
      skills: topGaps.slice(0, 2).map(g => g.skill),
      difficulty: 'Intermediate',
      estimatedTime: '3-4 weeks'
    });
    projects.push({
      title: 'Design System Creation',
      description: 'Create a comprehensive design system with components and guidelines',
      skills: topGaps.slice(0, 2).map(g => g.skill),
      difficulty: 'Advanced',
      estimatedTime: '4-5 weeks'
    });
  } else if (careerType.includes('business') || careerType.includes('analyst')) {
    projects.push({
      title: 'Business Process Analysis',
      description: 'Analyze and optimize a business process with data-driven recommendations',
      skills: topGaps.slice(0, 2).map(g => g.skill),
      difficulty: 'Intermediate',
      estimatedTime: '3-4 weeks'
    });
    projects.push({
      title: 'Market Research Project',
      description: 'Conduct comprehensive market research and present strategic insights',
      skills: topGaps.slice(0, 2).map(g => g.skill),
      difficulty: 'Beginner',
      estimatedTime: '2-3 weeks'
    });
  } else {
    // Generic project recommendations
    projects.push({
      title: 'Capstone Project',
      description: `Create a comprehensive project demonstrating key ${career.title} skills`,
      skills: topGaps.slice(0, 2).map(g => g.skill),
      difficulty: 'Intermediate',
      estimatedTime: '4-6 weeks'
    });
    projects.push({
      title: 'Skill-Building Mini Projects',
      description: 'Complete 2-3 smaller projects focusing on specific skill gaps',
      skills: topGaps.slice(0, 2).map(g => g.skill),
      difficulty: 'Beginner',
      estimatedTime: '2-3 weeks each'
    });
  }

  return projects;
}

/**
 * Main function to perform complete skill gap analysis
 */
function analyzeSkillGap(studentProfile, careerTitle) {
  const career = careers.find(c => c.title.toLowerCase() === careerTitle.toLowerCase());
  
  if (!career) {
    throw new Error('Career not found');
  }

  const studentSkills = studentProfile.skills || [];
  const studentSubjects = studentProfile.strongSubjects || [];
  const studentInterests = studentProfile.interests || [];
  const skillScores = studentProfile.skillScores || {}; // Optional detailed skill scores

  // Calculate overall metrics
  const overallMatch = calculateSkillMatch(studentSkills, career.requiredSkills);
  
  // Generate detailed skill comparisons
  const skillComparisons = generateSkillComparisons(
    studentSkills,
    studentSubjects,
    career.requiredSkills,
    career.softSkills,
    skillScores
  );

  // Categorize skills by priority
  const skillCategories = categorizeSkills(skillComparisons);

  // Generate recommendations
  const learningRecommendations = generateLearningRecommendations(skillComparisons, career.title);
  const detailedLearningPath = generateDetailedLearningPath(skillComparisons, career.title);
  const projectRecommendations = generateProjectRecommendations(career.title, skillComparisons);

  return {
    careerTitle: career.title,
    studentProfile: {
      skills: studentSkills,
      subjects: studentSubjects,
      interests: studentInterests
    },
    overallMatch,
    skillComparisons,
    skillCategories,
    learningRecommendations,
    detailedLearningPath,
    projectRecommendations,
    generatedAt: new Date().toISOString()
  };
}

module.exports = {
  analyzeSkillGap,
  calculateSkillMatch,
  generateSkillComparisons,
  categorizeSkills,
  generateLearningRecommendations,
  generateDetailedLearningPath,
  generateProjectRecommendations
};
