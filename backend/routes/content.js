const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { body } = require('express-validator');

// Analyze text content for potential enhancements
router.post('/analyze', [
  body('text').notEmpty().withMessage('Text content is required'),
  body('format').optional().isIn(['markdown', 'plain', 'html']).withMessage('Invalid format')
], contentController.analyzeContent);

// Apply AI-powered enhancements to content
router.post('/enhance', [
  body('text').notEmpty().withMessage('Text content is required'),
  body('suggestions').isArray().withMessage('Suggestions must be an array'),
  body('format').optional().isIn(['markdown', 'plain', 'html']).withMessage('Invalid format')
], contentController.enhanceContent);

// Extract text from various formats
router.post('/extract', contentController.extractText);

// Get content suggestions based on type
router.get('/suggestions/:type', contentController.getSuggestions);

module.exports = router;
