import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Download,
  ArrowLeft,
  Eye,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

const EditorPage: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content first');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Content analyzed! AI suggestions ready.');
    } catch (error) {
      toast.error('Failed to analyze content');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content first');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success('PDF generated successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <FileText className="w-6 h-6 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">Papyrus AI Editor</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="btn-secondary flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button className="btn-secondary flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Document Editor</h2>
                  <div className="flex items-center space-x-2">
                    <label className="btn-secondary cursor-pointer flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>Upload File</span>
                      <input type="file" className="hidden" accept=".txt,.md,.docx,.html" />
                    </label>
                  </div>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your content here or upload a file... 

For example:
# My Document Title

This is a sample document that demonstrates the Papyrus AI capabilities.

## Key Features
- AI-powered content analysis
- Automatic chart generation from data
- Professional formatting and typography
- Support for multiple file formats

## Sample Data
Here's some data that could be turned into a chart:
Sales Q1: 120000
Sales Q2: 150000
Sales Q3: 180000
Sales Q4: 200000

The system will automatically detect this data and suggest creating a visualization."
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {content.length} characters • {content.split(/\s+/).filter(word => word.length > 0).length} words
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !content.trim()}
                    className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-primary-600 rounded-full animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>{isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}</span>
                  </button>
                  <button
                    onClick={handleGeneratePDF}
                    disabled={isGenerating || !content.trim()}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>{isGenerating ? 'Generating...' : 'Generate PDF'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* AI Suggestions Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-primary-600" />
                AI Suggestions
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm font-medium text-blue-800 mb-1">Structure Improvement</div>
                  <div className="text-sm text-blue-600">Consider adding a table of contents and section headers</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm font-medium text-green-800 mb-1">Chart Opportunity</div>
                  <div className="text-sm text-green-600">Sales data detected - create a bar chart?</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-sm font-medium text-purple-800 mb-1">Typography</div>
                  <div className="text-sm text-purple-600">Recommended: Professional theme with serif headings</div>
                </div>
              </div>
            </motion.div>

            {/* Document Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
                  <select className="w-full input-field">
                    <option>Professional</option>
                    <option>Modern</option>
                    <option>Classic</option>
                    <option>Minimal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font</label>
                  <select className="w-full input-field">
                    <option>Arial</option>
                    <option>Georgia</option>
                    <option>Times New Roman</option>
                    <option>Helvetica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                  <select className="w-full input-field">
                    <option>11pt</option>
                    <option>12pt</option>
                    <option>14pt</option>
                    <option>16pt</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg text-sm">
                  📊 Generate Chart from Data
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg text-sm">
                  📋 Create Table of Contents
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg text-sm">
                  🎨 Apply Style Theme
                </button>
                <button className="w-full text-left p-2 hover:bg-gray-50 rounded-lg text-sm">
                  🔤 Fix Typography
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
