const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { marked } = require('marked');
const { v4: uuidv4 } = require('uuid');

class PDFService {
  constructor() {
    this.templateDir = path.join(__dirname, '../templates');
    this.outputDir = path.join(__dirname, '../generated');
  }

  async generatePDF(content, template = 'default', options = {}) {
    try {
      const htmlContent = await this.generateHTML(content, template, options);
      const filename = `document_${uuidv4()}.pdf`;
      const outputPath = path.join(this.outputDir, filename);

      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: 'new'
      });

      const page = await browser.newPage();
      await page.setContent(htmlContent, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });

      const pdfOptions = {
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        },
        ...options.pdfOptions
      };

      await page.pdf(pdfOptions);
      await browser.close();

      return {
        filename,
        path: outputPath,
        url: `/generated/${filename}`,
        size: fs.statSync(outputPath).size
      };
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  async generateHTML(content, template = 'default', options = {}) {
    try {
      // Convert markdown to HTML
      const markdownHtml = marked(content);
      
      // Load template
      const templatePath = path.join(this.templateDir, `${template}.html`);
      let templateHtml;
      
      if (fs.existsSync(templatePath)) {
        templateHtml = fs.readFileSync(templatePath, 'utf8');
      } else {
        templateHtml = this.getDefaultTemplate();
      }

      // Process charts and diagrams placeholders
      const processedHtml = await this.processSpecialElements(markdownHtml);

      // Replace placeholders in template
      const finalHtml = templateHtml
        .replace('{{TITLE}}', options.title || 'Document')
        .replace('{{CONTENT}}', processedHtml)
        .replace('{{AUTHOR}}', options.author || '')
        .replace('{{DATE}}', new Date().toLocaleDateString())
        .replace('{{STYLES}}', this.getCustomStyles(options.styles));

      return finalHtml;
    } catch (error) {
      console.error('Error generating HTML:', error);
      throw new Error('Failed to generate HTML content');
    }
  }

  async processSpecialElements(html) {
    try {
      // Process chart placeholders [CHART: description]
      const chartRegex = /\[CHART:\s*([^\]]+)\]/g;
      let processedHtml = html;
      let match;

      while ((match = chartRegex.exec(html)) !== null) {
        const chartDescription = match[1];
        const chartHtml = await this.generateChartHTML(chartDescription);
        processedHtml = processedHtml.replace(match[0], chartHtml);
      }

      // Process diagram placeholders [DIAGRAM: description]
      const diagramRegex = /\[DIAGRAM:\s*([^\]]+)\]/g;
      match = null;

      while ((match = diagramRegex.exec(html)) !== null) {
        const diagramDescription = match[1];
        const diagramHtml = await this.generateDiagramHTML(diagramDescription);
        processedHtml = processedHtml.replace(match[0], diagramHtml);
      }

      return processedHtml;
    } catch (error) {
      console.error('Error processing special elements:', error);
      return html; // Return original if processing fails
    }
  }

  async generateChartHTML(description) {
    // This would integrate with the chart service
    return `
      <div class="chart-container">
        <div class="chart-placeholder">
          <p><strong>Chart:</strong> ${description}</p>
          <p><em>Chart generation in progress...</em></p>
        </div>
      </div>
    `;
  }

  async generateDiagramHTML(description) {
    // This would integrate with the diagram service
    return `
      <div class="diagram-container">
        <div class="diagram-placeholder">
          <p><strong>Diagram:</strong> ${description}</p>
          <p><em>Diagram generation in progress...</em></p>
        </div>
      </div>
    `;
  }

  getCustomStyles(styles = {}) {
    const defaultStyles = {
      fontFamily: 'Arial, sans-serif',
      fontSize: '12pt',
      lineHeight: '1.6',
      primaryColor: '#333333',
      accentColor: '#2563eb'
    };

    const mergedStyles = { ...defaultStyles, ...styles };

    return `
      <style>
        body {
          font-family: ${mergedStyles.fontFamily};
          font-size: ${mergedStyles.fontSize};
          line-height: ${mergedStyles.lineHeight};
          color: ${mergedStyles.primaryColor};
          max-width: 210mm;
          margin: 0 auto;
        }
        h1, h2, h3, h4, h5, h6 {
          color: ${mergedStyles.accentColor};
          margin-top: 24px;
          margin-bottom: 12px;
        }
        h1 { font-size: 24pt; border-bottom: 2px solid ${mergedStyles.accentColor}; padding-bottom: 8px; }
        h2 { font-size: 20pt; }
        h3 { font-size: 16pt; }
        h4 { font-size: 14pt; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: ${mergedStyles.accentColor};
          color: white;
        }
        .chart-container, .diagram-container {
          margin: 20px 0;
          padding: 16px;
          border: 1px dashed #ccc;
          text-align: center;
          background-color: #f9f9f9;
        }
        blockquote {
          border-left: 4px solid ${mergedStyles.accentColor};
          margin-left: 0;
          padding-left: 20px;
          color: #666;
        }
        code {
          background-color: #f4f4f4;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
        }
        pre {
          background-color: #f4f4f4;
          padding: 16px;
          border-radius: 5px;
          overflow-x: auto;
        }
      </style>
    `;
  }

  getDefaultTemplate() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}}</title>
    {{STYLES}}
</head>
<body>
    <header>
        <h1>{{TITLE}}</h1>
        <div class="document-info">
            <p><strong>Author:</strong> {{AUTHOR}}</p>
            <p><strong>Date:</strong> {{DATE}}</p>
        </div>
        <hr>
    </header>
    
    <main>
        {{CONTENT}}
    </main>
    
    <footer>
        <hr>
        <p style="text-align: center; color: #666; font-size: 10pt;">
            Made by Hexadigitall - hexadigitall.com
        </p>
    </footer>
</body>
</html>
    `;
  }

  getAvailableTemplates() {
    try {
      const templates = [];
      const files = fs.readdirSync(this.templateDir);
      
      files.forEach(file => {
        if (path.extname(file) === '.html') {
          const name = path.basename(file, '.html');
          templates.push({
            id: name,
            name: name.charAt(0).toUpperCase() + name.slice(1),
            path: path.join(this.templateDir, file)
          });
        }
      });

      // Add default template if no custom templates exist
      if (templates.length === 0) {
        templates.push({
          id: 'default',
          name: 'Default',
          description: 'Clean, professional layout'
        });
      }

      return templates;
    } catch (error) {
      console.error('Error getting templates:', error);
      return [{
        id: 'default',
        name: 'Default',
        description: 'Clean, professional layout'
      }];
    }
  }
}

module.exports = new PDFService();
