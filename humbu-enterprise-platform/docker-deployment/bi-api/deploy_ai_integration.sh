#!/bin/bash

echo "🚀 DEPLOYING AI INTEGRATION TO RENDER"
echo "====================================="

# Check current files
echo "📁 Current directory:"
ls -la *.py

# Add files to git
git add ai_integration.py requirements.txt

# Check git status
echo "📊 Git status:"
git status --short

# Commit and deploy
git commit -m "FEAT: Add AI Agent integration with business context"

echo "🚀 Pushing to Render..."
git push origin master

echo "✅ AI Integration deployment initiated!"
echo "⏳ Check Render dashboard for build progress"
