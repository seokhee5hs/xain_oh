const express = require('express');
const Publication = require('../models/Publication');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get all publications
router.get('/', async (req, res) => {
  try {
    const publications = await Publication.find().sort({ year: -1, createdAt: -1 });
    res.json(publications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch publications' });
  }
});

// Get publication by ID
router.get('/:id', async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);
    if (!publication) return res.status(404).json({ error: 'Publication not found' });
    res.json(publication);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch publication' });
  }
});

// Create publication
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, authors, type, journal, year, doi, url, abstract } = req.body;
    const publication = new Publication({ title, authors, type, journal, year, doi, url, abstract });
    await publication.save();
    res.status(201).json(publication);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create publication' });
  }
});

// Update publication
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const publication = await Publication.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!publication) return res.status(404).json({ error: 'Publication not found' });
    res.json(publication);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update publication' });
  }
});

// Delete publication
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const publication = await Publication.findByIdAndDelete(req.params.id);
    if (!publication) return res.status(404).json({ error: 'Publication not found' });
    res.json({ message: 'Publication deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete publication' });
  }
});

module.exports = router;
