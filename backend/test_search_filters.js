const axios = require('axios');

const API_URL = 'http://localhost:5000/api/govt-residential-school';

async function testSearchAndFilters() {
  console.log('Testing Government Residential School Search and Filters...\n');

  try {
    // Get filter options for test data
    const filterOptionsResponse = await axios.get(`${API_URL}/filters`);
    const testState = filterOptionsResponse.data.states[0];
    const testCategory = filterOptionsResponse.data.categories[0];
    const testOrg = filterOptionsResponse.data.governingOrganizations[0];
    const testGender = filterOptionsResponse.data.genders[0];
    const testExam = filterOptionsResponse.data.entranceExams[0];
    const testClasses = filterOptionsResponse.data.classesOffered[0];

    let passedTests = 0;
    let failedTests = 0;

    // Test 1: Partial and case-insensitive search
    console.log('1. Testing partial and case-insensitive search...');
    const partialSearch1 = await axios.get(`${API_URL}/search?search=Jawahar`);
    const partialSearch2 = await axios.get(`${API_URL}/search?search=jawahar`);
    const partialSearch3 = await axios.get(`${API_URL}/search?search=Navodaya`);
    if (partialSearch1.data.count === partialSearch2.data.count &&
        partialSearch1.data.count > 0 &&
        partialSearch3.data.count > 0) {
      console.log('✓ PASS: Partial and case-insensitive search works');
      console.log(`  Jawahar results: ${partialSearch1.data.count}`);
      console.log(`  Navodaya results: ${partialSearch3.data.count}`);
      passedTests++;
    } else {
      console.log('✗ FAIL: Partial or case-insensitive search failed');
      failedTests++;
    }
    console.log();

    // Test 2: Search with no matches
    console.log('2. Testing search with no matches...');
    const noMatchSearch = await axios.get(`${API_URL}/search?search=NonExistentSchoolXYZ123`);
    if (noMatchSearch.data.count === 0 && noMatchSearch.data.schools.length === 0) {
      console.log('✓ PASS: Search with no matches returns empty results');
      passedTests++;
    } else {
      console.log('✗ FAIL: Search with no matches should return empty results');
      failedTests++;
    }
    console.log();

    // Test 3: Search with cleared input (empty string)
    console.log('3. Testing search with cleared input...');
    const emptySearch = await axios.get(`${API_URL}/search?search=`);
    if (emptySearch.data.count > 0) {
      console.log('✓ PASS: Search with empty input returns all schools');
      console.log(`  Total schools: ${emptySearch.data.count}`);
      passedTests++;
    } else {
      console.log('✗ FAIL: Search with empty input should return all schools');
      failedTests++;
    }
    console.log();

    // Test 4: Search with leading/trailing spaces
    console.log('4. Testing search with leading/trailing spaces...');
    const spaceSearch = await axios.get(`${API_URL}/search?search=  Jawahar  `);
    const normalSearch = await axios.get(`${API_URL}/search?search=Jawahar`);
    if (spaceSearch.data.count === normalSearch.data.count && spaceSearch.data.count > 0) {
      console.log('✓ PASS: Search trims leading/trailing spaces');
      console.log(`  Results with spaces: ${spaceSearch.data.count}`);
      console.log(`  Results without spaces: ${normalSearch.data.count}`);
      passedTests++;
    } else {
      console.log('✗ FAIL: Search should trim leading/trailing spaces');
      failedTests++;
    }
    console.log();

    // Test 5: Filter by category
    console.log('5. Testing filter by category...');
    const categoryFilter = await axios.get(`${API_URL}/search?category=${encodeURIComponent(testCategory)}`);
    if (categoryFilter.data.schools.every(s => s.category === testCategory)) {
      console.log('✓ PASS: Category filter works correctly');
      console.log(`  Category: ${testCategory}`);
      console.log(`  Results: ${categoryFilter.data.count}`);
      passedTests++;
    } else {
      console.log('✗ FAIL: Category filter failed');
      failedTests++;
    }
    console.log();

    // Test 6: Filter by state
    console.log('6. Testing filter by state...');
    const stateFilter = await axios.get(`${API_URL}/search?state=${encodeURIComponent(testState)}`);
    if (stateFilter.data.schools.every(s => s.state === testState)) {
      console.log('✓ PASS: State filter works correctly');
      console.log(`  State: ${testState}`);
      console.log(`  Results: ${stateFilter.data.count}`);
      passedTests++;
    } else {
      console.log('✗ FAIL: State filter failed');
      failedTests++;
    }
    console.log();

    // Test 7: Filter by district
    console.log('7. Testing filter by district...');
    const districtsByState = await axios.get(`${API_URL}/states/${encodeURIComponent(testState)}/districts`);
    if (districtsByState.data.districts.length > 0) {
      const testDistrict = districtsByState.data.districts[0];
      const districtFilter = await axios.get(`${API_URL}/search?state=${encodeURIComponent(testState)}&district=${encodeURIComponent(testDistrict)}`);
      if (districtFilter.data.schools.every(s => s.district === testDistrict)) {
        console.log('✓ PASS: District filter works correctly');
        console.log(`  District: ${testDistrict}`);
        console.log(`  Results: ${districtFilter.data.count}`);
        passedTests++;
      } else {
        console.log('✗ FAIL: District filter failed');
        failedTests++;
      }
    } else {
      console.log('⊘ SKIP: No districts available for state');
    }
    console.log();

    // Test 8: Filter by gender
    console.log('8. Testing filter by gender...');
    const genderFilter = await axios.get(`${API_URL}/search?gender=${encodeURIComponent(testGender)}`);
    if (genderFilter.data.schools.every(s => s.gender === testGender)) {
      console.log('✓ PASS: Gender filter works correctly');
      console.log(`  Gender: ${testGender}`);
      console.log(`  Results: ${genderFilter.data.count}`);
      passedTests++;
    } else {
      console.log('✗ FAIL: Gender filter failed');
      failedTests++;
    }
    console.log();

    // Test 9: Filter by entrance exam
    console.log('9. Testing filter by entrance exam...');
    const examFilter = await axios.get(`${API_URL}/search?entranceExam=${encodeURIComponent(testExam)}`);
    if (examFilter.data.schools.every(s => s.entranceExam === testExam)) {
      console.log('✓ PASS: Entrance exam filter works correctly');
      console.log(`  Exam: ${testExam}`);
      console.log(`  Results: ${examFilter.data.count}`);
      passedTests++;
    } else {
      console.log('✗ FAIL: Entrance exam filter failed');
      failedTests++;
    }
    console.log();

    // Test 10: Filter by hostel availability
    console.log('10. Testing filter by hostel availability...');
    const hostelFilter = await axios.get(`${API_URL}/search?hostelAvailable=true`);
    if (hostelFilter.data.schools.every(s => s.hostelAvailable === true)) {
      console.log('✓ PASS: Hostel filter works correctly');
      console.log(`  Results: ${hostelFilter.data.count}`);
      passedTests++;
    } else {
      console.log('✗ FAIL: Hostel filter failed');
      failedTests++;
    }
    console.log();

    // Test 11: Filter by classes offered
    console.log('11. Testing filter by classes offered...');
    const classesFilter = await axios.get(`${API_URL}/search?classesOffered=${encodeURIComponent(testClasses)}`);
    if (classesFilter.data.schools.every(s => s.classesOffered === testClasses)) {
      console.log('✓ PASS: Classes offered filter works correctly');
      console.log(`  Classes: ${testClasses}`);
      console.log(`  Results: ${classesFilter.data.count}`);
      passedTests++;
    } else {
      console.log('✗ FAIL: Classes offered filter failed');
      failedTests++;
    }
    console.log();

    // Test 12: Filter by governing organization
    console.log('12. Testing filter by governing organization...');
    const orgFilter = await axios.get(`${API_URL}/search?governingOrganization=${encodeURIComponent(testOrg)}`);
    if (orgFilter.data.schools.every(s => s.governingOrganization === testOrg)) {
      console.log('✓ PASS: Governing organization filter works correctly');
      console.log(`  Organization: ${testOrg}`);
      console.log(`  Results: ${orgFilter.data.count}`);
      passedTests++;
    } else {
      console.log('✗ FAIL: Governing organization filter failed');
      failedTests++;
    }
    console.log();

    // Test 13: Multiple filters combined
    console.log('13. Testing multiple filters combined...');
    const combinedFilter = await axios.get(
      `${API_URL}/search?state=${encodeURIComponent(testState)}&category=${encodeURIComponent(testCategory)}`
    );
    if (combinedFilter.data.schools.every(s => s.state === testState && s.category === testCategory)) {
      console.log('✓ PASS: Multiple filters work together');
      console.log(`  State: ${testState}, Category: ${testCategory}`);
      console.log(`  Results: ${combinedFilter.data.count}`);
      passedTests++;
    } else {
      console.log('✗ FAIL: Multiple filters failed');
      failedTests++;
    }
    console.log();

    // Test 14: Search combined with filters
    console.log('14. Testing search combined with filters...');
    const searchFilterCombo = await axios.get(
      `${API_URL}/search?search=Jawahar&category=${encodeURIComponent(testCategory)}`
    );
    if (searchFilterCombo.data.schools.every(s => s.category === testCategory && s.name.toLowerCase().includes('jawahar'))) {
      console.log('✓ PASS: Search and filters work together');
      console.log(`  Results: ${searchFilterCombo.data.count}`);
      passedTests++;
    } else {
      console.log('✗ FAIL: Search and filters combination failed');
      failedTests++;
    }
    console.log();

    // Test 15: Filter changes reset pagination
    console.log('15. Testing filter changes reset pagination...');
    const page1Filter = await axios.get(`${API_URL}/search?category=${encodeURIComponent(testCategory)}&page=1&limit=5`);
    const page2Filter = await axios.get(`${API_URL}/search?category=${encodeURIComponent(testCategory)}&page=2&limit=5`);
    if (page1Filter.data.page === 1 && page2Filter.data.page === 2 &&
        page1Filter.data.count === page2Filter.data.count) {
      console.log('✓ PASS: Pagination works with filters');
      console.log(`  Total count: ${page1Filter.data.count}`);
      console.log(`  Total pages: ${page1Filter.data.totalPages}`);
      passedTests++;
    } else {
      console.log('✗ FAIL: Pagination with filters failed');
      failedTests++;
    }
    console.log();

    // Test 16: Correct filtered result counts
    console.log('16. Testing correct filtered result counts...');
    const countTest = await axios.get(`${API_URL}/search?category=${encodeURIComponent(testCategory)}`);
    if (countTest.data.count === countTest.data.schools.length ||
        (countTest.data.schools.length === 20 && countTest.data.count > 20)) {
      console.log('✓ PASS: Filtered result counts are correct');
      console.log(`  Returned: ${countTest.data.schools.length}`);
      console.log(`  Total count: ${countTest.data.count}`);
      passedTests++;
    } else {
      console.log('✗ FAIL: Filtered result counts incorrect');
      failedTests++;
    }
    console.log();

    // Test 17: Pagination after filtering
    console.log('17. Testing pagination after filtering...');
    const filteredPage1 = await axios.get(`${API_URL}/search?category=${encodeURIComponent(testCategory)}&page=1&limit=10`);
    const filteredPage2 = await axios.get(`${API_URL}/search?category=${encodeURIComponent(testCategory)}&page=2&limit=10`);
    const page1Ids = filteredPage1.data.schools.map(s => s.id);
    const page2Ids = filteredPage2.data.schools.map(s => s.id);
    const overlap = page1Ids.filter(id => page2Ids.includes(id));
    if (overlap.length === 0 && filteredPage1.data.count === filteredPage2.data.count) {
      console.log('✓ PASS: Pagination after filtering works correctly');
      console.log(`  Page 1: ${filteredPage1.data.schools.length} schools`);
      console.log(`  Page 2: ${filteredPage2.data.schools.length} schools`);
      console.log(`  No overlap between pages`);
      passedTests++;
    } else {
      console.log('✗ FAIL: Pagination after filtering has issues');
      failedTests++;
    }
    console.log();

    // Test 18: Regression test for school details
    console.log('18. Testing school details (regression)...');
    const allSchools = await axios.get(`${API_URL}/search?page=1&limit=1`);
    if (allSchools.data.schools.length > 0) {
      const schoolId = allSchools.data.schools[0].id;
      const schoolDetails = await axios.get(`${API_URL}/details/${schoolId}`);
      if (schoolDetails.data.id === schoolId && schoolDetails.data.name) {
        console.log('✓ PASS: School details endpoint works');
        console.log(`  School: ${schoolDetails.data.name}`);
        passedTests++;
      } else {
        console.log('✗ FAIL: School details endpoint failed');
        failedTests++;
      }
    } else {
      console.log('⊘ SKIP: No schools available for details test');
    }
    console.log();

    // Summary
    console.log('========================================');
    console.log('Test Summary');
    console.log('========================================');
    console.log(`Total tests: ${passedTests + failedTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log('========================================');

    if (failedTests === 0) {
      console.log('✓ All tests passed!');
      process.exit(0);
    } else {
      console.log('✗ Some tests failed');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testSearchAndFilters();
