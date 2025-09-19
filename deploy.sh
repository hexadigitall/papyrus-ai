#!/bin/bash

echo "🚀 Papyrus AI Deployment Script"
echo "================================"

# Check if user is authenticated with GitHub
if ! gh auth status > /dev/null 2>&1; then
    echo "❌ Please authenticate with GitHub first:"
    echo "   gh auth login"
    exit 1
fi

# Create GitHub repository
echo "📦 Creating GitHub repository..."
gh repo create papyrus-ai --public --description "AI-powered PDF generator with intelligent content enhancement - Made by Hexadigitall" --homepage "https://hexadigitall.com"

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git remote add origin https://github.com/$(gh api user --jq .login)/papyrus-ai.git
git push -u origin main

# Install Vercel CLI if not present
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🎉 Your Papyrus AI app is now live!"
echo ""
echo "🔗 Links:"
echo "   GitHub: https://github.com/$(gh api user --jq .login)/papyrus-ai"
echo "   Live App: (Check Vercel output above)"
echo ""
echo "🌟 Made with ❤️ by Hexadigitall"
echo "   Visit: https://hexadigitall.com"
