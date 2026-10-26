const JsonDB = require('../config/jsonDb');

const scholarshipDb = new JsonDB('scholarships.json');
const savedScholarshipsDb = new JsonDB('savedScholarships.json');

const Scholarship = {
  create: (data) => scholarshipDb.create(data),

  findOne: (query) => scholarshipDb.findOne(query),

  findById: (id) => {
    const scholarship = scholarshipDb.findById(id);
    if (scholarship) {
      return {
        ...scholarship,
        deadlineStatus: scholarship.deadlineStatus || Scholarship.getDeadlineStatus(scholarship.deadline)
      };
    }
    return scholarship;
  },

  findAll: (options = {}) => {
    const scholarships = scholarshipDb.findAll();
    const includeInactive = options.includeInactive || false;

    return scholarships
      .filter(scholarship => includeInactive || (scholarship.isActive !== false && scholarship.status !== 'discontinued'))
      .map(scholarship => ({
        ...scholarship,
        deadlineStatus: scholarship.deadlineStatus || Scholarship.getDeadlineStatus(scholarship.deadline)
      }));
  },

  find: (query) => {
    const items = scholarshipDb.findAll();
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  },

  updateById: (id, updates) => scholarshipDb.updateById(id, updates),

  deleteById: (id) => scholarshipDb.deleteById(id),

  // Calculate deadline status based on current date
  getDeadlineStatus: (deadline) => {
    if (!deadline) {
      return 'deadline unavailable';
    }

    const currentDate = new Date();
    const deadlineDate = new Date(deadline);

    if (isNaN(deadlineDate.getTime())) {
      return 'deadline unavailable';
    }

    if (deadlineDate < currentDate) {
      return 'closed';
    }

    // If deadline is in the future, we cannot confirm if applications are open
    // without additional information about application period start date
    return 'verification required';
  },

  // Search scholarships with filters
  search: (filters) => {
    const scholarships = scholarshipDb.findAll();
    const includeInactive = filters.includeInactive || false;

    return scholarships
      .filter(scholarship => {
        // Exclude discontinued scholarships unless explicitly included
        if (!includeInactive && (scholarship.isActive === false || scholarship.status === 'discontinued')) return false;

        // Text search
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          const matchesSearch =
            scholarship.name.toLowerCase().includes(searchTerm) ||
            scholarship.eligibility.toLowerCase().includes(searchTerm) ||
            scholarship.category.toLowerCase().includes(searchTerm);
          if (!matchesSearch) return false;
        }

        // Education level filter
        if (filters.educationLevel && scholarship.educationLevel !== filters.educationLevel) return false;

        // State filter
        if (filters.state && scholarship.state !== filters.state) return false;

        // Course filter
        if (filters.course && !scholarship.courses.includes(filters.course)) return false;

        // Income range filter
        if (filters.incomeRange && scholarship.incomeRange !== filters.incomeRange) return false;

        // Category filter
        if (filters.category && scholarship.category !== filters.category) return false;

        // Provider type filter (Government/Private)
        if (filters.providerType && scholarship.providerType !== filters.providerType) return false;

        return true;
      })
      .map(scholarship => ({
        ...scholarship,
        deadlineStatus: scholarship.deadlineStatus || Scholarship.getDeadlineStatus(scholarship.deadline)
      }));
  },

  // Get scholarships by course
  getByCourse: (course) => {
    const scholarships = scholarshipDb.findAll();
    return scholarships.filter(scholarship => 
      scholarship.courses.includes(course)
    );
  },

  // Get scholarships by state
  getByState: (state) => {
    const scholarships = scholarshipDb.findAll();
    return scholarships.filter(scholarship => scholarship.state === state);
  },

  // Get scholarships by category
  getByCategory: (category) => {
    const scholarships = scholarshipDb.findAll();
    return scholarships.filter(scholarship => scholarship.category === category);
  },

  // Parse income range to get numeric limit in lakhs
  parseIncomeRange: (incomeRange) => {
    if (!incomeRange || incomeRange === 'No Income Limit') {
      return Infinity;
    }

    const match = incomeRange.match(/Below\s*₹?([\d.]+)\s*Lakhs/i);
    if (match) {
      return parseFloat(match[1]);
    }
    return Infinity;
  },

  // Check eligibility for a scholarship based on user profile
  checkEligibility: (scholarship, userProfile) => {
    const requirements = {
      satisfied: [],
      notSatisfied: [],
      missing: []
    };

    if (!userProfile) {
      requirements.missing.push('User profile information');
      return {
        result: 'potentially eligible',
        requirements,
        explanation: 'Please complete your education profile to check eligibility.'
      };
    }

    // Check education level - only if explicitly stated in scholarship
    if (scholarship.educationLevel && userProfile.educationLevel) {
      if (scholarship.educationLevel === userProfile.educationLevel ||
          scholarship.educationLevel === 'All India' ||
          userProfile.educationLevel === 'All India') {
        requirements.satisfied.push(`Education level: ${scholarship.educationLevel}`);
      } else {
        requirements.notSatisfied.push(`Education level: Requires ${scholarship.educationLevel}, you have ${userProfile.educationLevel}`);
      }
    } else if (scholarship.educationLevel && scholarship.educationLevel !== 'All India') {
      requirements.missing.push('Education level in your profile');
    }

    // Check state/domicile - only if explicitly stated
    if (scholarship.state && userProfile.state) {
      if (scholarship.state === 'All India' ||
          userProfile.state === 'All India' ||
          scholarship.state === userProfile.state) {
        requirements.satisfied.push(`State/Domicile: ${scholarship.state}`);
      } else {
        requirements.notSatisfied.push(`State/Domicile: Requires ${scholarship.state}, you have ${userProfile.state}`);
      }
    } else if (scholarship.state && scholarship.state !== 'All India') {
      requirements.missing.push('State/Domicile in your profile');
    }

    // Check category - only if explicitly stated
    // For specific categories like "Wards of Ex-Servicemen", "Minority", "Persons with Disabilities",
    // we cannot infer eligibility from "General" category in profile
    if (scholarship.category && userProfile.category) {
      const specificCategories = ['Wards of Ex-Servicemen', 'Minority', 'Persons with Disabilities'];
      if (specificCategories.includes(scholarship.category)) {
        // These require specific verification - cannot be inferred from General
        if (scholarship.category === userProfile.category) {
          requirements.satisfied.push(`Category: ${scholarship.category}`);
        } else {
          requirements.notSatisfied.push(`Category: Requires ${scholarship.category}, you have ${userProfile.category}`);
        }
      } else if (scholarship.category === 'General' || userProfile.category === 'General') {
        requirements.satisfied.push(`Category: ${scholarship.category}`);
      } else if (scholarship.category === userProfile.category) {
        requirements.satisfied.push(`Category: ${scholarship.category}`);
      } else {
        requirements.notSatisfied.push(`Category: Requires ${scholarship.category}, you have ${userProfile.category}`);
      }
    } else if (scholarship.category && scholarship.category !== 'General') {
      requirements.missing.push(`Category in your profile (required: ${scholarship.category})`);
    }

    // Check family income - only if explicitly stated
    if (scholarship.incomeRange && userProfile.familyIncome !== undefined) {
      const scholarshipLimit = Scholarship.parseIncomeRange(scholarship.incomeRange);
      const userIncome = parseFloat(userProfile.familyIncome) || 0;

      if (scholarshipLimit === Infinity || userIncome <= scholarshipLimit) {
        requirements.satisfied.push(`Family income: ${scholarship.incomeRange}`);
      } else {
        requirements.notSatisfied.push(`Family income: Requires ${scholarship.incomeRange}, your income is ₹${userIncome} Lakhs`);
      }
    } else if (scholarship.incomeRange && scholarship.incomeRange !== 'No Income Limit') {
      requirements.missing.push('Family income in your profile');
    }

    // Check minimum academic percentage (from eligibility text) - only if explicitly stated
    if (scholarship.eligibility) {
      const percentageMatch = scholarship.eligibility.match(/minimum\s*(\d+)%/i);
      if (percentageMatch && userProfile.academicPercentage !== undefined) {
        const requiredPercentage = parseInt(percentageMatch[1]);
        const userPercentage = parseFloat(userProfile.academicPercentage) || 0;

        if (userPercentage >= requiredPercentage) {
          requirements.satisfied.push(`Academic percentage: ${requiredPercentage}% minimum`);
        } else {
          requirements.notSatisfied.push(`Academic percentage: Requires ${requiredPercentage}%, you have ${userPercentage}%`);
        }
      } else if (percentageMatch) {
        requirements.missing.push('Academic percentage in your profile');
      }
    }

    // Check disability percentage if scholarship is for PWD - only if explicitly stated
    if (scholarship.category === 'Persons with Disabilities') {
      if (userProfile.disabilityPercentage !== undefined) {
        const disabilityPercent = parseFloat(userProfile.disabilityPercentage) || 0;
        if (disabilityPercent >= 40) {
          requirements.satisfied.push(`Disability percentage: ${disabilityPercent}%`);
        } else {
          requirements.notSatisfied.push(`Disability percentage: Requires minimum 40%, you have ${disabilityPercent}%`);
        }
      } else {
        requirements.missing.push('Disability percentage in your profile');
      }
    }

    // Add verification note for demo records
    if (scholarship.verificationStatus === 'demo') {
      requirements.missing.push('Official verification (this is demo data - verify with official source)');
    }

    // Determine overall result
    if (requirements.notSatisfied.length > 0) {
      return {
        result: 'not eligible',
        requirements,
        explanation: 'You do not meet some eligibility requirements.'
      };
    } else if (requirements.missing.length > 0) {
      return {
        result: 'potentially eligible',
        requirements,
        explanation: 'You may be eligible, but we need more information to confirm. Please complete your profile and verify requirements with the official scholarship provider.'
      };
    } else {
      return {
        result: 'eligible',
        requirements,
        explanation: 'You meet all the eligibility requirements based on your profile. Please verify all details with the official scholarship provider before applying.'
      };
    }
  }
};

