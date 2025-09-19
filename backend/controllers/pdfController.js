const { validationResult } = require('express-validator');
const pdfService = require('../services/pdfService');

class PDFController {
  async generatePDF(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { content, template, options } = req.body;
      
      const result = await pdfService.generatePDF(content, template, options);
      
      res.json({
        success: true,
        pdf: result,
        generation_time: new Date().toISOString()
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      res.status(500).json({
        error: 'Failed to generate PDF',
        message: error.message
      });
    }
  }

  async getTemplates(req, res) {
    try {
      const templates = pdfService.getAvailableTemplates();
      
      res.json({
        success: true,
        templates
      });
    } catch (error) {
      console.error('Get templates error:', error);
      res.status(500).json({
        error: 'Failed to get templates',
        message: error.message
      });
    }
  }

  async getTemplateDetails(req, res) {
    try {
      const { templateId } = req.params;
      const templates = pdfService.getAvailableTemplates();
      
      const template = templates.find(t => t.id === templateId);
      
      if (!template) {
        return res.status(404).json({
          error: 'Template not found'
        });
      }
      
      res.json({
        success: true,
        template
      });
    } catch (error) {
      console.error('Get template details error:', error);
      res.status(500).json({
        error: 'Failed to get template details',
        message: error.message
      });
    }
  }

  async previewPDF(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { content, template, options } = req.body;
      
      const htmlContent = await pdfService.generateHTML(content, template, options);
      
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlContent);
    } catch (error) {
      console.error('PDF preview error:', error);
      res.status(500).json({
        error: 'Failed to generate preview',
        message: error.message
      });
    }
  }
}

module.exports = new PDFController();
