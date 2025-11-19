#!/bin/bash

echo "🚀 Setting up Container Solutions Pro Business Platform..."

# Create business structure
mkdir -p business/{templates,configs,clients,deliverables,static/{css,js}}
mkdir -p assets/{logos,styles,scripts}

# Copy essential assets
cp static/css/prism.css business/static/css/
cp static/js/prism.js business/static/js/

echo "✅ Business structure created:"
echo "📁 business/"
echo "   ├── templates/     # Client templates"
echo "   ├── configs/      # Business configuration" 
echo "   ├── clients/      # Client portal"
echo "   ├── deliverables/ # Client deliveries"
echo "   └── static/       # CSS/JS assets"
echo ""
echo "🎯 Next steps:"
echo "   1. Access client portal: http://localhost:8102/business/clients/client-portal.html"
echo "   2. Customize business settings in business/configs/business-setup.js"
echo "   3. Add your company branding"
echo "   4. Start client engagements!"
echo ""
echo "💼 Your business is ready to generate revenue!"
