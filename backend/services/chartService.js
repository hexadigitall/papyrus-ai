const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class ChartService {
  constructor() {
    this.chartJSNodeCanvas = new ChartJSNodeCanvas({ 
      width: 800, 
      height: 600,
      backgroundColour: 'white'
    });
    this.outputDir = path.join(__dirname, '../generated/charts');
    
    // Ensure charts directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generateChart(data, type, options = {}) {
    try {
      const chartConfig = {
        type: type,
        data: data,
        options: {
          responsive: false,
          plugins: {
            title: {
              display: true,
              text: options.title || 'Chart'
            },
            legend: {
              display: true,
              position: 'top'
            }
          },
          scales: this.getScalesConfig(type),
          ...options.chartOptions
        }
      };

      const imageBuffer = await this.chartJSNodeCanvas.renderToBuffer(chartConfig);
      const filename = `chart_${uuidv4()}.png`;
      const filePath = path.join(this.outputDir, filename);
      
      fs.writeFileSync(filePath, imageBuffer);

      return {
        filename,
        path: filePath,
        url: `/generated/charts/${filename}`,
        width: 800,
        height: 600
      };
    } catch (error) {
      console.error('Error generating chart:', error);
      throw new Error('Failed to generate chart');
    }
  }

  getScalesConfig(type) {
    if (type === 'pie' || type === 'doughnut') {
      return {}; // Pie charts don't use scales
    }

    return {
      x: {
        display: true,
        grid: {
          display: true
        }
      },
      y: {
        display: true,
        grid: {
          display: true
        },
        beginAtZero: true
      }
    };
  }

  async generateMultipleCharts(chartsData) {
    try {
      const results = [];
      
      for (const chartData of chartsData) {
        const result = await this.generateChart(
          chartData.data,
          chartData.type,
          chartData.options
        );
        results.push({
          ...result,
          title: chartData.title || 'Chart',
          description: chartData.description || ''
        });
      }

      return results;
    } catch (error) {
      console.error('Error generating multiple charts:', error);
      throw new Error('Failed to generate charts');
    }
  }

  createBarChart(labels, datasets, options = {}) {
    return {
      labels: labels,
      datasets: datasets.map(dataset => ({
        label: dataset.label,
        data: dataset.data,
        backgroundColor: dataset.backgroundColor || this.getDefaultColors(dataset.data.length),
        borderColor: dataset.borderColor || this.getDefaultBorderColors(dataset.data.length),
        borderWidth: 1
      }))
    };
  }

  createLineChart(labels, datasets, options = {}) {
    return {
      labels: labels,
      datasets: datasets.map(dataset => ({
        label: dataset.label,
        data: dataset.data,
        fill: dataset.fill || false,
        borderColor: dataset.borderColor || '#2563eb',
        backgroundColor: dataset.backgroundColor || 'rgba(37, 99, 235, 0.1)',
        tension: 0.1
      }))
    };
  }

  createPieChart(labels, data, options = {}) {
    return {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: this.getDefaultColors(data.length),
        borderColor: this.getDefaultBorderColors(data.length),
        borderWidth: 1
      }]
    };
  }

  getDefaultColors(count) {
    const colors = [
      '#2563eb', '#dc2626', '#059669', '#d97706',
      '#7c3aed', '#db2777', '#0891b2', '#65a30d'
    ];
    
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(colors[i % colors.length]);
    }
    return result;
  }

  getDefaultBorderColors(count) {
    return this.getDefaultColors(count).map(color => color + '80');
  }

  async generateDiagram(mermaidCode, options = {}) {
    try {
      // For now, we'll create a placeholder for mermaid diagrams
      // In a full implementation, you would use mermaid-cli or similar
      const filename = `diagram_${uuidv4()}.html`;
      const filePath = path.join(this.outputDir, filename);
      
      const html = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
  <script>mermaid.initialize({startOnLoad:true});</script>
</head>
<body>
  <div class="mermaid">
    ${mermaidCode}
  </div>
</body>
</html>
      `;

      fs.writeFileSync(filePath, html);

      return {
        filename,
        path: filePath,
        url: `/generated/charts/${filename}`,
        type: 'diagram'
      };
    } catch (error) {
      console.error('Error generating diagram:', error);
      throw new Error('Failed to generate diagram');
    }
  }

  // Extract numerical data from text for chart generation
  extractDataFromText(text) {
    const patterns = {
      // Pattern for simple data like "Sales: 100, Marketing: 50, Development: 200"
      keyValue: /(\w+):\s*(\d+(?:\.\d+)?)/g,
      
      // Pattern for tabular data
      table: /\|[^|]+\|/g,
      
      // Pattern for bullet points with numbers
      bullets: /[-*]\s*([^:]+):\s*(\d+(?:\.\d+)?)/g
    };

    const extractedData = {
      keyValue: [],
      tables: [],
      bullets: []
    };

    // Extract key-value pairs
    let match;
    while ((match = patterns.keyValue.exec(text)) !== null) {
      extractedData.keyValue.push({
        label: match[1].trim(),
        value: parseFloat(match[2])
      });
    }

    // Extract bullet point data
    const bulletPattern = patterns.bullets;
    bulletPattern.lastIndex = 0; // Reset regex
    while ((match = bulletPattern.exec(text)) !== null) {
      extractedData.bullets.push({
        label: match[1].trim(),
        value: parseFloat(match[2])
      });
    }

    return extractedData;
  }

  suggestChartType(data) {
    const dataSize = data.length;
    
    if (dataSize <= 0) return 'bar';
    if (dataSize <= 5) return 'pie';
    if (dataSize <= 10) return 'bar';
    return 'line';
  }
}

module.exports = new ChartService();
