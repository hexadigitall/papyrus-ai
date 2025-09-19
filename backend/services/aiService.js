const OpenAI = require('openai');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async analyzeContent(text, format = 'plain') {
    try {
      const prompt = `
        Analyze the following ${format} text and suggest improvements for creating a professional PDF document.
        
        Text to analyze:
        """
        ${text}
        """
        
        Please provide suggestions in the following categories:
        1. Structure improvements (headings, sections, subsections)
        2. Content formatting (bullet points, numbered lists, emphasis)
        3. Data visualization opportunities (tables, charts, diagrams)
        4. Typography and styling recommendations
        5. Content enhancement suggestions (missing information, clarity improvements)
        
        Return your response as a JSON object with the following structure:
        {
          "suggestions": [
            {
              "type": "heading",
              "position": "line number or text snippet",
              "current": "current text",
              "suggested": "suggested heading text",
              "level": 1-6,
              "reasoning": "why this should be a heading"
            },
            {
              "type": "list",
              "position": "line number or text snippet",
              "current": "current text",
              "suggested": "* item 1\\n* item 2",
              "listType": "bullet|numbered",
              "reasoning": "why this should be a list"
            },
            {
              "type": "table",
              "position": "line number or text snippet",
              "current": "current text",
              "suggested": "table markdown",
              "reasoning": "why this data should be in a table"
            },
            {
              "type": "chart",
              "position": "line number or text snippet",
              "current": "current text",
              "chartType": "bar|line|pie|scatter",
              "data": "extracted data for chart",
              "reasoning": "why this data should be visualized"
            },
            {
              "type": "diagram",
              "position": "line number or text snippet",
              "current": "current text",
              "diagramType": "flowchart|sequence|mindmap",
              "description": "diagram description",
              "reasoning": "why this needs a diagram"
            }
          ],
          "overall_structure": {
            "title": "suggested document title",
            "sections": ["section1", "section2", "section3"],
            "estimated_pages": 5,
            "document_type": "report|article|manual|presentation"
          },
          "typography": {
            "font_suggestions": ["Roboto", "Open Sans", "Lato"],
            "style_recommendations": ["professional", "modern", "clean"]
          }
        }
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional document formatting expert. Analyze text and provide specific, actionable suggestions for creating well-structured PDF documents."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result;
    } catch (error) {
      console.error('Error analyzing content:', error);
      throw new Error('Failed to analyze content with AI');
    }
  }

  async enhanceContent(text, suggestions, format = 'plain') {
    try {
      const prompt = `
        Apply the following suggestions to enhance this ${format} text for PDF generation:
        
        Original text:
        """
        ${text}
        """
        
        Suggestions to apply:
        ${JSON.stringify(suggestions, null, 2)}
        
        Return the enhanced text in markdown format with:
        1. Proper headings (# ## ### etc.)
        2. Formatted lists
        3. Tables where suggested
        4. Placeholders for charts and diagrams like: [CHART: chart_description]
        5. Emphasis and formatting applied
        
        Maintain the original meaning and content while improving structure and readability.
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a professional document editor. Apply formatting suggestions to create well-structured markdown content."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 3000
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error enhancing content:', error);
      throw new Error('Failed to enhance content with AI');
    }
  }

  async extractDataForChart(text) {
    try {
      const prompt = `
        Analyze the following text and extract any numerical data that could be visualized as charts or graphs:
        
        """
        ${text}
        """
        
        Return a JSON object with potential chart data:
        {
          "charts": [
            {
              "title": "Chart title",
              "type": "bar|line|pie|scatter",
              "data": {
                "labels": ["label1", "label2"],
                "datasets": [
                  {
                    "label": "Dataset name",
                    "data": [value1, value2]
                  }
                ]
              },
              "context": "surrounding text that contains this data",
              "position": "approximate location in text"
            }
          ]
        }
        
        Only extract data that would make meaningful visualizations. If no suitable data is found, return an empty charts array.
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a data extraction expert. Identify numerical data in text that would benefit from visualization."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1500
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error extracting chart data:', error);
      throw new Error('Failed to extract chart data');
    }
  }

  async generateDiagramDescription(text, type = 'flowchart') {
    try {
      const prompt = `
        Create a ${type} diagram description based on this text:
        
        """
        ${text}
        """
        
        Return a mermaid.js diagram syntax that represents the concepts, processes, or relationships described in the text.
        
        For flowcharts, use: graph TD or graph LR
        For sequence diagrams, use: sequenceDiagram
        For class diagrams, use: classDiagram
        
        Make sure the diagram is clear, well-structured, and adds value to understanding the content.
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a diagram expert. Create clear, informative diagrams using mermaid.js syntax."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating diagram:', error);
      throw new Error('Failed to generate diagram description');
    }
  }
}

module.exports = new AIService();
