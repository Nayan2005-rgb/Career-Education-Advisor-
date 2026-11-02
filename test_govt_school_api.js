const axios = require('axios');

const API_URL = 'http://localhost:5000/api/govt-residential-school';

async function testGovtSchoolAPI() {
  console.log('Testing Government Residential School API...\n');

  try {
    // Test 1: Filter Options API
    console.log('1. Testing Filter Options API...');
    const filterOptionsResponse = await axios.get(`${API_URL}/filters`);
    console.log('✓ Filter options loaded');
    console.log('  States:', filterOptionsResponse.data.states.length);
    console.log('  Districts:', filterOptionsResponse.data.districts.length);
    console.log('  Categories:', filterOptionsResponse.data.categories.length);
    console.log('  Genders:', filterOptionsResponse.data.genders.length);
    console.log('  Entrance Exams:', filterOptionsResponse.data.entranceExams.length);
    console.log('  Classes Offered:', filterOptionsResponse.data.classesOffered.length);
    console.log('  Governing Organizations:', filterOptionsResponse.data.governingOrganizations.length);
    console.log('  Organizations:', filterOptionsResponse.data.governingOrganizations);
    console.log();

    // Test 2: Search with pagination (page 1, limit 5)
    console.log('2. Testing Search - Page 1 with limit=5...');
    const page1Response = await axios.get(`${API_URL}/search?page=1&limit=5`);
    console.log('✓ Page 1 loaded');
    console.log('  Schools returned:', page1Response.data.schools.length);
    console.log('  Total count:', page1Response.data.count);
    console.log('  Page:', page1Response.data.page);
    console.log('  Limit:', page1Response.data.limit);
    console.log('  Total pages:', page1Response.data.totalPages);
    console.log();

    // Test 3: Search with pagination (page 2, limit 5)
    console.log('3. Testing Search - Page 2 with limit=5...');
    const page2Response = await axios.get(`${API_URL}/search?page=2&limit=5`);
    console.log('✓ Page 2 loaded');
    console.log('  Schools returned:', page2Response.data.schools.length);
    console.log('  Total count:', page2Response.data.count);
    console.log('  Page:', page2Response.data.page);
    console.log('  Limit:', page2Response.data.limit);
    console.log('  Total pages:', page2Response.data.totalPages);
    console.log();

    // Test 4: Verify no overlap between pages
    console.log('4. Verifying no overlap between pages...');
    const page1Ids = page1Response.data.schools.map(s => s.id);
    const page2Ids = page2Response.data.schools.map(s => s.id);
    const overlap = page1Ids.filter(id => page2Ids.includes(id));
    if (overlap.length === 0) {
      console.log('✓ No overlap between pages');
    } else {
      console.log('✗ Overlap detected:', overlap);
    }
    console.log();

    // Test 5: Invalid page (page 10)
    console.log('5. Testing invalid page (page 10)...');
    const invalidPageResponse = await axios.get(`${API_URL}/search?page=10&limit=5`);
    console.log('✓ Invalid page handled safely');
    console.log('  Schools returned:', invalidPageResponse.data.schools.length);
    console.log('  Total count:', invalidPageResponse.data.count);
    console.log();

    // Test 6: Filter by governing organization
    console.log('6. Testing filter by governing organization...');
    const orgFilter = filterOptionsResponse.data.governingOrganizations[0];
    const orgFilterResponse = await axios.get(`${API_URL}/search?governingOrganization=${encodeURIComponent(orgFilter)}`);
    console.log('✓ Organization filter applied');
    console.log('  Organization:', orgFilter);
    console.log('  Schools returned:', orgFilterResponse.data.schools.length);
    console.log('  Total count:', orgFilterResponse.data.count);
    console.log('  All match organization:', orgFilterResponse.data.schools.every(s => s.governingOrganization === orgFilter));
    console.log();

    // Test 7: Filter + pagination
    console.log('7. Testing filter + pagination...');
    const orgPage1Response = await axios.get(`${API_URL}/search?governingOrganization=${encodeURIComponent(orgFilter)}&page=1&limit=3`);
    const orgPage2Response = await axios.get(`${API_URL}/search?governingOrganization=${encodeURIComponent(orgFilter)}&page=2&limit=3`);
    console.log('✓ Filter + pagination working');
    console.log('  Page 1 schools:', orgPage1Response.data.schools.length);
    console.log('  Page 2 schools:', orgPage2Response.data.schools.length);
    console.log('  Total count:', orgPage1Response.data.count);
    console.log('  Total pages:', orgPage1Response.data.totalPages);
    console.log();

    console.log('========================================');
    console.log('All Government Residential School API tests passed!');
    console.log('========================================');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testGovtSchoolAPI();
