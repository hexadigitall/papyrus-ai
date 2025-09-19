# Papyrus AI 🚀

An AI-powered application that transforms markup text and documents into beautifully formatted PDFs with intelligent content enhancement, automatic chart generation, and professional typography.

![Papyrus AI Logo](assets/logos/papyrus-ai-logo.svg)

## Features

- **Intelligent Content Analysis**: AI analyzes your text and suggests enhancements
- **Automatic Formatting**: Converts plain text to proper headings, bullet points, and structured content
- **Chart & Diagram Generation**: Automatically creates charts and diagrams from data in your text
- **Table Enhancement**: Converts data into well-formatted tables
- **Image Integration**: Smart placement of relevant images and graphics
- **Multiple Input Formats**: Supports Markdown, plain text, Word documents, and more
- **Real-time Preview**: See changes as you make them
- **Professional Typography**: Multiple font options and styling choices

## Technology Stack

### Backend
- **Node.js** with Express.js
- **Puppeteer** for PDF generation
- **Chart.js** & **D3.js** for data visualization
- **OpenAI API** for content analysis and enhancement
- **Multer** for file uploads
- **Sharp** for image processing

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Query** for state management
- **React Dropzone** for file uploads
- **Monaco Editor** for text editing
- **Framer Motion** for animations

### Additional Tools
- **Mammoth.js** for Word document parsing
- **Marked** for Markdown parsing
- **Tesseract.js** for OCR capabilities
- **Mermaid** for diagram generation

## Quick Start

1. **Install dependencies**:
   ```bash
   npm run install:all
   ```

2. **Set up environment variables**:
   ```bash
   cp backend/.env.example backend/.env
   # Add your OpenAI API key and other configuration
   ```

3. **Start development servers**:
   ```bash
   npm run dev
   ```

4. **Open your browser**: Navigate to `http://localhost:3000`

## Project Structure

```
papyrus-ai/
├── backend/                 # Node.js API server
│   ├── controllers/        # API controllers
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   ├── templates/         # PDF templates
│   └── uploads/           # File upload directory
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript definitions
├── shared/                # Shared types and utilities
├── docs/                  # Documentation
├── assets/                # Logos and assets
│   └── logos/            # Brand logos and favicons
└── README.md              # This file
```

## API Documentation

### Content Enhancement
- `POST /api/content/analyze` - Analyze text and suggest enhancements
- `POST /api/content/enhance` - Apply AI-powered content enhancements

### PDF Generation
- `POST /api/pdf/generate` - Generate PDF from enhanced content
- `GET /api/pdf/templates` - Get available PDF templates

### File Processing
- `POST /api/upload/document` - Upload and process documents
- `POST /api/charts/extract-data` - Extract text from various formats

## Configuration

Create a `.env` file in the backend directory:

```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=development
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

## Documentation

- [API Documentation](docs/API_DOCUMENTATION.md)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [Contributing Guidelines](CONTRIBUTING.md)

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Transform your text into beautiful PDFs with the power of AI** ✨

Built with ❤️ by Hexadigitall - Your All-in-One Digital Partner

## About the Developer

This project is proudly developed by **[Hexadigitall](https://hexadigitall.com)** - Nigeria's premier all-in-one digital partner.

From idea to impact, Hexadigitall transforms concepts into market-ready realities with:
- Strategic business planning
- Custom software development  
- Data-driven digital marketing
- Dedicated mentorship & consulting

**Ready to transform your business idea?** Visit [hexadigitall.com](https://hexadigitall.com) to get started.
