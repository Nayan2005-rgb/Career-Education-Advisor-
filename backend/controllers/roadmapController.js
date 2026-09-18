const Roadmap = require('../models/Roadmap');
const { generateRoadmap, calculateCompletionPercentage } = require('../utils/roadmapGenerator');
const careers = require('../data/careers.json');

/**
 * Create or get a roadmap for a user and career
 */
exports.createOrGetRoadmap = async (req, res) => {
  try {
    const { careerTitle, userProfile } = req.body;
    const userId = req.user.id;

    if (!careerTitle) {
      return res.status(400).json({ message: 'Career title is required' });
    }

    // Check if roadmap already exists for this user and career
    const existingRoadmap = Roadmap.findOne({ 
      userId, 
      careerTitle: careerTitle 
    });

    if (existingRoadmap) {
      return res.json(existingRoadmap);
    }

    // Find career data
    const career = careers.find(c => 
      c.title.toLowerCase() === careerTitle.toLowerCase()
    );

    if (!career) {
      return res.status(404).json({ message: 'Career not found' });
    }

    // Generate new roadmap
    const userProfileWithId = {
      ...userProfile,
      userId
    };

    const newRoadmap = generateRoadmap(career, userProfileWithId);
    const savedRoadmap = Roadmap.create(newRoadmap);

    res.status(201).json(savedRoadmap);
  } catch (err) {
    console.error('Error creating roadmap:', err);
    res.status(500).json({ message: 'Unable to create roadmap. Please try again.' });
  }
};

/**
 * Get roadmap for a specific career
 */
exports.getRoadmap = async (req, res) => {
  try {
    const { careerTitle } = req.params;
    const userId = req.user.id;

    const roadmap = Roadmap.findOne({ 
      userId, 
      careerTitle: decodeURIComponent(careerTitle) 
    });

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    res.json(roadmap);
  } catch (err) {
    console.error('Error getting roadmap:', err);
    res.status(500).json({ message: 'Unable to load roadmap. Please try again.' });
  }
};

/**
 * Get all roadmaps for a user
 */
exports.getUserRoadmaps = async (req, res) => {
  try {
    const userId = req.user.id;
    const roadmaps = Roadmap.find({ userId });
    
    // Sort by createdAt descending
    roadmaps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(roadmaps);
  } catch (err) {
    console.error('Error getting user roadmaps:', err);
    res.status(500).json({ message: 'Unable to load roadmaps. Please try again.' });
  }
};

/**
 * Update roadmap step status
 */
exports.updateStepStatus = async (req, res) => {
  try {
    const { roadmapId, stepId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!status || !['pending', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be pending, in_progress, or completed' });
    }

    const roadmap = Roadmap.findById(roadmapId);

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    if (roadmap.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this roadmap' });
    }

    // Find and update the step
    const stepIndex = roadmap.steps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) {
      return res.status(404).json({ message: 'Step not found' });
    }

    // Update step status
    roadmap.steps[stepIndex].status = status;
    
    // If marking as completed, update previous steps to completed
    if (status === 'completed') {
      for (let i = 0; i < stepIndex; i++) {
        if (roadmap.steps[i].status !== 'completed') {
          roadmap.steps[i].status = 'completed';
        }
      }
    }
    
    // If marking as in_progress, update next steps to pending
    if (status === 'in_progress') {
      for (let i = stepIndex + 1; i < roadmap.steps.length; i++) {
        roadmap.steps[i].status = 'pending';
      }
    }

    // Update the roadmap
    const updatedRoadmap = Roadmap.updateById(roadmapId, {
      steps: roadmap.steps,
      updatedAt: new Date().toISOString()
    });

    res.json(updatedRoadmap);
  } catch (err) {
    console.error('Error updating step status:', err);
    res.status(500).json({ message: 'Unable to update step status. Please try again.' });
  }
};

/**
 * Delete a roadmap
 */
exports.deleteRoadmap = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const userId = req.user.id;

    const roadmap = Roadmap.findById(roadmapId);

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    if (roadmap.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this roadmap' });
    }

    Roadmap.deleteById(roadmapId);
    res.json({ message: 'Roadmap deleted successfully' });
  } catch (err) {
    console.error('Error deleting roadmap:', err);
    res.status(500).json({ message: 'Unable to delete roadmap. Please try again.' });
  }
};
