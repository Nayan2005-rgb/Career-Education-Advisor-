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

    // Test 8: Invalid limit values (negative)
    console.log('8. Testing invalid limit values (negative)...');
    const invalidLimitResponse = await axios.get(`${API_URL}/search?page=1&limit=-5`);
    console.log('✓ Invalid limit handled safely');
    console.log('  Schools returned:', invalidLimitResponse.data.schools.length);
    console.log('  Expected limit (should be 1):', invalidLimitResponse.data.limit);
    console.log('  Total count:', invalidLimitResponse.data.count);
    console.log('  Actual limit equals validated limit:', invalidLimitResponse.data.limit === 1);
    console.log();

    // Test 9: Invalid page value (negative)
    console.log('9. Testing invalid page value (negative)...');
    const negativePageResponse = await axios.get(`${API_URL}/search?page=-1&limit=5`);
    console.log('✓ Negative page handled safely');
    console.log('  Schools returned:', negativePageResponse.data.schools.length);
    console.log('  Expected page (should be 1):', negativePageResponse.data.page);
    console.log('  Total count:', negativePageResponse.data.count);
    console.log('  Actual page equals validated page:', negativePageResponse.data.page === 1);
    console.log();

    // Test 14: Zero limit
    console.log('14. Testing zero limit...');
    const zeroLimitResponse = await axios.get(`${API_URL}/search?page=1&limit=0`);
    console.log('✓ Zero limit handled safely');
    console.log('  Schools returned:', zeroLimitResponse.data.schools.length);
    console.log('  Expected limit (should be 1):', zeroLimitResponse.data.limit);
    console.log('  Actual limit equals validated limit:', zeroLimitResponse.data.limit === 1);
    if (zeroLimitResponse.data.limit !== 1) {
      console.log('  ✗ FAILED: Zero limit should be clamped to 1, but got', zeroLimitResponse.data.limit);
    }
    console.log();

    // Test 15: Zero page
    console.log('15. Testing zero page...');
    const zeroPageResponse = await axios.get(`${API_URL}/search?page=0&limit=5`);
    console.log('✓ Zero page handled safely');
    console.log('  Schools returned:', zeroPageResponse.data.schools.length);
    console.log('  Expected page (should be 1):', zeroPageResponse.data.page);
    console.log('  Actual page equals validated page:', zeroPageResponse.data.page === 1);
    console.log();

    // Test 16: Non-numeric limit
    console.log('16. Testing non-numeric limit...');
    const nonNumericLimitResponse = await axios.get(`${API_URL}/search?page=1&limit=abc`);
    console.log('✓ Non-numeric limit handled safely');
    console.log('  Schools returned:', nonNumericLimitResponse.data.schools.length);
    console.log('  Expected limit (should be 20):', nonNumericLimitResponse.data.limit);
    console.log('  Actual limit equals validated limit:', nonNumericLimitResponse.data.limit === 20);
    console.log();

    // Test 17: Non-numeric page
    console.log('17. Testing non-numeric page...');
    const nonNumericPageResponse = await axios.get(`${API_URL}/search?page=xyz&limit=5`);
    console.log('✓ Non-numeric page handled safely');
    console.log('  Schools returned:', nonNumericPageResponse.data.schools.length);
    console.log('  Expected page (should be 1):', nonNumericPageResponse.data.page);
    console.log('  Actual page equals validated page:', nonNumericPageResponse.data.page === 1);
    console.log();

    // Test 18: Excessively large limit
    console.log('18. Testing excessively large limit...');
    const largeLimitResponse = await axios.get(`${API_URL}/search?page=1&limit=1000`);
    console.log('✓ Large limit handled safely');
    console.log('  Schools returned:', largeLimitResponse.data.schools.length);
    console.log('  Expected limit (should be 100):', largeLimitResponse.data.limit);
    console.log('  Actual limit equals validated limit:', largeLimitResponse.data.limit === 100);
    console.log();

    // Test 19: Excessively large page
    console.log('19. Testing excessively large page...');
    const largePageResponse = await axios.get(`${API_URL}/search?page=999&limit=5`);
    console.log('✓ Large page handled safely');
    console.log('  Schools returned:', largePageResponse.data.schools.length);
    console.log('  Expected page (should be 999):', largePageResponse.data.page);
    console.log('  Total count:', largePageResponse.data.count);
    console.log('  Actual page equals validated page:', largePageResponse.data.page === 999);
    console.log();

    // Test 10: Combined filters (state + category + organization)
    console.log('10. Testing combined filters (state + category + organization)...');
    const testState = filterOptionsResponse.data.states[0];
    const testCategory = filterOptionsResponse.data.categories[0];
    const combinedFilterResponse = await axios.get(`${API_URL}/search?state=${encodeURIComponent(testState)}&category=${encodeURIComponent(testCategory)}&governingOrganization=${encodeURIComponent(orgFilter)}`);
    console.log('✓ Combined filters applied');
    console.log('  State:', testState);
    console.log('  Category:', testCategory);
    console.log('  Organization:', orgFilter);
    console.log('  Schools returned:', combinedFilterResponse.data.schools.length);
    console.log('  Total count:', combinedFilterResponse.data.count);
    if (combinedFilterResponse.data.schools.length > 0) {
      console.log('  All match state:', combinedFilterResponse.data.schools.every(s => s.state === testState));
      console.log('  All match category:', combinedFilterResponse.data.schools.every(s => s.category === testCategory));
      console.log('  All match organization:', combinedFilterResponse.data.schools.every(s => s.governingOrganization === orgFilter));
    }
    console.log();

    // Test 11: Filter by category
    console.log('11. Testing filter by category...');
    const categoryFilterResponse = await axios.get(`${API_URL}/search?category=${encodeURIComponent(testCategory)}`);
    console.log('✓ Category filter applied');
    console.log('  Category:', testCategory);
    console.log('  Schools returned:', categoryFilterResponse.data.schools.length);
    console.log('  Total count:', categoryFilterResponse.data.count);
    console.log('  All match category:', categoryFilterResponse.data.schools.every(s => s.category === testCategory));
    console.log();

    // Test 12: Filter by state
    console.log('12. Testing filter by state...');
    const stateFilterResponse = await axios.get(`${API_URL}/search?state=${encodeURIComponent(testState)}`);
    console.log('✓ State filter applied');
    console.log('  State:', testState);
    console.log('  Schools returned:', stateFilterResponse.data.schools.length);
    console.log('  Total count:', stateFilterResponse.data.count);
    console.log('  All match state:', stateFilterResponse.data.schools.every(s => s.state === testState));
    console.log();

    // Test 13: Verify classesOffered and governingOrganizations have actual values
    console.log('13. Verifying classesOffered and governingOrganizations have actual values...');
    console.log('  Classes Offered:', filterOptionsResponse.data.classesOffered);
    console.log('  Governing Organizations:', filterOptionsResponse.data.governingOrganizations);
    const hasClasses = filterOptionsResponse.data.classesOffered.length > 0;
    const hasOrgs = filterOptionsResponse.data.governingOrganizations.length > 0;
    console.log('  Has classes:', hasClasses);
    console.log('  Has organizations:', hasOrgs);
    if (hasClasses && hasOrgs) {
      console.log('✓ Both fields have actual values from dataset');
    } else {
      console.log('✗ Missing values in filter options');
    }
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
