const express = require('express');
const Member = require('../models/Member');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get all members
router.get('/', async (req, res) => {
  try {
    const members = await Member.find().sort({ role: 1, joinDate: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Get active members
router.get('/status/active', async (req, res) => {
  try {
    const members = await Member.find({ status: 'Active' }).sort({ role: 1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Get member by ID
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch member' });
  }
});

// Create member
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, role, title, email, phone, bio, avatar, researchAreas, status, joinDate } = req.body;
    const member = new Member({ name, role, title, email, phone, bio, avatar, researchAreas, status, joinDate });
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create member' });
  }
});

// Update member
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update member' });
  }
});

// Delete member
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

module.exports = router;
