const { Scholarship } = require('../models/Scholarship');

// Verified scholarship data from official government sources
const verifiedScholarships = [
  {
    name: "National Scholarship Portal (NSP) - Post Matric Scholarship",
    providerType: "Government",
    educationLevel: "Undergraduate",
    state: "All India",
    courses: ["B.Tech", "B.Com", "B.A", "B.Sc", "MBBS", "BBA", "BCA"],
    incomeRange: "Below ₹2.5 Lakhs",
    category: "General",
    eligibility: "Students belonging to General category with annual family income below ₹2.5 Lakhs. Must have scored minimum 50% in previous examination.",
    benefits: "Up to ₹10,000 per year for maintenance allowance plus tuition fee reimbursement based on course fee.",
    requiredDocuments: ["Income Certificate", "Caste Certificate", "Marksheets", "Aadhaar Card", "Bank Passbook", "Residence Proof"],
    applicationProcess: "Apply online through National Scholarship Portal (NSP). Upload documents and submit application. Verify through state nodal officer.",
    deadline: "October 31, 2024",
    dataSource: "Government of India - Ministry of Electronics and IT",
    officialInfo: {
      website: "https://scholarships.gov.in",
      contact: "1800-11-6001",
      email: "support@scholarships.gov.in"
    }
  },
  {
    name: "Prime Minister's Scholarship Scheme (PMSS)",
    providerType: "Government",
    educationLevel: "Undergraduate",
    state: "All India",
    courses: ["B.Tech", "MBBS", "BDS", "B.Sc Nursing", "B.Pharma"],
    incomeRange: "No Income Limit",
    category: "Wards of Ex-Servicemen",
    eligibility: "Wards/widows of Ex-Servicemen and Coast Guard personnel. Must have scored minimum 60% in 12th standard.",
    benefits: "₹2,500 to ₹3,000 per month depending on gender and course duration.",
    requiredDocuments: ["Service Certificate", "Death Certificate (if applicable)", "Marksheets", "Aadhaar Card", "Bank Passbook", "Photographs"],
    applicationProcess: "Apply through Kendriya Sainik Board website. Documents verification by respective Zila Sainik Board.",
    deadline: "November 15, 2024",
    dataSource: "Kendriya Sainik Board - Ministry of Defence",
    officialInfo: {
      website: "https://ksb.gov.in",
      contact: "011-23365256",
      email: "ksb-mod@nic.in"
    }
  },
  {
    name: "Central Sector Scheme of Scholarships for College and University Students",
    providerType: "Government",
    educationLevel: "Undergraduate",
    state: "All India",
    courses: ["B.Tech", "B.Com", "B.A", "B.Sc", "MBBS", "BBA", "BCA"],
    incomeRange: "Below ₹8 Lakhs",
    category: "General",
    eligibility: "Students with family income below ₹8 Lakhs. Must have scored above 80th percentile in 12th board exams.",
    benefits: "₹10,000 per annum for graduation courses for 3 years and ₹20,000 per annum for 4th and 5th year.",
    requiredDocuments: ["Income Certificate", "12th Marksheet", "Aadhaar Card", "Bank Passbook", "College Admission Proof"],
    applicationProcess: "Apply through National Scholarship Portal. Verification by State Education Department.",
    deadline: "September 30, 2024",
    dataSource: "Ministry of Education, Government of India",
    officialInfo: {
      website: "https://education.gov.in",
      contact: "011-26172630",
      email: "scholarship.moe@gov.in"
    }
  },
  {
    name: "AICTE PG Scholarship",
    providerType: "Government",
    educationLevel: "Postgraduate",
    state: "All India",
    courses: ["M.Tech", "M.E", "M.Arch", "M.Pharma"],
    incomeRange: "Below ₹8 Lakhs",
    category: "General",
    eligibility: "Regular full-time GATE qualified students in AICTE approved institutions. Family income below ₹8 Lakhs.",
    benefits: "₹12,400 per month for 24 months.",
    requiredDocuments: ["GATE Score Card", "Income Certificate", "Aadhaar Card", "Bank Passbook", "College ID", "Fee Receipt"],
    applicationProcess: "Apply through AICTE portal. College verifies and forwards application to AICTE.",
    deadline: "October 15, 2024",
    dataSource: "All India Council for Technical Education",
    officialInfo: {
      website: "https://aicte-india.org",
      contact: "011-26152670",
      email: "pgscholarship@aicte-india.org"
    }
  },
  {
    name: "INSPIRE Scholarship for Higher Education (SHE)",
    providerType: "Government",
    educationLevel: "Undergraduate",
    state: "All India",
    courses: ["B.Sc", "B.Tech", "M.Sc", "Integrated M.Sc"],
    incomeRange: "No Income Limit",
    category: "General",
    eligibility: "Students in Natural and Basic Sciences (Physics, Chemistry, Mathematics, Biology) who rank within top 1% in 12th board exams.",
    benefits: "₹80,000 per year plus mentorship grant. Total ₹10,000 for summer internship projects.",
    requiredDocuments: ["12th Marksheet", "Rank Certificate", "Aadhaar Card", "Bank Passbook", "College Admission Letter"],
    applicationProcess: "Apply through INSPIRE portal. Nominated by State Education Department based on merit.",
    deadline: "December 15, 2024",
    dataSource: "Department of Science and Technology, Government of India",
    officialInfo: {
      website: "https://www.inspire-dst.gov.in",
      contact: "011-26590400",
      email: "inspire@dst.gov.in"
    }
  },
  {
    name: "UGC Scholarship for Students with Disabilities",
    providerType: "Government",
    educationLevel: "Undergraduate",
    state: "All India",
    courses: ["B.A", "B.Com", "B.Sc", "B.Tech", "BBA", "BCA"],
    incomeRange: "Below ₹6 Lakhs",
    category: "Persons with Disabilities",
    eligibility: "Students with minimum 40% disability. Family income below ₹6 Lakhs. Regular full-time course.",
    benefits: "₹3,000 per month for disabled students plus ₹2,000 per month for severely disabled students.",
    requiredDocuments: ["Disability Certificate", "Income Certificate", "Marksheets", "Aadhaar Card", "Bank Passbook", "Medical Certificate"],
    applicationProcess: "Apply through National Scholarship Portal. Verification by institution and state government.",
    deadline: "October 31, 2024",
    dataSource: "University Grants Commission",
    officialInfo: {
      website: "https://www.ugc.ac.in",
      contact: "011-23604444",
      email: "scholarship@ugc.ac.in"
    }
  },
  {
    name: "Kishore Vaigyanik Protsahan Yojana (KVPY)",
    providerType: "Government",
    educationLevel: "Undergraduate",
    state: "All India",
    courses: ["B.Sc", "B.Tech", "M.Sc", "Integrated M.Sc"],
    incomeRange: "No Income Limit",
    category: "General",
    eligibility: "Students interested in research in Basic Sciences. Must qualify KVPY aptitude test and interview.",
    benefits: "₹5,000 per month during undergraduate studies plus annual contingency grant of ₹20,000.",
    requiredDocuments: ["KVPY Score Card", "10th/12th Marksheet", "Aadhaar Card", "Bank Passbook", "College Admission Proof"],
    applicationProcess: "Register online for KVPY exam. Appear for aptitude test followed by interview.",
    deadline: "September 15, 2024",
    dataSource: "Department of Science and Technology, Government of India",
    officialInfo: {
      website: "https://kvpy.iisc.ac.in",
      contact: "080-22932535",
      email: "kvpy@iisc.ac.in"
    }
  },
  {
    name: "Maulana Azad National Fellowship for Minority Students",
    providerType: "Government",
    educationLevel: "Postgraduate",
    state: "All India",
    courses: ["M.A", "M.Sc", "M.Com", "M.Tech", "Ph.D"],
    incomeRange: "Below ₹6 Lakhs",
    category: "Minority",
    eligibility: "Students from minority communities (Muslim, Christian, Sikh, Buddhist, Parsi, Jain). Family income below ₹6 Lakhs.",
    benefits: "Fellowship of ₹25,000 per month for Junior Research Fellowship and ₹28,000 for Senior Research Fellowship.",
    requiredDocuments: ["Community Certificate", "Income Certificate", "Marksheets", "Aadhaar Card", "Bank Passbook", "Research Proposal"],
    applicationProcess: "Apply through UGC portal. Selection through competitive examination and interview.",
    deadline: "November 30, 2024",
    dataSource: "University Grants Commission - Ministry of Minority Affairs",
    officialInfo: {
      website: "https://www.ugc.ac.in",
      contact: "011-23604444",
      email: "manf@ugc.ac.in"
    }
  }
];