const SavedScholarship = {
  create: (data) => savedScholarshipsDb.create(data),

  findOne: (query) => savedScholarshipsDb.findOne(query),

  findById: (id) => savedScholarshipsDb.findById(id),

  findAll: () => savedScholarshipsDb.findAll(),

  find: (query) => {
    const items = savedScholarshipsDb.findAll();
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  },

  updateById: (id, updates) => savedScholarshipsDb.updateById(id, updates),

  deleteById: (id) => savedScholarshipsDb.deleteById(id),

  // Get saved scholarships for a user
  getUserSavedScholarships: (userId) => {
    const savedScholarships = savedScholarshipsDb.findAll();
    return savedScholarships.filter(item => item.user === userId);
  },

  // Check if scholarship is saved by user
  isScholarshipSaved: (userId, scholarshipId) => {
    const savedScholarships = savedScholarshipsDb.findAll();
    return savedScholarships.some(item => item.user === userId && item.scholarshipId === scholarshipId);
  },

  // Remove saved scholarship
  removeSavedScholarship: (userId, scholarshipId) => {
    const savedScholarships = savedScholarshipsDb.findAll();
    const index = savedScholarships.findIndex(item => item.user === userId && item.scholarshipId === scholarshipId);
    if (index === -1) return false;

    savedScholarships.splice(index, 1);
    savedScholarshipsDb.write(savedScholarships);
    return true;
  }
};

module.exports = { Scholarship, SavedScholarship };
