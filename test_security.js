const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testSecurity() {
  console.log('Testing Security Controls...\n');

  try {
    // Create two test users
    const timestamp = Date.now();
    const user1Email = `user1_${timestamp}@example.com`;
    const user2Email = `user2_${timestamp}@example.com`;

    console.log('1. Creating test users...');
    const user1 = await axios.post(`${API_URL}/auth/register`, {
      name: 'User 1',
      email: user1Email,
      password: 'SecurePass123',
      grade: '12th'
    });
    const user1Token = user1.data.token;
    console.log('✓ User 1 created');

    const user2 = await axios.post(`${API_URL}/auth/register`, {
      name: 'User 2',
      email: user2Email,
      password: 'SecurePass456',
      grade: '12th'
    });
    const user2Token = user2.data.token;
    console.log('✓ User 2 created\n');

    // Test 2: User 1 creates a resume
    console.log('2. Testing resume ownership...');
    const resume = await axios.post(`${API_URL}/resume`, {
      name: 'User 1 Resume',
      template: 'modern',
      personalInfo: { name: 'User 1' }
    }, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    const resumeId = resume.data.resume.id;
    console.log('✓ User 1 created resume:', resumeId);

    // Test 3: User 2 tries to access User 1's resume (should fail)
    console.log('3. Testing unauthorized access control...');
    try {
      await axios.get(`${API_URL}/resume/${resumeId}`, {
        headers: { Authorization: `Bearer ${user2Token}` }
      });
      console.log('✗ SECURITY ISSUE: User 2 accessed User 1\'s resume!');
      process.exit(1);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('✓ Unauthorized access correctly blocked (403 Forbidden)');
      } else {
        console.log('✗ Unexpected error:', error.response?.status);
        process.exit(1);
      }
    }

    // Test 4: User 2 tries to update User 1's resume (should fail)
    console.log('4. Testing unauthorized update control...');
    try {
      await axios.put(`${API_URL}/resume/${resumeId}`, {
        name: 'Hacked Resume'
      }, {
        headers: { Authorization: `Bearer ${user2Token}` }
      });
      console.log('✗ SECURITY ISSUE: User 2 updated User 1\'s resume!');
      process.exit(1);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('✓ Unauthorized update correctly blocked (403 Forbidden)');
      } else {
        console.log('✗ Unexpected error:', error.response?.status);
        process.exit(1);
      }
    }

    // Test 5: User 2 tries to delete User 1's resume (should fail)
    console.log('5. Testing unauthorized delete control...');
    try {
      await axios.delete(`${API_URL}/resume/${resumeId}`, {
        headers: { Authorization: `Bearer ${user2Token}` }
      });
      console.log('✗ SECURITY ISSUE: User 2 deleted User 1\'s resume!');
      process.exit(1);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('✓ Unauthorized delete correctly blocked (403 Forbidden)');
      } else {
        console.log('✗ Unexpected error:', error.response?.status);
        process.exit(1);
      }
    }

    // Test 6: Test saved opportunities ownership
    console.log('\n6. Testing saved opportunities ownership...');
    const savedOpp = await axios.post(`${API_URL}/opportunity/save/demo-001`, {}, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    console.log('✓ User 1 saved opportunity');

    try {
      await axios.delete(`${API_URL}/opportunity/saved/demo-001`, {
        headers: { Authorization: `Bearer ${user2Token}` }
      });
      console.log('✗ SECURITY ISSUE: User 2 removed User 1\'s saved opportunity!');
      process.exit(1);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✓ Unauthorized removal correctly blocked (404 Not Found)');
      } else {
        console.log('✗ Unexpected error:', error.response?.status);
        process.exit(1);
      }
    }

    // Test 7: Test application tracking ownership
    console.log('\n7. Testing application tracking ownership...');
    const app = await axios.post(`${API_URL}/opportunity/track/demo-002`, {
      status: 'Applied'
    }, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    const appId = app.data.application.id;
    console.log('✓ User 1 created application tracking:', appId);

    try {
      await axios.put(`${API_URL}/opportunity/applications/${appId}`, {
        status: 'Rejected'
      }, {
        headers: { Authorization: `Bearer ${user2Token}` }
      });
      console.log('✗ SECURITY ISSUE: User 2 updated User 1\'s application!');
      process.exit(1);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('✓ Unauthorized application update correctly blocked (403 Forbidden)');
      } else {
        console.log('✗ Unexpected error:', error.response?.status);
        process.exit(1);
      }
    }

    // Test 8: Test assessment ownership
    console.log('\n8. Testing assessment ownership...');
    const assessment = await axios.post(`${API_URL}/assessment`, {
      interests: ['technology'],
      skills: ['coding']
    }, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    console.log('✓ User 1 submitted assessment');

    const user2Assessments = await axios.get(`${API_URL}/assessment/history`, {
      headers: { Authorization: `Bearer ${user2Token}` }
    });
    if (user2Assessments.data.length > 0) {
      console.log('✗ SECURITY ISSUE: User 2 accessed User 1\'s assessments!');
      process.exit(1);
    }
    console.log('✓ User 2 cannot access User 1\'s assessments');

    console.log('\n========================================');
    console.log('All security tests passed!');
    console.log('Authorization controls are working correctly.');
    console.log('========================================');

  } catch (error) {
    console.error('❌ Security test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testSecurity();
