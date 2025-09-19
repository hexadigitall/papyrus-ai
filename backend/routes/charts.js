const express = require('express');
const router = express.Router();
const chartController = require('../controllers/chartController');
const { body } = require('express-validator');

// Generate chart from data
router.post('/generate', [
  body('data').isArray().withMessage('Data must be an array'),
  body('type').isIn(['bar', 'line', 'pie', 'doughnut', 'scatter', 'bubble']).withMessage('Invalid chart type'),
  body('options').optional().isObject().withMessage('Options must be an object')
], chartController.generateChart);

// Generate diagram from text description
router.post('/diagram', [
  body('description').notEmpty().withMessage('Description is required'),
  body('type').optional().isIn(['flowchart', 'sequence', 'class', 'state', 'gantt']).withMessage('Invalid diagram type')
], chartController.generateDiagram);

// Extract data from text for chart generation
router.post('/extract-data', [
  body('text').notEmpty().withMessage('Text content is required')
], chartController.extractChartData);

module.exports = router;
