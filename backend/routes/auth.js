const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { registerLimiter, loginLimiter } = require('../middleware/rateLimiter');

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);

module.exports = router;
