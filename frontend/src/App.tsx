import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

const HomePage = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Papyrus AI
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Transform your text into beautiful PDFs with AI-powered content enhancement, 
          intelligent formatting, charts, diagrams, and professional typography.
        </p>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="font-semibold mb-2">AI Enhancement</h3>
              <p className="text-gray-600">Intelligent content analysis and suggestions</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-semibold mb-2">Smart Charts</h3>
              <p className="text-gray-600">Automatic data visualization</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="font-semibold mb-2">PDF Generation</h3>
              <p className="text-gray-600">Professional document formatting</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="font-semibold mb-2">Beautiful Design</h3>
              <p className="text-gray-600">Modern typography and layouts</p>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Made with ❤️ by{' '}
            <a 
              href="https://hexadigitall.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Hexadigitall
            </a>
          </p>
          <p className="text-gray-500 text-sm">
            Your All-in-One Digital Partner - Transform your business ideas into reality
          </p>
        </div>
      </div>
    </div>
  </div>
);

const EditorPage = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Document Editor</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <textarea 
          className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your text here to convert to PDF with AI enhancements..."
        ></textarea>
        <div className="mt-4 flex justify-end space-x-4">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg">
            Analyze with AI
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg">
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/editor" element={<EditorPage />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
