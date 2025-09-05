#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 GENIBI Health App Deployment Script');
console.log('=====================================\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description}`, 'red');
    return false;
  }
}

function createDeploymentPackage() {
  log('\n📦 Creating deployment package...', 'blue');
  
  const deployDir = 'genibi-health-app-deploy';
  
  // Create deployment directory
  if (fs.existsSync(deployDir)) {
    log('Removing existing deployment directory...', 'yellow');
    fs.rmSync(deployDir, { recursive: true, force: true });
  }
  
  fs.mkdirSync(deployDir);
  log(`Created deployment directory: ${deployDir}`, 'green');
  
  // Copy health-app files
  const healthAppDir = 'health-app';
  if (fs.existsSync(healthAppDir)) {
    copyDirectory(healthAppDir, path.join(deployDir, 'health-app'));
    log('Copied health-app files', 'green');
  } else {
    log('health-app directory not found!', 'red');
    return false;
  }
  
  // Copy backend files (optional)
  const backendDir = 'backend';
  if (fs.existsSync(backendDir)) {
    copyDirectory(backendDir, path.join(deployDir, 'backend'));
    log('Copied backend files', 'green');
  } else {
    log('Backend directory not found - frontend-only deployment', 'yellow');
  }
  
  // Create deployment README
  createDeploymentReadme(deployDir);
  
  // Create simple server script
  createServerScript(deployDir);
  
  log(`\n✅ Deployment package created in: ${deployDir}`, 'green');
  return true;
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const items = fs.readdirSync(src);
  
  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    // Skip node_modules and other unnecessary files
    if (item === 'node_modules' || item === '.git' || item.startsWith('.')) {
      continue;
    }
    
    const stat = fs.statSync(srcPath);
    
    if (stat.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function createDeploymentReadme(deployDir) {
  const readmeContent = `# Genibi Health App - Deployment Package

## Quick Start

### Option 1: Simple HTTP Server (Recommended for testing)
\`\`\`bash
# Using Python (if installed)
cd health-app
python -m http.server 8080

# Using Node.js (if installed)
npx serve health-app -p 8080

# Using PHP (if installed)
cd health-app
php -S localhost:8080
\`\`\`

Then open: http://localhost:8080

### Option 2: Using the included server script
\`\`\`bash
node server.js
\`\`\`

Then open: http://localhost:3000

## Features

✅ **AI-Powered Mental Health Assistant** - Intelligent chatbot with demo responses
✅ **Mood Tracking** - Log and track daily mood with visual feedback
✅ **Vital Signs Monitoring** - Record heart rate, blood pressure, temperature
✅ **Appointment Management** - Book and manage healthcare appointments
✅ **Health Records** - Digital health record keeping
✅ **Emergency Support** - 24/7 helpline integration (+234 806 027 0792)
✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Demo Mode** - Fully functional without backend setup

## Demo Mode

The app runs in demo mode by default, which means:
- All features are functional for demonstration
- Data is stored locally in the browser
- AI responses are simulated (realistic but not connected to OpenAI)
- Perfect for testing and showcasing the application

## Backend Setup (Optional)

If you want full functionality with real AI responses and persistent data:

1. Set up the backend server (see backend/README.md)
2. Configure environment variables
3. Update API_BASE_URL in health-app/js/api.js

## Deployment Options

### Static Hosting (Netlify, Vercel, GitHub Pages)
1. Upload the \`health-app\` folder to your hosting service
2. Set the root directory to \`health-app\`
3. Deploy!

### VPS/Server Deployment
1. Upload files to your server
2. Use Nginx or Apache to serve the \`health-app\` directory
3. Optionally set up the backend for full functionality

## Support

- **Emergency**: +234 806 027 0792
- **Technical Support**: Create an issue on GitHub
- **Documentation**: See ENHANCED_README.md for detailed setup

---

**Genibi NT Healthcare Plus** - Empowering Nigerian students with comprehensive mental health and wellness support. 🇳🇬💚
`;

  fs.writeFileSync(path.join(deployDir, 'README.md'), readmeContent);
  log('Created deployment README', 'green');
}

function createServerScript(deployDir) {
  const serverScript = `const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from health-app directory
app.use(express.static(path.join(__dirname, 'health-app')));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'health-app', 'index.html'));
});

app.listen(PORT, () => {
  console.log(\`🚀 Genibi Health App running at http://localhost:\${PORT}\`);
  console.log(\`📱 Open the URL in your browser to access the app\`);
  console.log(\`🛑 Press Ctrl+C to stop the server\`);
});
`;

  fs.writeFileSync(path.join(deployDir, 'server.js'), serverScript);
  
  // Create package.json for the server
  const packageJson = {
    "name": "genibi-health-app-deploy",
    "version": "1.0.0",
    "description": "Genibi Health App Deployment Package",
    "main": "server.js",
    "scripts": {
      "start": "node server.js",
      "dev": "node server.js"
    },
    "dependencies": {
      "express": "^4.18.2"
    }
  };
  
  fs.writeFileSync(path.join(deployDir, 'package.json'), JSON.stringify(packageJson, null, 2));
  log('Created server script and package.json', 'green');
}

function validateHealthApp() {
  log('\n🔍 Validating health app files...', 'blue');
  
  const requiredFiles = [
    { path: 'health-app/index.html', desc: 'Main HTML file' },
    { path: 'health-app/app.js', desc: 'Main JavaScript file' },
    { path: 'health-app/auth.js', desc: 'Authentication JavaScript' },
    { path: 'health-app/styles.css', desc: 'Main CSS file' },
    { path: 'health-app/js/api.js', desc: 'API service file' }
  ];
  
  let allValid = true;
  
  for (const file of requiredFiles) {
    if (!checkFile(file.path, file.desc)) {
      allValid = false;
    }
  }
  
  return allValid;
}

function showDeploymentInstructions(deployDir) {
  log('\n🎯 Deployment Instructions:', 'cyan');
  log('========================', 'cyan');
  
  log('\n1. Quick Test (Recommended):', 'blue');
  log(`   cd ${deployDir}/health-app`);
  log('   python -m http.server 8080');
  log('   Open: http://localhost:8080');
  
  log('\n2. Using Node.js server:', 'blue');
  log(`   cd ${deployDir}`);
  log('   npm install');
  log('   npm start');
  log('   Open: http://localhost:3000');
  
  log('\n3. Deploy to hosting service:', 'blue');
  log(`   - Upload the '${deployDir}/health-app' folder to Netlify, Vercel, or GitHub Pages`);
  log('   - Set the root directory to the uploaded folder');
  log('   - Your app will be live!');
  
  log('\n4. Share with others:', 'blue');
  log(`   - Zip the '${deployDir}' folder`);
  log('   - Send to anyone for testing');
  log('   - They can run it locally or deploy it');
  
  log('\n✨ The app runs in demo mode by default - all features work!', 'green');
  log('📞 Emergency support: +234 806 027 0792', 'yellow');
}

// Main execution
function main() {
  try {
    // Validate health app files
    if (!validateHealthApp()) {
      log('\n❌ Health app validation failed. Please check the required files.', 'red');
      process.exit(1);
    }
    
    // Create deployment package
    if (!createDeploymentPackage()) {
      log('\n❌ Failed to create deployment package.', 'red');
      process.exit(1);
    }
    
    // Show instructions
    showDeploymentInstructions('genibi-health-app-deploy');
    
    log('\n🎉 Deployment package ready! Your Genibi Health App is ready to share.', 'green');
    
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the script
main();
