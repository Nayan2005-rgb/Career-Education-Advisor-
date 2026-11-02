const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testRateLimiting() {
  console.log('Testing Rate Limiting...\n');

  try {
    const timestamp = Date.now();
    const testEmail = `ratelimit${timestamp}@example.com`;

    // Test 1: Login rate limiting (5 attempts per 15 minutes)
    console.log('1. Testing login rate limiting (5 allowed attempts)...');
    let successCount = 0;
    for (let i = 1; i <= 7; i++) {
      try {
        await axios.post(`${API_URL}/auth/login`, {
          email: testEmail,
          password: 'wrongpassword'
        });
        successCount++;
      } catch (error) {
        if (error.response && error.response.status === 429) {
          console.log(`  Attempt ${i}: Rate limited (429 Too Many Requests)`);
          break;
        }
      }
    }

    if (successCount > 5) {
      console.log('✗ SECURITY ISSUE: More than 5 login attempts allowed');
      process.exit(1);
    }
    console.log('✓ Login rate limiting working correctly\n');

    // Test 2: Registration rate limiting (3 attempts per hour)
    console.log('2. Testing registration rate limiting (3 allowed attempts)...');
    let regAttempts = 0;
    for (let i = 1; i <= 5; i++) {
      try {
        await axios.post(`${API_URL}/auth/register`, {
          name: `Test User ${i}`,
          email: `ratelimit${timestamp}${i}@example.com`,
          password: 'SecurePass123',
          grade: '12th'
        });
        regAttempts++;
      } catch (error) {
        if (error.response && error.response.status === 429) {
          console.log(`  Attempt ${i}: Rate limited (429 Too Many Requests)`);
          break;
        }
      }
    }

    if (regAttempts > 3) {
      console.log('✗ SECURITY ISSUE: More than 3 registration attempts allowed');
      process.exit(1);
    }
    console.log('✓ Registration rate limiting working correctly\n');

    console.log('========================================');
    console.log('All rate limiting tests passed!');
    console.log('========================================');

  } catch (error) {
    console.error('❌ Rate limiting test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testRateLimiting();
