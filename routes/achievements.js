const express = require('express');
const Achievement = require('../models/Achievement');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get all achievements
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ year: -1, createdAt: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// Get achievements by category
router.get('/category/:category', async (req, res) => {
  try {
    const achievements = await Achievement.find({ category: req.params.category });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// Get achievement by ID
router.get('/:id', async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) return res.status(404).json({ error: 'Achievement not found' });
    res.json(achievement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch achievement' });
  }
});

// Create achievement
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, category, description, details, year, status, amount, institution } = req.body;
    const achievement = new Achievement({ title, category, description, details, year, status, amount, institution });
    await achievement.save();
    res.status(201).json(achievement);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create achievement' });
  }
});

// Update achievement
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!achievement) return res.status(404).json({ error: 'Achievement not found' });
    res.json(achievement);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update achievement' });
  }
});

// Delete achievement
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    if (!achievement) return res.status(404).json({ error: 'Achievement not found' });
    res.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete achievement' });
  }
});

module.module = router;
