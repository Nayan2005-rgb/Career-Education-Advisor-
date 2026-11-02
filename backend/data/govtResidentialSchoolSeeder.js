const GovtResidentialSchool = require('../models/GovtResidentialSchool');

// Sample records removed during data audit (2026-10-27)
// Backup available in govtResidentialSchools_removed_samples_backup.json
// Use importGovtResidentialSchools.js for importing verified school data
const sampleGovtResidentialSchools = [];

// Seed the database
async function seedGovtResidentialSchools() {
  try {
    console.log('Seeding government residential schools database...');

    // Clear existing data
    const existingSchools = GovtResidentialSchool.findAll();
    if (existingSchools.length > 0) {
      console.log(`Found ${existingSchools.length} existing government residential schools. Skipping seed to preserve data.`);
      return;
    }

    // Add sample schools (currently empty - use importGovtResidentialSchools.js instead)
    for (const school of sampleGovtResidentialSchools) {
      await GovtResidentialSchool.create(school);
    }

    console.log(`Successfully seeded ${sampleGovtResidentialSchools.length} government residential schools.`);
  } catch (error) {
    console.error('Error seeding government residential schools:', error);
  }
}

// Run if executed directly
if (require.main === module) {
  seedGovtResidentialSchools();
}

module.exports = { seedGovtResidentialSchools, sampleGovtResidentialSchools };
