const { School } = require('../models/School');

const sampleSchools = [
  // Government Schools
  {
    name: "Kendriya Vidyalaya No.1",
    city: "Delhi",
    state: "Delhi",
    board: "cbse",
    schoolType: "government",
    annualFee: 15000,
    hostelAvailable: false,
    grades: "1-12",
    studentCount: 2500,
    facultyCount: 120,
    rating: 4.2,
    facilities: ["Library", "Science Labs", "Computer Lab", "Sports Ground", "Music Room"],
    description: "Premier government school under Kendriya Vidyalaya Sangathan with excellent academic record.",
    contact: {
      phone: "+91-11-23456789",
      email: "kv1.delhi@kvsangathan.edu.in",
      address: "Sector 4, R.K. Puram, New Delhi"
    },
    website: "https://kv1delhi.edu.in"
  },
  {
    name: "Delhi Government School, Sarojini Nagar",
    city: "Delhi",
    state: "Delhi",
    board: "state",
    schoolType: "government",
    annualFee: 5000,
    hostelAvailable: false,
    grades: "6-12",
    studentCount: 1800,
    facultyCount: 85,
    rating: 3.8,
    facilities: ["Library", "Science Labs", "Computer Lab", "Sports Ground"],
    description: "Delhi government school focused on quality education with modern infrastructure.",
    contact: {
      phone: "+91-11-23456790",
      email: "dgs.sarojini@delhi.gov.in",
      address: "Sarojini Nagar, New Delhi"
    },
    website: "https://dgssarojini.delhi.gov.in"
  },
  {
    name: "Government Higher Secondary School",
    city: "Mumbai",
    state: "Maharashtra",
    board: "state",
    schoolType: "government",
    annualFee: 8000,
    hostelAvailable: false,
    grades: "8-12",
    studentCount: 1500,
    facultyCount: 70,
    rating: 3.6,
    facilities: ["Library", "Science Labs", "Computer Lab"],
    description: "State government school providing affordable education to local community.",
    contact: {
      phone: "+91-22-23456789",
      email: "ghss.mumbai@maharashtra.gov.in",
      address: "Dadar West, Mumbai"
    },
    website: "https://ghssmumbai.edu.in"
  },

  // Private Schools
  {
    name: "Delhi Public School, R.K. Puram",
    city: "Delhi",
    state: "Delhi",
    board: "cbse",
    schoolType: "private",
    annualFee: 250000,
    hostelAvailable: true,
    grades: "Nursery-12",
    studentCount: 3500,
    facultyCount: 200,
    rating: 4.5,
    facilities: ["Library", "Science Labs", "Computer Lab", "Sports Complex", "Swimming Pool", "Auditorium", "Music Room", "Art Studio", "Cafeteria"],
    description: "One of India's most prestigious private schools with world-class facilities and excellent academic performance.",
    contact: {
      phone: "+91-11-23456791",
      email: "info@dp rkpuram.com",
      address: "R.K. Puram, New Delhi"
    },
    website: "https://dpsrkpuram.com"
  },
  {
    name: "The Shri Ram School",
    city: "Gurgaon",
    state: "Haryana",
    board: "cbse",
    schoolType: "private",
    annualFee: 320000,
    hostelAvailable: false,
    grades: "Nursery-12",
    studentCount: 2800,
    facultyCount: 180,
    rating: 4.6,
    facilities: ["Library", "Science Labs", "Computer Lab", "Sports Ground", "Music Room", "Art Studio", "Theater", "Cafeteria"],
    description: "Progressive private school known for innovative teaching methods and holistic development.",
    contact: {
      phone: "+91-124-23456789",
      email: "admissions@tsrs.edu.in",
      address: "DLF Phase 3, Gurgaon"
    },
    website: "https://tsrs.edu.in"
  },
  {
    name: "Ryan International School",
    city: "Mumbai",
    state: "Maharashtra",
    board: "icse",
    schoolType: "private",
    annualFee: 180000,
    hostelAvailable: true,
    grades: "Nursery-12",
    studentCount: 3000,
    facultyCount: 150,
    rating: 4.1,
    facilities: ["Library", "Science Labs", "Computer Lab", "Sports Ground", "Music Room", "Cafeteria"],
    description: "Chain of private schools across India with focus on overall development and international exposure.",
    contact: {
      phone: "+91-22-23456792",
      email: "info@ryaninternational.com",
      address: "Bandra West, Mumbai"
    },
    website: "https://ryaninternational.com"
  },

  // CBSE Schools
  {
    name: "Bal Bharati Public School",
    city: "Delhi",
    state: "Delhi",
    board: "cbse",
    schoolType: "private",
    annualFee: 150000,
    hostelAvailable: false,
    grades: "Nursery-12",
    studentCount: 3200,
    facultyCount: 160,
    rating: 4.3,
    facilities: ["Library", "Science Labs", "Computer Lab", "Sports Ground", "Music Room", "Art Studio"],
    description: "Well-established CBSE school with strong academic tradition and co-curricular activities.",
    contact: {
      phone: "+91-11-23456793",
      email: "info@bbps.edu.in",
      address: "Pitampura, New Delhi"
    },
    website: "https://bbps.edu.in"
  },
  {
    name: "National Public School",
    city: "Bangalore",
    state: "Karnataka",
    board: "cbse",
    schoolType: "private",
    annualFee: 200000,
    hostelAvailable: true,
    grades: "Nursery-12",
    studentCount: 2500,
    facultyCount: 140,
    rating: 4.4,
    facilities: ["Library", "Science Labs", "Computer Lab", "Sports Complex", "Swimming Pool", "Auditorium", "Music Room"],
    description: "Premier CBSE school in Bangalore known for academic excellence and infrastructure.",
    contact: {
      phone: "+91-80-23456789",
      email: "info@nps.edu.in",
      address: "Indiranagar, Bangalore"
    },
    website: "https://nps.edu.in"
  },
  {
    name: "DAV Public School",
    city: "Chennai",
    state: "Tamil Nadu",
    board: "cbse",
    schoolType: "private",
    annualFee: 120000,
    hostelAvailable: false,
    grades: "LKG-12",
    studentCount: 2200,
    facultyCount: 110,
    rating: 4.0,
    facilities: ["Library", "Science Labs", "Computer Lab", "Sports Ground", "Music Room"],
    description: "DAV institution following CBSE curriculum with emphasis on Indian values and modern education.",
    contact: {
      phone: "+91-44-23456789",
      email: "info@davchennai.edu.in",
      address: "Mogappair, Chennai"
    },
    website: "https://davchennai.edu.in"
  },

  // ICSE Schools
  {
    name: "Cathedral and John Connon School",
    city: "Mumbai",
    state: "Maharashtra",
    board: "icse",
    schoolType: "private",
    annualFee: 350000,
    hostelAvailable: false,
    grades: "Nursery-12",
    studentCount: 2000,
    facultyCount: 120,
    rating: 4.7,
    facilities: ["Library", "Science Labs", "Computer Lab", "Sports Ground", "Music Room", "Art Studio", "Theater", "Cafeteria"],
    description: "Elite ICSE school in Mumbai with heritage and excellent academic reputation.",
    contact: {
      phone: "+91-22-23456794",
      email: "info@cathedral.school",
      address: "Fort, Mumbai"
    },
    website: "https://cathedral.school"
  },
  {
    name: "La Martiniere for Girls",
    city: "Kolkata",
    state: "West Bengal",
    board: "icse",
    schoolType: "private",
    annualFee: 280000,
    hostelAvailable: true,
    grades: "Nursery-12",
    studentCount: 1800,
    facultyCount: 100,
    rating: 4.5,
    facilities: ["Library", "Science Labs", "Computer Lab", "Sports Ground", "Music Room", "Art Studio", "Auditorium"],
    description: "Prestigious girls' school following ICSE curriculum with rich cultural heritage.",
    contact: {
      phone: "+91-33-23456789",
      email: "info@lamartiniere.edu.in",
      address: "Loudon Street, Kolkata"
    },
    website: "https://lamartiniere.edu.in"
  },
  {
    name: "St. Xavier's School",
    city: "Delhi",
    state: "Delhi",
    board: "icse",
    schoolType: "private",
    annualFee: 220000,
    hostelAvailable: false,
    grades: "Nursery-12",
    studentCount: 2400,
    facultyCount: 130,
    rating: 4.3,
    facilities: ["Library", "Science Labs", "Computer Lab", "Sports Ground", "Music Room", "Auditorium"],
    description: "Jesuit institution following ICSE curriculum with focus on academic excellence and character building.",
    contact: {
      phone: "+91-11-23456795",
      email: "info@stxaviers.edu.in",
      address: "Raj Niwas Marg, Delhi"
    },
    website: "https://stxaviers.edu.in"
  },

  // State Board Schools
  {
    name: "Maharashtra State Board School",
    city: "Pune",
    state: "Maharashtra",
    board: "state",
    schoolType: "private",
    annualFee: 60000,
    hostelAvailable: false,
    grades: "1-10",
    studentCount: 1200,
    facultyCount: 60,
    rating: 3.9,
    facilities: ["Library", "Science Labs", "Computer Lab", "Sports Ground"],
    description: "State board school providing quality education in Marathi and English medium.",
    contact: {
      phone: "+91-20-23456789",
      email: "info@msbspune.edu.in",
      address: "Shivaji Nagar, Pune"
    },
    website: "https://msbspune.edu.in"
  },
  {
    name: "Tamil Nadu State Board School",
    city: "Coimbatore",
    state: "Tamil Nadu",
    board: "state",
    schoolType: "private",
    annualFee: 50000,
    hostelAvailable: true,
    grades: "6-12",
    studentCount: 1500,
    facultyCount: 75,
    rating: 3.7,
    facilities: ["Library", "Science Labs", "Computer Lab", "Sports Ground", "Hostel"],
    description: "State board school with hostel facilities serving rural and urban students.",
    contact: {
      phone: "+91-422-23456789",
      email: "info@tnsbcoimbatore.edu.in",
      address: "Gandhipuram, Coimbatore"
    },
    website: "https://tnsbcoimbatore.edu.in"
  },
  {
    name: "Karnataka State Board School",
    city: "Mysore",
    state: "Karnataka",
    board: "state",
    schoolType: "government",
    annualFee: 4000,
    hostelAvailable: false,
    grades: "1-10",
    studentCount: 1000,
    facultyCount: 50,
    rating: 3.5,
    facilities: ["Library", "Science Labs", "Sports Ground"],
    description: "Government school following Karnataka state curriculum with affordable education.",
    contact: {
      phone: "+91-821-23456789",
      email: "info@ksbmysore.edu.in",
      address: "Vijayanagar, Mysore"
    },
    website: "https://ksbmysore.edu.in"
  },

  // Boarding Schools
  {
    name: "The Doon School",
    city: "Dehradun",
    state: "Uttarakhand",
    board: "cbse",
    schoolType: "boarding",
    annualFee: 800000,
    hostelAvailable: true,
    grades: "7-12",
    studentCount: 500,
    facultyCount: 80,
    rating: 4.8,
    facilities: ["Library", "Science Labs", "Computer Lab", "Sports Complex", "Swimming Pool", "Horse Riding", "Music Room", "Art Studio", "Theater", "Hostel", "Cafeteria"],
    description: "India's premier boarding school for boys with world-class infrastructure and holistic education.",
    contact: {
      phone: "+91-135-23456789",
      email: "admissions@doonschool.com",
      address: "Mall Road, Dehradun"
    },
    website: "https://doonschool.com"
  },
  {
    name: "Mayo College",
    city: "Ajmer",
    state: "Rajasthan",
    board: "cbse",
    schoolType: "boarding",
    annualFee: 600000,
    hostelAvailable: true,
    grades: "4-12",
    studentCount: 800,
    facultyCount: 100,
    rating: 4.6,
    facilities: ["Library", "Science Labs", "Computer Lab", "Sports Complex", "Swimming Pool", "Horse Riding", "Music Room", "Art Studio", "Hostel", "Cafeteria"],
    description: "Historic boarding school with heritage buildings and excellent academic reputation.",
    contact: {
      phone: "+91-145-23456789",
      email: "admissions@mayocollege.com",
      address: "Mayo College Road, Ajmer"
    },
    website: "https://mayocollege.com"
  },
  {
    name: "Welham Girls School",
    city: "Dehradun",
    state: "Uttarakhand",
    board: "icse",
    schoolType: "boarding",
    annualFee: 550000,
    hostelAvailable: true,
    grades: "6-12",
    studentCount: 600,
    facultyCount: 70,
    rating: 4.5,
    facilities: ["Library", "Science Labs", "Computer Lab", "Sports Complex", "Swimming Pool", "Music Room", "Art Studio", "Hostel", "Cafeteria"],
    description: "Premier boarding school for girls with focus on academic excellence and character development.",
    contact: {
      phone: "+91-135-23456790",
      email: "admissions@welhamgirls.com",
      address: "Tilak Road, Dehradun"
    },
    website: "https://welhamgirls.com"
  },

  // Residential Schools
  {
    name: "Rishi Valley School",
    city: "Chittoor",
    state: "Andhra Pradesh",
    board: "icse",
    schoolType: "residential",
    annualFee: 450000,
    hostelAvailable: true,
    grades: "4-12",
    studentCount: 400,
    facultyCount: 60,
    rating: 4.7,
    facilities: ["Library", "Science Labs", "Computer Lab", "Sports Ground", "Music Room", "Art Studio", "Hostel", "Organic Farm", "Cafeteria"],
    description: "Progressive residential school founded by Jiddu Krishnamurti with focus on holistic education.",
    contact: {
      phone: "+91-8574-234567",
      email: "admissions@rishivalley.com",
      address: "Rishi Valley, Chittoor District"
    },
    website: "https://rishivalley.com"
  },
  {
    name: "Sahyadri School",
    city: "Pune",
    state: "Maharashtra",
    board: "icse",
    schoolType: "residential",
    annualFee: 400000,
    hostelAvailable: true,
    grades: "4-12",
    studentCount: 350,
    facultyCount: 55,
    rating: 4.4,
    facilities: ["Library", "Science Labs", "Computer Lab", "Sports Ground", "Music Room", "Art Studio", "Hostel", "Cafeteria"],
    description: "Krishnamurti foundation school with emphasis on learning through understanding and exploration.",
    contact: {
      phone: "+91-20-23456790",
      email: "admissions@sahyadrischool.com",
      address: "Khadki, Pune"
    },
    website: "https://sahyadrischool.com"
  },
  {
    name: "Navodaya Vidyalaya",
    city: "Ranchi",
    state: "Jharkhand",
    board: "cbse",
    schoolType: "residential",
    annualFee: 10000,
    hostelAvailable: true,
    grades: "6-12",
    studentCount: 500,
    facultyCount: 30,
    rating: 4.0,
    facilities: ["Library", "Science Labs", "Computer Lab", "Sports Ground", "Hostel"],
    description: "Government residential school providing quality education to rural students.",
    contact: {
      phone: "+91-651-23456789",
      email: "info@navodayaranchi.gov.in",
      address: "Navodaya Vidyalaya Campus, Ranchi"
    },
    website: "https://navodayaranchi.gov.in"
  }
];

// Seed the database
async function seedSchools() {
  try {
    console.log('Seeding schools database...');
    
    // Clear existing data
    const existingSchools = School.findAll();
    if (existingSchools.length > 0) {
      console.log(`Found ${existingSchools.length} existing schools. Skipping seed to preserve data.`);
      return;
    }

    // Add sample schools
    for (const school of sampleSchools) {
      await School.create(school);
    }

    console.log(`Successfully seeded ${sampleSchools.length} schools.`);
  } catch (error) {
    console.error('Error seeding schools:', error);
  }
}

// Run if executed directly
if (require.main === module) {
  seedSchools();
}

module.exports = { seedSchools, sampleSchools };
