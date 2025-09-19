# Papyrus AI API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, no authentication is required. In production, implement API keys or OAuth.

---

## Content Enhancement API

### Analyze Content
Analyze text content and get AI-powered suggestions for improvements.

**Endpoint:** `POST /content/analyze`

**Request Body:**
```json
{
  "text": "Your document content here...",
  "format": "plain|markdown|html"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "suggestions": [
      {
        "type": "heading",
        "position": "line 1",
        "current": "Introduction",
        "suggested": "# Introduction",
        "level": 1,
        "reasoning": "This appears to be a main section title"
      }
    ],
    "overall_structure": {
      "title": "Suggested Document Title",
      "sections": ["Introduction", "Methods", "Results"],
      "estimated_pages": 3,
      "document_type": "report"
    },
    "typography": {
      "font_suggestions": ["Arial", "Georgia"],
      "style_recommendations": ["professional", "clean"]
    }
  }
}
```

### Enhance Content
Apply AI suggestions to improve content formatting.

**Endpoint:** `POST /content/enhance`

**Request Body:**
```json
{
  "text": "Original text content",
  "suggestions": [...], // Array of suggestions from analyze endpoint
  "format": "plain|markdown|html"
}
```

**Response:**
```json
{
  "success": true,
  "enhanced_content": "# Enhanced Document\n\nFormatted content with improvements...",
  "original_length": 1500,
  "enhanced_length": 1800
}
```

---

## PDF Generation API

### Generate PDF
Create a PDF document from enhanced content.

**Endpoint:** `POST /pdf/generate`

**Request Body:**
```json
{
  "content": "Markdown formatted content",
  "template": "default|modern|classic|minimal",
  "options": {
    "title": "Document Title",
    "author": "Author Name",
    "styles": {
      "fontFamily": "Arial",
      "fontSize": "12pt",
      "primaryColor": "#333333",
      "accentColor": "#2563eb"
    },
    "pdfOptions": {
      "format": "A4",
      "margin": {
        "top": "20mm",
        "right": "15mm",
        "bottom": "20mm",
        "left": "15mm"
      }
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "pdf": {
    "filename": "document_uuid.pdf",
    "path": "/path/to/file.pdf",
    "url": "/generated/document_uuid.pdf",
    "size": 2048576
  },
  "generation_time": "2023-12-01T12:00:00Z"
}
```

### Get Templates
Retrieve available PDF templates.

**Endpoint:** `GET /pdf/templates`

**Response:**
```json
{
  "success": true,
  "templates": [
    {
      "id": "default",
      "name": "Default",
      "description": "Clean, professional layout"
    },
    {
      "id": "modern",
      "name": "Modern",
      "description": "Contemporary design with bold typography"
    }
  ]
}
```

### Preview PDF
Generate HTML preview of the PDF content.

**Endpoint:** `POST /pdf/preview`

**Request Body:**
```json
{
  "content": "Markdown content",
  "template": "default",
  "options": {}
}
```

**Response:** Returns HTML content for preview

---

## File Upload API

### Upload Document
Upload and extract text from various document formats.

**Endpoint:** `POST /upload/document`

**Request:** Multipart form data with `document` field

**Supported Formats:**
- `.txt` - Plain text
- `.md` - Markdown
- `.docx` - Microsoft Word
- `.html/.htm` - HTML files

**Response:**
```json
{
  "success": true,
  "upload_id": "uuid",
  "extracted_text": "Extracted content...",
  "metadata": {
    "originalName": "document.docx",
    "size": 15360,
    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "format": "docx",
    "uploadTime": "2023-12-01T12:00:00Z"
  },
  "statistics": {
    "character_count": 1500,
    "word_count": 250,
    "line_count": 45
  }
}
```

---

## Charts API

### Generate Chart
Create chart images from data.

**Endpoint:** `POST /charts/generate`

**Request Body:**
```json
{
  "data": {
    "labels": ["Q1", "Q2", "Q3", "Q4"],
    "datasets": [
      {
        "label": "Sales",
        "data": [120000, 150000, 180000, 200000]
      }
    ]
  },
  "type": "bar|line|pie|doughnut|scatter",
  "options": {
    "title": "Quarterly Sales",
    "chartOptions": {}
  }
}
```

**Response:**
```json
{
  "success": true,
  "chart": {
    "filename": "chart_uuid.png",
    "url": "/generated/charts/chart_uuid.png",
    "width": 800,
    "height": 600
  }
}
```

### Generate Diagram
Create diagrams from text descriptions.

**Endpoint:** `POST /charts/diagram`

**Request Body:**
```json
{
  "description": "Process flow for user registration",
  "type": "flowchart|sequence|class|state"
}
```

**Response:**
```json
{
  "success": true,
  "diagram": {
    "filename": "diagram_uuid.html",
    "url": "/generated/charts/diagram_uuid.html",
    "type": "diagram"
  },
  "mermaid_code": "graph TD\n  A[Start] --> B[Process]\n  B --> C[End]"
}
```

### Extract Chart Data
Analyze text and extract data suitable for visualization.

**Endpoint:** `POST /charts/extract-data`

**Request Body:**
```json
{
  "text": "Sales data: Q1: 100k, Q2: 120k, Q3: 140k, Q4: 160k"
}
```

**Response:**
```json
{
  "success": true,
  "extracted_data": {
    "simple_extraction": {
      "keyValue": [
        {"label": "Q1", "value": 100000},
        {"label": "Q2", "value": 120000}
      ]
    },
    "ai_extraction": {
      "charts": [
        {
          "title": "Quarterly Sales",
          "type": "bar",
          "data": {...}
        }
      ]
    },
    "suggested_charts": [...]
  }
}
```

---

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "error": "Error message",
  "message": "Detailed error description",
  "details": [] // Validation errors if applicable
}
```

**Common HTTP Status Codes:**
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error
- `413` - Request Entity Too Large (file too big)
- `415` - Unsupported Media Type

---

## Rate Limiting

API requests are limited to:
- 100 requests per 15 minutes per IP
- File uploads limited to 10MB per file

Headers included in responses:
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Time when limit resets

---

## Examples

### Complete Workflow Example

```javascript
// 1. Analyze content
const analysisResponse = await fetch('/api/content/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'My document content...',
    format: 'plain'
  })
});

const analysis = await analysisResponse.json();

// 2. Enhance content
const enhanceResponse = await fetch('/api/content/enhance', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'My document content...',
    suggestions: analysis.analysis.suggestions,
    format: 'plain'
  })
});

const enhanced = await enhanceResponse.json();

// 3. Generate PDF
const pdfResponse = await fetch('/api/pdf/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: enhanced.enhanced_content,
    template: 'default',
    options: {
      title: 'My Document',
      author: 'John Doe'
    }
  })
});

const pdf = await pdfResponse.json();

// 4. Download PDF
window.open(pdf.pdf.url, '_blank');
```
