const careers = require('../data/careers.json');

/**
 * Generate a personalized career roadmap based on career data and user profile
 */
function generateRoadmap(career, userProfile) {
  const { currentEducation, interests, skills, strongSubjects } = userProfile;
  
  // Base roadmap steps that apply to most careers
  const baseSteps = [
    {
      id: 'current_education',
      title: 'Current Education',
      description: `Complete your current education in ${currentEducation || 'your current program'}`,
      skills: strongSubjects || [],
      recommendedLearning: 'Focus on maintaining good grades in your current subjects',
      estimatedDuration: '6-12 months',
      status: 'in_progress',
      order: 1
    },
    {
      id: 'entrance_exam',
      title: 'Entrance Exam Preparation',
      description: `Prepare for ${career.relatedEntranceExams?.[0] || 'relevant entrance exams'}`,
      skills: ['test-taking', 'time management', 'subject knowledge'],
      recommendedLearning: `Focus on ${strongSubjects?.slice(0, 2).join(' and ') || 'core subjects'}`,
      estimatedDuration: '3-6 months',
      status: 'pending',
      order: 2
    },
    {
      id: 'degree_course',
      title: career.requiredEducation || 'Degree/Course',
      description: `Enroll in and complete ${career.requiredEducation || 'relevant degree program'}`,
      skills: career.requiredSkills?.slice(0, 3) || ['subject expertise'],
      recommendedLearning: career.recommendedCourses?.slice(0, 2).join(', ') || 'Core curriculum',
      estimatedDuration: '3-4 years',
      status: 'pending',
      order: 3
    },
    {
      id: 'required_skills',
      title: 'Required Skills Development',
      description: 'Develop core technical skills required for the career',
      skills: career.requiredSkills || [],
      recommendedLearning: 'Online courses, workshops, and practical projects',
      estimatedDuration: '6-12 months',
      status: 'pending',
      order: 4
    },
    {
      id: 'projects',
      title: 'Build Projects',
      description: 'Create practical projects to demonstrate your skills',
      skills: career.requiredSkills?.slice(0, 2) || ['practical application'],
      recommendedLearning: 'Hands-on project work, GitHub portfolio',
      estimatedDuration: '3-6 months',
      status: 'pending',
      order: 5
    },
    {
      id: 'internship',
      title: 'Internship/Work Experience',
      description: 'Gain real-world experience through internships',
      skills: career.softSkills?.slice(0, 2) || ['teamwork', 'communication'],
      recommendedLearning: 'Industry exposure, professional networking',
      estimatedDuration: '3-6 months',
      status: 'pending',
      order: 6
    },
    {
      id: 'resume',
      title: 'Resume Building',
      description: 'Create a professional resume highlighting your achievements',
      skills: ['communication', 'presentation'],
      recommendedLearning: 'Resume writing workshops, portfolio development',
      estimatedDuration: '1-2 weeks',
      status: 'pending',
      order: 7
    },
    {
      id: 'interview_prep',
      title: 'Interview Preparation',
      description: 'Prepare for job interviews in your chosen field',
      skills: career.softSkills || ['communication', 'problem-solving'],
      recommendedLearning: 'Mock interviews, technical practice, company research',
      estimatedDuration: '1-2 months',
      status: 'pending',
      order: 8
    },
    {
      id: 'job',
      title: 'Job Application',
      description: `Apply for ${career.possibleJobRoles?.[0] || 'relevant positions'}`,
      skills: career.requiredSkills?.slice(0, 2) || ['core competencies'],
      recommendedLearning: 'Job search strategies, networking, applications',
      estimatedDuration: '2-6 months',
      status: 'pending',
      order: 9
    }
  ];

  // Customize steps based on career-specific requirements
  const customizedSteps = baseSteps.map(step => {
    // Customize based on career type
    if (career.title.toLowerCase().includes('software') || career.title.toLowerCase().includes('developer')) {
      if (step.id === 'required_skills') {
        step.recommendedLearning = 'Programming languages, algorithms, data structures, frameworks';
      }
      if (step.id === 'projects') {
        step.recommendedLearning = 'GitHub projects, open source contributions, hackathons';
      }
    }
    
    if (career.title.toLowerCase().includes('design')) {
      if (step.id === 'required_skills') {
        step.recommendedLearning = 'Design tools (Figma, Adobe), design principles, user research';
      }
      if (step.id === 'projects') {
        step.recommendedLearning = 'Design portfolio, case studies, UI/UX projects';
      }
    }
    
    if (career.title.toLowerCase().includes('data') || career.title.toLowerCase().includes('analyst')) {
      if (step.id === 'required_skills') {
        step.recommendedLearning = 'Statistics, programming (Python/R), data visualization, machine learning';
      }
      if (step.id === 'projects') {
        step.recommendedLearning = 'Data analysis projects, Kaggle competitions, dashboards';
      }
    }

    return step;
  });

  return {
    careerTitle: career.title,
    userId: userProfile.userId,
    steps: customizedSteps,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Calculate completion percentage for a roadmap
 */
function calculateCompletionPercentage(roadmap) {
  if (!roadmap.steps || roadmap.steps.length === 0) return 0;
  
  const completedSteps = roadmap.steps.filter(step => step.status === 'completed').length;
  return Math.round((completedSteps / roadmap.steps.length) * 100);
}

module.exports = {
  generateRoadmap,
  calculateCompletionPercentage
};
