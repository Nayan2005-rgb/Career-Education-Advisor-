const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { name, email, password, grade, educationLevel, state, familyIncome, academicPercentage, category, disabilityPercentage, courses } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    if (!/[a-zA-Z]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one letter' });
    }
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one number' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      grade,
      educationLevel,
      state,
      familyIncome,
      academicPercentage,
      category,
      disabilityPercentage,
      courses: courses || []
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        grade: user.grade,
        educationLevel: user.educationLevel,
        state: user.state,
        familyIncome: user.familyIncome,
        academicPercentage: user.academicPercentage,
        category: user.category,
        disabilityPercentage: user.disabilityPercentage,
        courses: user.courses
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Unable to create account. Please try again.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Unable to log in. Please check your email and password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Unable to log in. Please check your email and password.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, grade: user.grade },
    });
  } catch (err) {
    res.status(500).json({ message: 'Unable to log in. Please try again later.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: 'Unable to load profile. Please try again.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { educationLevel, state, familyIncome, academicPercentage, category, disabilityPercentage, courses } = req.body;

    const updates = {};
    if (educationLevel !== undefined) updates.educationLevel = educationLevel;
    if (state !== undefined) updates.state = state;
    if (familyIncome !== undefined) updates.familyIncome = familyIncome;
    if (academicPercentage !== undefined) updates.academicPercentage = academicPercentage;
    if (category !== undefined) updates.category = category;
    if (disabilityPercentage !== undefined) updates.disabilityPercentage = disabilityPercentage;
    if (courses !== undefined) updates.courses = courses;

    const user = await User.updateById(req.user.id, updates);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    res.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });
  } catch (err) {
    res.status(500).json({ message: 'Unable to update profile. Please try again.' });
  }
};