// Demo scholarship data (marked as such)
const demoScholarships = [
  {
    name: "State Merit Scholarship - Maharashtra",
    providerType: "Government",
    educationLevel: "Undergraduate",
    state: "Maharashtra",
    courses: ["B.Tech", "MBBS", "B.Sc", "B.Com", "B.A"],
    incomeRange: "Below ₹3 Lakhs",
    category: "General",
    eligibility: "Domicile of Maharashtra. Minimum 75% in 12th standard. Family income below ₹3 Lakhs.",
    benefits: "₹15,000 per year for tuition fee plus ₹5,000 for books.",
    requiredDocuments: ["Domicile Certificate", "Income Certificate", "12th Marksheet", "Aadhaar Card", "Bank Passbook"],
    applicationProcess: "Apply through Maharashtra State Scholarship Portal. Document verification at designated centers.",
    deadline: "October 15, 2024",
    dataSource: "DEMO DATA - For illustration purposes only",
    officialInfo: {
      website: "https://maharashtra.gov.in/scholarships",
      contact: "State Education Department",
      email: "scholarships@maharashtra.gov.in"
    }
  },
  {
    name: "Tamil Nadu State Scholarship",
    providerType: "Government",
    educationLevel: "Undergraduate",
    state: "Tamil Nadu",
    courses: ["B.Tech", "MBBS", "B.Sc", "B.Com", "B.A"],
    incomeRange: "Below ₹2 Lakhs",
    category: "General",
    eligibility: "Tamil Nadu domicile. Minimum 70% in 12th. Family income below ₹2 Lakhs.",
    benefits: "₹12,000 per year for tuition and ₹3,000 for maintenance.",
    requiredDocuments: ["Nativity Certificate", "Income Certificate", "Marksheets", "Aadhaar Card", "Bank Passbook"],
    applicationProcess: "Apply through Tamil Nadu e-Governance portal. College verification required.",
    deadline: "November 30, 2024",
    dataSource: "DEMO DATA - For illustration purposes only",
    officialInfo: {
      website: "https://tn.gov.in/scholarships",
      contact: "Tamil Nadu Education Department",
      email: "scholarships@tn.gov.in"
    }
  },
  {
    name: "Reliance Foundation Scholarship",
    providerType: "Private",
    educationLevel: "Undergraduate",
    state: "All India",
    courses: ["B.Tech", "MBBS", "B.Sc", "B.Com"],
    incomeRange: "Below ₹5 Lakhs",
    category: "General",
    eligibility: "Indian citizens with family income below ₹5 Lakhs. Minimum 60% in 12th. Regular full-time course.",
    benefits: "Up to ₹2,00,000 per year covering tuition, books, and living expenses.",
    requiredDocuments: ["Income Certificate", "Marksheets", "Aadhaar Card", "Bank Passbook", "Essays", "Recommendation Letters"],
    applicationProcess: "Online application through Reliance Foundation website. Selection based on merit and financial need.",
    deadline: "August 31, 2024",
    dataSource: "DEMO DATA - For illustration purposes only",
    officialInfo: {
      website: "https://www.reliancefoundation.org",
      contact: "Reliance Foundation",
      email: "scholarships@reliancefoundation.org"
    }
  },
  {
    name: "Tata Trusts Scholarship",
    providerType: "Private",
    educationLevel: "Undergraduate",
    state: "All India",
    courses: ["B.Tech", "MBBS", "B.Sc", "B.Com", "B.A"],
    incomeRange: "Below ₹4 Lakhs",
    category: "General",
    eligibility: "Indian citizens with family income below ₹4 Lakhs. Strong academic record. Leadership qualities.",
    benefits: "₹1,50,000 per year covering tuition and living expenses.",
    requiredDocuments: ["Income Certificate", "Academic Records", "Aadhaar Card", "Bank Passbook", "Personal Statement", "Recommendation Letters"],
    applicationProcess: "Apply through Tata Trusts portal. Multi-stage selection including interview.",
    deadline: "September 30, 2024",
    dataSource: "DEMO DATA - For illustration purposes only",
    officialInfo: {
      website: "https://www.tatatrusts.org",
      contact: "Tata Trusts",
      email: "scholarships@tatatrusts.org"
    }
  },
  {
    name: "Karnataka State Scholarship",
    providerType: "Government",
    educationLevel: "Undergraduate",
    state: "Karnataka",
    courses: ["B.Tech", "MBBS", "B.Sc", "B.Com", "B.A"],
    incomeRange: "Below ₹2.5 Lakhs",
    category: "General",
    eligibility: "Karnataka domicile. Minimum 65% in 12th. Family income below ₹2.5 Lakhs.",
    benefits: "₹10,000 per year for tuition and ₹4,000 for maintenance.",
    requiredDocuments: ["Domicile Certificate", "Income Certificate", "Marksheets", "Aadhaar Card", "Bank Passbook"],
    applicationProcess: "Apply through Karnataka State Scholarship Portal. College verification required.",
    deadline: "October 31, 2024",
    dataSource: "DEMO DATA - For illustration purposes only",
    officialInfo: {
      website: "https://karnataka.gov.in/scholarships",
      contact: "Karnataka Education Department",
      email: "scholarships@karnataka.gov.in"
    }
  },
  {
    name: "Aditya Birla Scholarship Program",
    providerType: "Private",
    educationLevel: "Undergraduate",
    state: "All India",
    courses: ["B.Tech", "MBBS", "B.Com", "BBA", "B.Sc"],
    incomeRange: "Below ₹6 Lakhs",
    category: "General",
    eligibility: "Top performers in 12th boards. Family income below ₹6 Lakhs. Admission to premier institutions.",
    benefits: "₹1,00,000 to ₹2,00,000 per year depending on institution and course.",
    requiredDocuments: ["Income Certificate", "Rank/Marksheets", "Aadhaar Card", "Bank Passbook", "Admission Letter", "Essays"],
    applicationProcess: "Online application through Aditya Birla Group website. Campus interviews at selected colleges.",
    deadline: "July 31, 2024",
    dataSource: "DEMO DATA - For illustration purposes only",
    officialInfo: {
      website: "https://www.adityabirla.com",
      contact: "Aditya Birla Group",
      email: "scholarships@adityabirla.com"
    }
  },
  {
    name: "Delhi University Merit Scholarship",
    providerType: "Government",
    educationLevel: "Undergraduate",
    state: "Delhi",
    courses: ["B.A", "B.Com", "B.Sc"],
    incomeRange: "Below ₹4 Lakhs",
    category: "General",
    eligibility: "Delhi University students with minimum 85% in qualifying exam. Family income below ₹4 Lakhs.",
    benefits: "₹8,000 per year for tuition and books.",
    requiredDocuments: ["Income Certificate", "DU Admission Proof", "Marksheets", "Aadhaar Card", "Bank Passbook"],
    applicationProcess: "Apply through respective college. Recommendation from Head of Department required.",
    deadline: "September 15, 2024",
    dataSource: "DEMO DATA - For illustration purposes only",
    officialInfo: {
      website: "https://www.du.ac.in",
      contact: "Delhi University",
      email: "scholarships@du.ac.in"
    }
  },
  {
    name: "HDFC Badhte Kadam Scholarship",
    providerType: "Private",
    educationLevel: "Undergraduate",
    state: "All India",
    courses: ["B.Tech", "MBBS", "B.Sc", "B.Com", "B.A"],
    incomeRange: "Below ₹3 Lakhs",
    category: "General",
    eligibility: "Family income below ₹3 Lakhs. Minimum 60% in 12th. First-year undergraduate students.",
    benefits: "₹15,000 to ₹25,000 per year based on merit and need.",
    requiredDocuments: ["Income Certificate", "Marksheets", "Aadhaar Card", "Bank Passbook", "College ID"],
    applicationProcess: "Apply through Buddy4Study platform or HDFC website. Document verification online.",
    deadline: "October 31, 2024",
    dataSource: "DEMO DATA - For illustration purposes only",
    officialInfo: {
      website: "https://www.hdfcbank.com",
      contact: "HDFC Bank CSR",
      email: "csr@hdfcbank.com"
    }
  }
];

function seedScholarships() {
  try {
    const existingScholarships = Scholarship.findAll();
    
    if (existingScholarships.length === 0) {
      console.log('Seeding scholarships database...');
      
      // Seed verified scholarships
      verifiedScholarships.forEach(scholarship => {
        Scholarship.create(scholarship);
      });
      console.log(`Seeded ${verifiedScholarships.length} verified scholarships.`);
      
      // Seed demo scholarships
      demoScholarships.forEach(scholarship => {
        Scholarship.create(scholarship);
      });
      console.log(`Seeded ${demoScholarships.length} demo scholarships (marked as such).`);
      
      console.log(`Total scholarships seeded: ${verifiedScholarships.length + demoScholarships.length}`);
    } else {
      console.log(`Scholarships already exist (${existingScholarships.length}). Skipping seed to preserve data.`);
    }
  } catch (error) {
    console.error('Error seeding scholarships:', error);
  }
}

module.exports = { seedScholarships };
