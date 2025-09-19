const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const { body } = require('express-validator');

// Generate PDF from enhanced content
router.post('/generate', [
  body('content').notEmpty().withMessage('Content is required'),
  body('template').optional().isString().withMessage('Template must be a string'),
  body('options').optional().isObject().withMessage('Options must be an object')
], pdfController.generatePDF);

// Get available PDF templates
router.get('/templates', pdfController.getTemplates);

// Get template details
router.get('/templates/:templateId', pdfController.getTemplateDetails);

// Preview PDF (returns HTML)
router.post('/preview', [
  body('content').notEmpty().withMessage('Content is required'),
  body('template').optional().isString().withMessage('Template must be a string')
], pdfController.previewPDF);

module.exports = router;
