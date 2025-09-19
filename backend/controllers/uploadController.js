const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const { v4: uuidv4 } = require('uuid');

class UploadController {
  async uploadDocument(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded'
        });
      }

      const uploadId = uuidv4();
      const filePath = req.file.path;
      const originalName = req.file.originalname;
      const fileExtension = path.extname(originalName).toLowerCase();
      
      let extractedText = '';
      let metadata = {
        originalName,
        size: req.file.size,
        type: req.file.mimetype,
        uploadId,
        uploadTime: new Date().toISOString()
      };

      try {
        switch (fileExtension) {
          case '.txt':
          case '.md':
            extractedText = fs.readFileSync(filePath, 'utf8');
            metadata.format = fileExtension === '.md' ? 'markdown' : 'plain';
            break;
            
          case '.docx':
            const result = await mammoth.extractRawText({ path: filePath });
            extractedText = result.value;
            metadata.format = 'docx';
            metadata.warnings = result.messages;
            break;
            
          case '.html':
          case '.htm':
            const htmlContent = fs.readFileSync(filePath, 'utf8');
            extractedText = htmlContent.replace(/<[^>]*>/g, '').trim();
            metadata.format = 'html';
            break;
            
          default:
            return res.status(400).json({
              error: 'Unsupported file format',
              supported: ['.txt', '.md', '.docx', '.html', '.htm']
            });
        }

        // Clean up uploaded file
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        res.json({
          success: true,
          upload_id: uploadId,
          extracted_text: extractedText,
          metadata,
          statistics: {
            character_count: extractedText.length,
            word_count: extractedText.split(/\s+/).filter(word => word.length > 0).length,
            line_count: extractedText.split('\n').length
          }
        });

      } catch (processError) {
        // Clean up file if processing fails
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        throw processError;
      }

    } catch (error) {
      console.error('Upload processing error:', error);
      res.status(500).json({
        error: 'Failed to process uploaded file',
        message: error.message
      });
    }
  }

  async uploadBatch(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          error: 'No files uploaded'
        });
      }

      const batchId = uuidv4();
      const results = [];
      const errors = [];

      for (const file of req.files) {
        try {
          const uploadResult = await this.processFile(file);
          results.push(uploadResult);
        } catch (error) {
          errors.push({
            filename: file.originalname,
            error: error.message
          });
        }
      }

      res.json({
        success: true,
        batch_id: batchId,
        processed_count: results.length,
        error_count: errors.length,
        results,
        errors
      });

    } catch (error) {
      console.error('Batch upload error:', error);
      res.status(500).json({
        error: 'Failed to process batch upload',
        message: error.message
      });
    }
  }

  async processFile(file) {
    const uploadId = uuidv4();
    const filePath = file.path;
    const originalName = file.originalname;
    const fileExtension = path.extname(originalName).toLowerCase();
    
    let extractedText = '';
    
    try {
      switch (fileExtension) {
        case '.txt':
        case '.md':
          extractedText = fs.readFileSync(filePath, 'utf8');
          break;
          
        case '.docx':
          const result = await mammoth.extractRawText({ path: filePath });
          extractedText = result.value;
          break;
          
        case '.html':
        case '.htm':
          const htmlContent = fs.readFileSync(filePath, 'utf8');
          extractedText = htmlContent.replace(/<[^>]*>/g, '').trim();
          break;
          
        default:
          throw new Error(`Unsupported file format: ${fileExtension}`);
      }

      // Clean up file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return {
        upload_id: uploadId,
        filename: originalName,
        extracted_text: extractedText,
        character_count: extractedText.length,
        word_count: extractedText.split(/\s+/).filter(word => word.length > 0).length
      };

    } catch (error) {
      // Clean up file on error
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw error;
    }
  }

  async getUploadStatus(req, res) {
    try {
      const { uploadId } = req.params;
      
      // In a real implementation, you would store upload status in a database
      // For now, we'll return a simple response
      res.json({
        success: true,
        upload_id: uploadId,
        status: 'completed',
        message: 'Upload processed successfully'
      });

    } catch (error) {
      console.error('Get upload status error:', error);
      res.status(500).json({
        error: 'Failed to get upload status',
        message: error.message
      });
    }
  }
}

module.exports = new UploadController();
