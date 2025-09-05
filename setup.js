#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧠 GENIBI Mental Fitness Setup Script');
console.log('=====================================\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.error('❌ Node.js 18 or higher is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed:', nodeVersion);

// Function to run commands
function runCommand(command, description) {
  console.log(`\n📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

// Function to check if file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Function to create file from template
function createFromTemplate(templatePath, targetPath, replacements = {}) {
  if (fileExists(templatePath)) {
    let content = fs.readFileSync(templatePath, 'utf8');
    
    // Apply replacements
    Object.entries(replacements).forEach(([key, value]) => {
      content = content.replace(new RegExp(key, 'g'), value);
    });
    
    fs.writeFileSync(targetPath, content);
    console.log(`✅ Created ${targetPath}`);
  }
}

// Main setup process
async function setup() {
  try {
    // 1. Install mobile app dependencies
    if (fileExists('package.json')) {
      runCommand('npm install', 'Installing mobile app dependencies');
    }

    // 2. Install backend dependencies
    if (fileExists('backend/package.json')) {
      process.chdir('backend');
      runCommand('npm install', 'Installing backend dependencies');
      process.chdir('..');
    }

    // 3. Check for Expo CLI
    try {
      execSync('expo --version', { stdio: 'ignore' });
      console.log('✅ Expo CLI is installed');
    } catch (error) {
      console.log('📦 Installing Expo CLI globally...');
      runCommand('npm install -g @expo/cli', 'Installing Expo CLI');
    }

    // 4. Create environment file if it doesn't exist
    if (!fileExists('backend/.env') && fileExists('backend/.env.example')) {
      createFromTemplate('backend/.env.example', 'backend/.env');
      console.log('\n⚠️  Please update backend/.env with your actual configuration values:');
      console.log('   - OPENAI_API_KEY');
      console.log('   - FIREBASE_PROJECT_ID');
      console.log('   - FIREBASE_CLIENT_EMAIL');
      console.log('   - FIREBASE_PRIVATE_KEY');
    }

    // 5. Create assets directory if it doesn't exist
    if (!fileExists('assets')) {
      fs.mkdirSync('assets', { recursive: true });
      console.log('✅ Created assets directory');
    }

    // 6. Setup complete
    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update backend/.env with your API keys and Firebase config');
    console.log('2. Set up Firebase project and download service account key');
    console.log('3. Get OpenAI API key from https://platform.openai.com/');
    console.log('4. Run "npm start" to start the mobile app');
    console.log('5. Run "cd backend && npm run dev" to start the backend server');
    
    console.log('\n📚 Documentation:');
    console.log('- README.md for detailed setup instructions');
    console.log('- backend/.env.example for environment variable reference');
    
    console.log('\n🚀 Quick start commands:');
    console.log('  npm start          # Start mobile app');
    console.log('  npm run android    # Run on Android');
    console.log('  npm run ios        # Run on iOS');
    console.log('  cd backend && npm run dev  # Start backend server');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup
setup();
