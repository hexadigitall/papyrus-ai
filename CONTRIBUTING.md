# Contributing to Papyrus AI

Thank you for your interest in contributing to Papyrus AI! This document provides guidelines and information for contributors.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Process](#development-process)
4. [Submitting Changes](#submitting-changes)
5. [Style Guidelines](#style-guidelines)
6. [Testing](#testing)
7. [Documentation](#documentation)

## Code of Conduct

This project adheres to a code of conduct that promotes a respectful, inclusive, and collaborative environment. Please:

- Be respectful and inclusive in all interactions
- Focus on constructive feedback and solutions
- Help create a welcoming environment for all contributors
- Report any unacceptable behavior to the project maintainers

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- Git
- OpenAI API key (for testing AI features)

### Local Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/your-username/smart-pdf-generator.git
   cd smart-pdf-generator
   ```

2. **Install dependencies:**
   ```bash
   npm run install:all
   ```

3. **Set up environment:**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   ```

4. **Start development servers:**
   ```bash
   npm run dev
   ```

### Project Structure

```
smart-pdf-generator/
├── backend/              # Node.js API server
│   ├── controllers/      # Route handlers
│   ├── services/        # Business logic
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   └── utils/           # Utility functions
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/    # API services
│   │   └── types/       # TypeScript definitions
├── docs/               # Documentation
└── shared/             # Shared utilities
```

## Development Process

### Branch Naming Convention

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Message Guidelines

Follow conventional commits format:

```
type(scope): brief description

Detailed explanation if needed

Fixes #123
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(ai): add diagram generation from text descriptions
fix(pdf): resolve template loading issue
docs(api): update authentication endpoints
```

### Development Workflow

1. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Write clean, well-documented code
   - Follow existing code style
   - Add tests for new functionality

3. **Test your changes:**
   ```bash
   # Run backend tests
   cd backend && npm test
   
   # Run frontend tests
   cd frontend && npm test
   
   # Test the full application
   npm run dev
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat(component): add new feature"
   ```

5. **Push and create PR:**
   ```bash
   git push origin feature/your-feature-name
   ```

## Submitting Changes

### Pull Request Process

1. **Ensure your PR:**
   - Has a clear title and description
   - References any related issues
   - Includes tests for new functionality
   - Updates documentation if needed
   - Passes all CI checks

2. **PR Template:**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Refactoring
   
   ## Testing
   - [ ] Unit tests pass
   - [ ] Integration tests pass
   - [ ] Manual testing completed
   
   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No breaking changes
   
   ## Related Issues
   Fixes #123
   ```

3. **Review Process:**
   - At least one maintainer review required
   - Address feedback promptly
   - Keep discussions constructive
   - Update PR based on feedback

## Style Guidelines

### Backend (Node.js)

- Use ES6+ features
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for functions
- Handle errors appropriately

**Example:**
```javascript
/**
 * Analyze text content and return AI suggestions
 * @param {string} text - Content to analyze
 * @param {string} format - Content format (plain, markdown, html)
 * @returns {Promise<Object>} Analysis results
 */
async function analyzeContent(text, format = 'plain') {
  try {
    // Implementation
  } catch (error) {
    console.error('Error analyzing content:', error);
    throw new Error('Failed to analyze content');
  }
}
```

### Frontend (React/TypeScript)

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Implement proper error boundaries
- Use meaningful component names

**Example:**
```typescript
interface DocumentEditorProps {
  initialContent?: string;
  onContentChange: (content: string) => void;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  initialContent = '',
  onContentChange
}) => {
  const [content, setContent] = useState(initialContent);
  
  const handleChange = (newContent: string) => {
    setContent(newContent);
    onContentChange(newContent);
  };
  
  return (
    <textarea
      value={content}
      onChange={(e) => handleChange(e.target.value)}
      className="w-full p-4 border rounded"
    />
  );
};
```

### CSS/Styling

- Use Tailwind CSS classes
- Create reusable components
- Follow responsive design principles
- Maintain consistent spacing

## Testing

### Backend Testing

```javascript
// Example test file: tests/services/aiService.test.js
const aiService = require('../services/aiService');

describe('AIService', () => {
  describe('analyzeContent', () => {
    it('should return analysis for valid text', async () => {
      const text = 'Sample document content';
      const result = await aiService.analyzeContent(text);
      
      expect(result).toHaveProperty('suggestions');
      expect(result.suggestions).toBeInstanceOf(Array);
    });
    
    it('should handle empty text', async () => {
      await expect(aiService.analyzeContent('')).rejects.toThrow();
    });
  });
});
```

### Frontend Testing

```typescript
// Example test file: src/components/__tests__/DocumentEditor.test.tsx
import { render, fireEvent, screen } from '@testing-library/react';
import DocumentEditor from '../DocumentEditor';

describe('DocumentEditor', () => {
  it('renders with initial content', () => {
    const initialContent = 'Test content';
    render(
      <DocumentEditor 
        initialContent={initialContent}
        onContentChange={jest.fn()}
      />
    );
    
    expect(screen.getByDisplayValue(initialContent)).toBeInTheDocument();
  });
  
  it('calls onContentChange when text changes', () => {
    const onContentChange = jest.fn();
    render(
      <DocumentEditor onContentChange={onContentChange} />
    );
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New content' } });
    
    expect(onContentChange).toHaveBeenCalledWith('New content');
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- DocumentEditor.test.tsx
```

## Documentation

### Code Documentation

- Add JSDoc comments to functions
- Include TypeScript types
- Document complex algorithms
- Add inline comments for clarity

### API Documentation

- Update API documentation for new endpoints
- Include request/response examples
- Document error responses
- Add authentication requirements

### User Documentation

- Update README for new features
- Add screenshots for UI changes
- Include setup instructions
- Document configuration options

## Issue Guidelines

### Bug Reports

Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots or error logs

### Feature Requests

Include:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach
- Any relevant mockups or examples

## Getting Help

- Check existing issues and documentation
- Ask questions in GitHub discussions
- Join our community channels
- Contact maintainers for urgent issues

## Recognition

Contributors will be:
- Listed in the project contributors
- Acknowledged in release notes
- Invited to contribute to project direction
- Recognized for significant contributions

Thank you for contributing to Papyrus AI! 🚀
