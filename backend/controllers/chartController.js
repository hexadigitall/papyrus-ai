const { validationResult } = require('express-validator');
const chartService = require('../services/chartService');
const aiService = require('../services/aiService');

class ChartController {
  async generateChart(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { data, type, options } = req.body;
      
      const result = await chartService.generateChart(data, type, options);
      
      res.json({
        success: true,
        chart: result
      });
    } catch (error) {
      console.error('Chart generation error:', error);
      res.status(500).json({
        error: 'Failed to generate chart',
        message: error.message
      });
    }
  }

  async generateDiagram(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { description, type } = req.body;
      
      // Generate mermaid code using AI
      const mermaidCode = await aiService.generateDiagramDescription(description, type);
      
      // Create diagram file
      const result = await chartService.generateDiagram(mermaidCode);
      
      res.json({
        success: true,
        diagram: result,
        mermaid_code: mermaidCode
      });
    } catch (error) {
      console.error('Diagram generation error:', error);
      res.status(500).json({
        error: 'Failed to generate diagram',
        message: error.message
      });
    }
  }

  async extractChartData(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { text } = req.body;
      
      // Extract data using chart service
      const extractedData = chartService.extractDataFromText(text);
      
      // Use AI to get more sophisticated data extraction
      const aiExtractedData = await aiService.extractDataForChart(text);
      
      // Combine both approaches
      const combinedData = {
        simple_extraction: extractedData,
        ai_extraction: aiExtractedData,
        suggested_charts: []
      };

      // Generate suggested charts from AI extracted data
      if (aiExtractedData.charts && aiExtractedData.charts.length > 0) {
        for (const chartData of aiExtractedData.charts) {
          combinedData.suggested_charts.push({
            title: chartData.title,
            type: chartData.type,
            data: chartData.data,
            position: chartData.position
          });
        }
      }

      // Generate suggested charts from simple extraction
      if (extractedData.keyValue && extractedData.keyValue.length > 0) {
        const labels = extractedData.keyValue.map(item => item.label);
        const values = extractedData.keyValue.map(item => item.value);
        const suggestedType = chartService.suggestChartType(values);
        
        combinedData.suggested_charts.push({
          title: 'Extracted Data',
          type: suggestedType,
          data: chartService.createBarChart(labels, [{ label: 'Values', data: values }]),
          source: 'simple_extraction'
        });
      }
      
      res.json({
        success: true,
        extracted_data: combinedData
      });
    } catch (error) {
      console.error('Chart data extraction error:', error);
      res.status(500).json({
        error: 'Failed to extract chart data',
        message: error.message
      });
    }
  }
}

module.exports = new ChartController();
