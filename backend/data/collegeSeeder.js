const { College } = require('../models/College');

const sampleColleges = [
  {
    name: "Indian Institute of Technology, Delhi",
    city: "New Delhi",
    state: "Delhi",
    stream: "Engineering",
    collegeType: "Government",
    courses: ["B.Tech Computer Science", "B.Tech Electrical Engineering", "B.Tech Mechanical Engineering", "M.Tech"],
    annualFee: 120000,
    entranceExams: ["JEE Advanced", "JEE Main"],
    hostelAvailable: true,
    hostelFee: 25000,
    rating: 4.8,
    placementRate: 95,
    facilities: ["Library", "Laboratories", "Sports Complex", "Hospital", "Cafeteria", "WiFi", "Research Centers"],
    admissionInfo: "Admission through JEE Advanced rank. Candidates must have scored in top 2.5 lakh in JEE Main.",
    contact: {
      phone: "+91-11-26592054",
      email: "admin@iitd.ac.in",
      address: "Hauz Khas, New Delhi - 110016"
    },
    website: "https://www.iitd.ac.in"
  },
  {
    name: "Indian Institute of Technology, Bombay",
    city: "Mumbai",
    state: "Maharashtra",
    stream: "Engineering",
    collegeType: "Government",
    courses: ["B.Tech Computer Science", "B.Tech Chemical Engineering", "B.Tech Aerospace Engineering", "M.Tech"],
    annualFee: 125000,
    entranceExams: ["JEE Advanced", "JEE Main"],
    hostelAvailable: true,
    hostelFee: 28000,
    rating: 4.9,
    placementRate: 96,
    facilities: ["Library", "Laboratories", "Sports Complex", "Hospital", "Cafeteria", "WiFi", "Research Centers", "Swimming Pool"],
    admissionInfo: "Admission through JEE Advanced rank. Must qualify JEE Main first.",
    contact: {
      phone: "+91-22-25767000",
      email: "admin@iitb.ac.in",
      address: "Powai, Mumbai - 400076"
    },
    website: "https://www.iitb.ac.in"
  },
  {
    name: "All India Institute of Medical Sciences, Delhi",
    city: "New Delhi",
    state: "Delhi",
    stream: "Medical",
    collegeType: "Government",
    courses: ["MBBS", "MD", "MS", "B.Sc Nursing"],
    annualFee: 80000,
    entranceExams: ["NEET"],
    hostelAvailable: true,
    hostelFee: 20000,
    rating: 4.9,
    placementRate: 98,
    facilities: ["Hospital", "Laboratories", "Library", "Research Centers", "Hostel", "Cafeteria"],
    admissionInfo: "Admission through NEET rank. Top 100 candidates eligible for MBBS.",
    contact: {
      phone: "+91-11-26588500",
      email: "admin@aiims.edu",
      address: "Ansari Nagar, New Delhi - 110029"
    },
    website: "https://www.aiims.edu"
  },
  {
    name: "National Institute of Technology, Trichy",
    city: "Tiruchirappalli",
    state: "Tamil Nadu",
    stream: "Engineering",
    collegeType: "Government",
    courses: ["B.Tech Computer Science", "B.Tech Civil Engineering", "B.Tech Electronics", "M.Tech"],
    annualFee: 90000,
    entranceExams: ["JEE Main"],
    hostelAvailable: true,
    hostelFee: 22000,
    rating: 4.6,
    placementRate: 92,
    facilities: ["Library", "Laboratories", "Sports Complex", "Hostel", "Cafeteria", "WiFi"],
    admissionInfo: "Admission through JEE Main rank under Home State/Other State quota.",
    contact: {
      phone: "+91-431-2501801",
      email: "admin@nitt.edu",
      address: "Tanjore Main Road, Tiruchirappalli - 620015"
    },
    website: "https://www.nitt.edu"
  },
  {
    name: "St. Stephen's College, Delhi",
    city: "New Delhi",
    state: "Delhi",
    stream: "Arts",
    collegeType: "Government",
    courses: ["B.A Economics", "B.A History", "B.A English", "B.Sc Mathematics"],
    annualFee: 35000,
    entranceExams: ["CUET"],
    hostelAvailable: true,
    hostelFee: 15000,
    rating: 4.7,
    placementRate: 85,
    facilities: ["Library", "Sports Ground", "Hostel", "Cafeteria", "Auditorium"],
    admissionInfo: "Admission through CUET score and interview. 50% weightage to CUET.",
    contact: {
      phone: "+91-11-27667800",
      email: "admin@ststephens.edu",
      address: "North Campus, University Enclave, Delhi - 110007"
    },
    website: "https://www.ststephens.edu"
  },
  {
    name: "Shri Ram College of Commerce, Delhi",
    city: "New Delhi",
    state: "Delhi",
    stream: "Commerce",
    collegeType: "Government",
    courses: ["B.Com Honors", "B.A Economics Honors", "M.Com"],
    annualFee: 38000,
    entranceExams: ["CUET"],
    hostelAvailable: false,
    hostelFee: 0,
    rating: 4.8,
    placementRate: 90,
    facilities: ["Library", "Computer Lab", "Sports Ground", "Cafeteria", "Auditorium"],
    admissionInfo: "Admission through CUET score. Minimum 60% in 12th required.",
    contact: {
      phone: "+91-11-27667220",
      email: "admin@sriramcollege.edu",
      address: "North Campus, Maurice Nagar, Delhi - 110007"
    },
    website: "https://www.srcc.edu"
  },
  {
    name: "Birla Institute of Technology and Science, Pilani",
    city: "Pilani",
    state: "Rajasthan",
    stream: "Engineering",
    collegeType: "Private",
    courses: ["B.E Computer Science", "B.E Electrical", "B.E Mechanical", "M.E"],
    annualFee: 350000,
    entranceExams: ["BITSAT"],
    hostelAvailable: true,
    hostelFee: 35000,
    rating: 4.7,
    placementRate: 94,
    facilities: ["Library", "Laboratories", "Sports Complex", "Hostel", "Cafeteria", "WiFi", "Shopping Complex"],
    admissionInfo: "Admission through BITSAT score. Direct admission for board toppers.",
    contact: {
      phone: "+91-1598-255222",
      email: "admin@bits-pilani.ac.in",
      address: "Vidya Vihar, Pilani - 333031"
    },
    website: "https://www.bits-pilani.ac.in"
  },
  {
    name: "Vellore Institute of Technology, Vellore",
    city: "Vellore",
    state: "Tamil Nadu",
    stream: "Engineering",
    collegeType: "Private",
    courses: ["B.Tech Computer Science", "B.Tech Mechanical", "B.Tech Biotechnology", "M.Tech"],
    annualFee: 280000,
    entranceExams: ["VITEEE"],
    hostelAvailable: true,
    hostelFee: 45000,
    rating: 4.5,
    placementRate: 91,
    facilities: ["Library", "Laboratories", "Sports Complex", "Hostel", "Cafeteria", "WiFi", "Hospital"],
    admissionInfo: "Admission through VITEEE. 60% aggregate in Physics, Chemistry, Mathematics required.",
    contact: {
      phone: "+91-416-2202000",
      email: "admin@vit.ac.in",
      address: "Vellore - 632014"
    },
    website: "https://www.vit.ac.in"
  },
  {
    name: "Loyola College, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    stream: "Arts",
    collegeType: "Private",
    courses: ["B.A Economics", "B.A English", "B.Com", "B.Sc Computer Science"],
    annualFee: 45000,
    entranceExams: ["TNDTE"],
    hostelAvailable: true,
    hostelFee: 25000,
    rating: 4.4,
    placementRate: 82,
    facilities: ["Library", "Computer Lab", "Sports Ground", "Hostel", "Cafeteria", "Auditorium"],
    admissionInfo: "Admission based on 12th marks. Entrance test for some courses.",
    contact: {
      phone: "+91-44-28178270",
      email: "admin@loyolacollege.edu",
      address: "Nungambakkam, Chennai - 600034"
    },
    website: "https://www.loyolacollege.edu"
  },
  {
    name: "National Law School of India University, Bangalore",
    city: "Bangalore",
    state: "Karnataka",
    stream: "Law",
    collegeType: "Government",
    courses: ["B.A LL.B", "LL.M", "Ph.D Law"],
    annualFee: 150000,
    entranceExams: ["CLAT"],
    hostelAvailable: true,
    hostelFee: 30000,
    rating: 4.8,
    placementRate: 95,
    facilities: ["Library", "Moot Court", "Hostel", "Cafeteria", "Sports Complex", "WiFi"],
    admissionInfo: "Admission through CLAT rank. Top 60 candidates eligible.",
    contact: {
      phone: "+91-80-23160500",
      email: "admin@nlsiu.ac.in",
      address: "Nagarbhavi, Bangalore - 560072"
    },
    website: "https://www.nlsiu.ac.in"
  },
  {
    name: "Indian Institute of Management, Ahmedabad",
    city: "Ahmedabad",
    state: "Gujarat",
    stream: "Management",
    collegeType: "Government",
    courses: ["MBA", "PGP", "FPM"],
    annualFee: 250000,
    entranceExams: ["CAT"],
    hostelAvailable: true,
    hostelFee: 40000,
    rating: 4.9,
    placementRate: 97,
    facilities: ["Library", "Computer Center", "Sports Complex", "Hostel", "Cafeteria", "WiFi", "Executive Education Center"],
    admissionInfo: "Admission through CAT score, followed by GD and PI. Minimum 50% in graduation required.",
    contact: {
      phone: "+91-79-66324600",
      email: "admin@iimahd.ac.in",
      address: "Vastrapur, Ahmedabad - 380015"
    },
    website: "https://www.iimahd.ac.in"
  },
  {
    name: "Christian Medical College, Vellore",
    city: "Vellore",
    state: "Tamil Nadu",
    stream: "Medical",
    collegeType: "Private",
    courses: ["MBBS", "B.Sc Nursing", "MD", "MS"],
    annualFee: 180000,
    entranceExams: ["NEET"],
    hostelAvailable: true,
    hostelFee: 32000,
    rating: 4.7,
    placementRate: 93,
    facilities: ["Hospital", "Laboratories", "Library", "Hostel", "Cafeteria", "Research Centers"],
    admissionInfo: "Admission through NEET rank. Christian candidates have reserved seats.",
    contact: {
      phone: "+91-416-2284000",
      email: "admin@cmcvellore.ac.in",
      address: "Ida Scudder Road, Vellore - 632004"
    },
    website: "https://www.cmch-vellore.edu"
  },
  {
    name: "Jawaharlal Nehru University, Delhi",
    city: "New Delhi",
    state: "Delhi",
    stream: "Arts",
    collegeType: "Government",
    courses: ["B.A Politics", "B.A History", "M.A", "Ph.D"],
    annualFee: 25000,
    entranceExams: ["JNUEE"],
    hostelAvailable: true,
    hostelFee: 12000,
    rating: 4.6,
    placementRate: 78,
    facilities: ["Library", "Research Centers", "Hostel", "Cafeteria", "Sports Complex"],
    admissionInfo: "Admission through JNUEE entrance test. Interview for Ph.D programs.",
    contact: {
      phone: "+91-11-26704000",
      email: "admin@jnu.ac.in",
      address: "JNU Campus, New Mehrauli Road, Delhi - 110067"
    },
    website: "https://www.jnu.ac.in"
  },
  {
    name: "Manipal Institute of Technology, Manipal",
    city: "Manipal",
    state: "Karnataka",
    stream: "Engineering",
    collegeType: "Private",
    courses: ["B.Tech Computer Science", "B.Tech Mechanical", "B.Tech Civil", "M.Tech"],
    annualFee: 320000,
    entranceExams: ["MET"],
    hostelAvailable: true,
    hostelFee: 48000,
    rating: 4.4,
    placementRate: 89,
    facilities: ["Library", "Laboratories", "Sports Complex", "Hostel", "Cafeteria", "WiFi", "Hospital"],
    admissionInfo: "Admission through MET or JEE Main rank. 50% in PCM required.",
    contact: {
      phone: "+91-820-2571910",
      email: "admin@manipal.edu",
      address: "Manipal - 576104"
    },
    website: "https://www.manipal.edu"
  },
  {
    name: "Hindu College, Delhi",
    city: "New Delhi",
    state: "Delhi",
    stream: "Arts",
    collegeType: "Government",
    courses: ["B.A History", "B.A Political Science", "B.A Economics", "B.Sc"],
    annualFee: 32000,
    entranceExams: ["CUET"],
    hostelAvailable: true,
    hostelFee: 14000,
    rating: 4.6,
    placementRate: 83,
    facilities: ["Library", "Sports Ground", "Hostel", "Cafeteria", "Auditorium"],
    admissionInfo: "Admission through CUET score. Cutoff varies by course.",
    contact: {
      phone: "+91-11-27667070",
      email: "admin@hinducollege.edu",
      address: "North Campus, Delhi - 110007"
    },
    website: "https://www.hinducollege.edu"
  },
  {
    name: "Anna University, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    stream: "Engineering",
    collegeType: "Government",
    courses: ["B.E Computer Science", "B.E Civil", "B.E Mechanical", "M.E"],
    annualFee: 75000,
    entranceExams: ["TNEA"],
    hostelAvailable: true,
    hostelFee: 18000,
    rating: 4.5,
    placementRate: 88,
    facilities: ["Library", "Laboratories", "Sports Complex", "Hostel", "Cafeteria", "WiFi"],
    admissionInfo: "Admission through TNEA counseling based on 12th marks in PCM.",
    contact: {
      phone: "+91-44-22357000",
      email: "admin@annauniv.edu",
      address: "Guindy, Chennai - 600025"
    },
    website: "https://www.annauniv.edu"
  },
  {
    name: "Amrita Vishwa Vidyapeetham, Coimbatore",
    city: "Coimbatore",
    state: "Tamil Nadu",
    stream: "Engineering",
    collegeType: "Private",
    courses: ["B.Tech Computer Science", "B.Tech Electronics", "B.Tech Mechanical", "M.Tech"],
    annualFee: 240000,
    entranceExams: ["AEEE"],
    hostelAvailable: true,
    hostelFee: 38000,
    rating: 4.3,
    placementRate: 87,
    facilities: ["Library", "Laboratories", "Sports Complex", "Hostel", "Cafeteria", "WiFi", "Hospital"],
    admissionInfo: "Admission through AEEE or JEE Main rank. 60% in PCM required.",
    contact: {
      phone: "+91-422-2685000",
      email: "admin@amrita.edu",
      address: "Ettimadai, Coimbatore - 641112"
    },
    website: "https://www.amrita.edu"
  },
  {
    name: "Symbiosis Institute of Computer Studies, Pune",
    city: "Pune",
    state: "Maharashtra",
    stream: "Management",
    collegeType: "Private",
    courses: ["BBA", "MBA", "B.Sc Computer Science"],
    annualFee: 280000,
    entranceExams: ["SNAP"],
    hostelAvailable: true,
    hostelFee: 42000,
    rating: 4.5,
    placementRate: 90,
    facilities: ["Library", "Computer Lab", "Sports Complex", "Hostel", "Cafeteria", "WiFi"],
    admissionInfo: "Admission through SNAP score followed by GD and PI. 50% in graduation required.",
    contact: {
      phone: "+91-20-25656000",
      email: "admin@symbiosis.edu",
      address: "Lavale, Pune - 411042"
    },
    website: "https://www.symbiosis.edu"
  },
  {
    name: "Lady Hardinge Medical College, Delhi",
    city: "New Delhi",
    state: "Delhi",
    stream: "Medical",
    collegeType: "Government",
    courses: ["MBBS", "MD", "MS", "B.Sc Nursing"],
    annualFee: 75000,
    entranceExams: ["NEET"],
    hostelAvailable: true,
    hostelFee: 18000,
    rating: 4.5,
    placementRate: 92,
    facilities: ["Hospital", "Laboratories", "Library", "Hostel", "Cafeteria"],
    admissionInfo: "Admission through NEET rank. 85% seats reserved for female candidates.",
    contact: {
      phone: "+91-11-23365258",
      email: "admin@lhmc.edu",
      address: "Connaught Place, New Delhi - 110001"
    },
    website: "https://www.lhmc.edu"
  },
  {
    name: "Fergusson College, Pune",
    city: "Pune",
    state: "Maharashtra",
    stream: "Arts",
    collegeType: "Government",
    courses: ["B.A Economics", "B.A History", "B.A Psychology", "B.Sc"],
    annualFee: 28000,
    entranceExams: ["MHT CET"],
    hostelAvailable: true,
    hostelFee: 16000,
    rating: 4.4,
    placementRate: 80,
    facilities: ["Library", "Sports Ground", "Hostel", "Cafeteria", "Auditorium"],
    admissionInfo: "Admission based on 12th marks and MHT CET score for some courses.",
    contact: {
      phone: "+91-20-25445650",
      email: "admin@fergusson.edu",
      address: "Shivajinagar, Pune - 411004"
    },
    website: "https://www.fergusson.edu"
  }
];

function seedColleges() {
  try {
    const existingColleges = College.findAll();
    
    if (existingColleges.length === 0) {
      console.log('Seeding colleges data...');
      sampleColleges.forEach(college => {
        College.create(college);
      });
      console.log(`Seeded ${sampleColleges.length} colleges successfully.`);
    } else {
      console.log(`Colleges already exist (${existingColleges.length}). Skipping seed.`);
    }
  } catch (error) {
    console.error('Error seeding colleges:', error);
  }
}

module.exports = { seedColleges };
