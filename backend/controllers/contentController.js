const { validationResult } = require('express-validator');
const aiService = require('../services/aiService');
const mammoth = require('mammoth');
const fs = require('fs');

class ContentController {
  async analyzeContent(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { text, format } = req.body;
      
      const analysis = await aiService.analyzeContent(text, format);
      
      res.json({
        success: true,
        analysis
      });
    } catch (error) {
      console.error('Content analysis error:', error);
      res.status(500).json({
        error: 'Failed to analyze content',
        message: error.message
      });
    }
  }

  async enhanceContent(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { text, suggestions, format } = req.body;
      
      const enhancedContent = await aiService.enhanceContent(text, suggestions, format);
      
      res.json({
        success: true,
        enhanced_content: enhancedContent,
        original_length: text.length,
        enhanced_length: enhancedContent.length
      });
    } catch (error) {
      console.error('Content enhancement error:', error);
      res.status(500).json({
        error: 'Failed to enhance content',
        message: error.message
      });
    }
  }

  async extractText(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded'
        });
      }

      const filePath = req.file.path;
      const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
      
      let extractedText = '';
      
      switch (fileExtension) {
        case 'txt':
        case 'md':
          extractedText = fs.readFileSync(filePath, 'utf8');
          break;
          
        case 'docx':
          const result = await mammoth.extractRawText({ path: filePath });
          extractedText = result.value;
          break;
          
        case 'html':
          const htmlContent = fs.readFileSync(filePath, 'utf8');
          extractedText = htmlContent.replace(/<[^>]*>/g, '').trim();
          break;
          
        default:
          return res.status(400).json({
            error: 'Unsupported file format'
          });
      }

      // Clean up uploaded file
      fs.unlinkSync(filePath);
      
      res.json({
        success: true,
        extracted_text: extractedText,
        length: extractedText.length,
        format: fileExtension
      });
    } catch (error) {
      console.error('Text extraction error:', error);
      res.status(500).json({
        error: 'Failed to extract text',
        message: error.message
      });
    }
  }

  async getSuggestions(req, res) {
    try {
      const { type } = req.params;
      
      const suggestionTypes = {
        typography: {
          fonts: ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Verdana', 'Calibri'],
          sizes: ['10pt', '11pt', '12pt', '14pt', '16pt', '18pt'],
          styles: ['Normal', 'Bold', 'Italic', 'Bold Italic']
        },
        colors: {
          primary: ['#333333', '#000000', '#2c3e50', '#34495e'],
          accent: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'],
          backgrounds: ['#ffffff', '#f8f9fa', '#ecf0f1', '#bdc3c7']
        },
        layouts: [
          { id: 'default', name: 'Default', description: 'Clean and simple' },
          { id: 'modern', name: 'Modern', description: 'Contemporary design' },
          { id: 'classic', name: 'Classic', description: 'Traditional layout' },
          { id: 'minimal', name: 'Minimal', description: 'Ultra-clean design' }
        ]
      };

      if (suggestionTypes[type]) {
        res.json({
          success: true,
          suggestions: suggestionTypes[type]
        });
      } else {
        res.status(404).json({
          error: 'Suggestion type not found'
        });
      }
    } catch (error) {
      console.error('Get suggestions error:', error);
      res.status(500).json({
        error: 'Failed to get suggestions',
        message: error.message
      });
    }
  }
}

module.exports = new ContentController();
