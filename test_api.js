const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('Testing API...\n');

  try {
    // Test 1: Register
    console.log('1. Testing Register...');
    const registerResponse = await axios.post(`${API_URL}/auth/register`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'test12345',
      grade: '12th'
    });
    console.log('✓ Register successful');
    console.log('  User:', registerResponse.data.user.name);
    const token = registerResponse.data.token;
    console.log('  Token received\n');

    // Test 2: Login
    console.log('2. Testing Login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'test12345'
    });
    console.log('✓ Login successful');
    console.log('  User:', loginResponse.data.user.name);
    const loginToken = loginResponse.data.token;
    console.log('  Token received\n');

    // Test 3: Get Profile
    console.log('3. Testing Get Profile...');
    const profileResponse = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${loginToken}` }
    });
    console.log('✓ Profile loaded');
    console.log('  User:', profileResponse.data.name);
    console.log('  Email:', profileResponse.data.email, '\n');

    // Test 4: Submit Assessment
    console.log('4. Testing Submit Assessment...');
    const assessmentResponse = await axios.post(`${API_URL}/assessment`, {
      interests: ['technology', 'science'],
      strongSubjects: ['math', 'computer science'],
      skills: ['problem-solving', 'communication'],
      personality: 'analytical',
      workStylePreference: 'independent'
    }, {
      headers: { Authorization: `Bearer ${loginToken}` }
    });
    console.log('✓ Assessment submitted');
    console.log('  Assessment ID:', assessmentResponse.data.id, '\n');

    // Test 5: Get Assessment History
    console.log('5. Testing Get Assessment History...');
    const historyResponse = await axios.get(`${API_URL}/assessment/history`, {
      headers: { Authorization: `Bearer ${loginToken}` }
    });
    console.log('✓ Assessment history loaded');
    console.log('  Number of assessments:', historyResponse.data.length, '\n');

    // Test 6: Get Recommendations
    console.log('6. Testing Get Recommendations...');
    const recommendationResponse = await axios.post(`${API_URL}/recommendation`, {
      interests: ['technology', 'science'],
      strongSubjects: ['math', 'computer science'],
      skills: ['problem-solving', 'communication'],
      personality: 'analytical',
      workStylePreference: 'independent'
    }, {
      headers: { Authorization: `Bearer ${loginToken}` }
    });
    console.log('✓ Recommendations received');
    console.log('  Number of recommendations:', recommendationResponse.data.recommendations.length);
    console.log('  Top recommendation:', recommendationResponse.data.recommendations[0]?.title, '\n');

    // Test 7: Invalid Login
    console.log('7. Testing Invalid Login...');
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: 'test@example.com',
        password: 'wrongpassword'
      });
      console.log('✗ Invalid login should have failed\n');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✓ Invalid login correctly rejected');
        console.log('  Error message:', error.response.data.message, '\n');
      } else {
        throw error;
      }
    }

    // Test 8: Weak Password
    console.log('8. Testing Weak Password Validation...');
    try {
      await axios.post(`${API_URL}/auth/register`, {
        name: 'Weak User',
        email: 'weak@example.com',
        password: 'weak',
        grade: '10th'
      });
      console.log('✗ Weak password should have been rejected\n');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✓ Weak password correctly rejected');
        console.log('  Error message:', error.response.data.message, '\n');
      } else {
        throw error;
      }
    }

    // Test 9: Invalid Email
    console.log('9. Testing Invalid Email Validation...');
    try {
      await axios.post(`${API_URL}/auth/register`, {
        name: 'Invalid Email User',
        email: 'invalid-email',
        password: 'valid12345',
        grade: '10th'
      });
      console.log('✗ Invalid email should have been rejected\n');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✓ Invalid email correctly rejected');
        console.log('  Error message:', error.response.data.message, '\n');
      } else {
        throw error;
      }
    }

    console.log('========================================');
    console.log('All API tests completed successfully!');
    console.log('========================================');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testAPI();