import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Sparkles, 
  BarChart, 
  Image, 
  Download,
  Upload,
  Zap,
  Star
} from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI Content Enhancement',
      description: 'Automatically improve structure, formatting, and readability of your text'
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: 'Smart Charts & Graphs',
      description: 'Generate visualizations from your data automatically'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Multiple Formats',
      description: 'Support for Markdown, Word, plain text, and HTML files'
    },
    {
      icon: <Image className="w-6 h-6" />,
      title: 'Professional Layout',
      description: 'Beautiful typography and formatting for professional documents'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Documents Generated' },
    { number: '95%', label: 'User Satisfaction' },
    { number: '50%', label: 'Time Saved' },
    { number: '24/7', label: 'Available' }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">Papyrus AI</span>
            </div>
            <button
              onClick={() => navigate('/editor')}
              className="btn-primary flex items-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>Get Started</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Transform Text into
              <span className="text-gradient block">Beautiful PDFs</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              AI-powered document generation that automatically enhances your content with 
              intelligent formatting, charts, diagrams, and professional typography.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => navigate('/editor')}
                className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
              >
                <Upload className="w-5 h-5" />
                <span>Upload & Convert</span>
              </button>
              <button className="btn-secondary text-lg px-8 py-3">
                View Examples
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create professional documents with AI assistance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card text-center hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-primary-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to create amazing documents
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Upload or Paste Text',
                description: 'Upload documents or paste your content directly into the editor'
              },
              {
                step: '2',
                title: 'AI Analysis & Enhancement',
                description: 'Our AI analyzes your content and suggests improvements automatically'
              },
              {
                step: '3',
                title: 'Generate Beautiful PDF',
                description: 'Get a professionally formatted PDF with charts, diagrams, and perfect typography'
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Create Amazing Documents?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of users who trust Papyrus AI for their document needs
          </p>
          <button
            onClick={() => navigate('/editor')}
            className="bg-white text-primary-600 hover:bg-gray-100 font-semibold text-lg px-8 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 mx-auto"
          >
            <Download className="w-5 h-5" />
            <span>Start Creating Now</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FileText className="w-6 h-6" />
              <span className="text-xl font-bold">Papyrus AI</span>
            </div>
            <p className="text-gray-400 mb-4">
              Transform your text into beautiful, professional PDFs with AI assistance
            </p>
            <div className="flex justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
              <span className="ml-2 text-gray-400">Rated 5/5 by our users</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FileText className="w-6 h-6" />
              <span className="text-xl font-bold">Papyrus AI</span>
            </div>
            <p className="text-gray-400 mb-4">
              Transform your text into beautiful, professional PDFs with AI assistance
            </p>
            <div className="flex justify-center space-x-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
              <span className="ml-2 text-gray-400">Rated 5/5 by our users</span>
            </div>
            <div className="border-t border-gray-700 pt-6">
              <p className="text-gray-400 mb-2">
                Made with ❤️ by{' '}
                <a 
                  href="https://hexadigitall.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary-400 hover:text-primary-300 font-semibold"
                >
                  Hexadigitall
                </a>
              </p>
              <p className="text-gray-500 text-sm">
                Your All-in-One Digital Partner -{' '}
                <a 
                  href="https://hexadigitall.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary-400 hover:text-primary-300"
                >
                  hexadigitall.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
