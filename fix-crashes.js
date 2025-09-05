#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 GENIBI Mental Fitness - Crash Prevention Script');
console.log('==================================================\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkAndFix() {
  log('🔍 Checking for potential crash issues...', 'blue');
  
  let issuesFound = 0;
  let issuesFixed = 0;

  // Check 1: Verify all required files exist
  const requiredFiles = [
    'package.json',
    'App.tsx',
    'babel.config.js',
    'metro.config.js',
    'index.js',
    'src/services/firebase.ts',
    'src/services/openai.ts',
    'src/context/AuthContext.tsx',
    'src/theme/theme.ts',
    'backend/.env',
    'backend/package.json'
  ];

  log('\n📁 Checking required files...', 'blue');
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      log(`✅ ${file}`, 'green');
    } else {
      log(`❌ Missing: ${file}`, 'red');
      issuesFound++;
    }
  });

  // Check 2: Verify environment variables
  log('\n🔑 Checking environment configuration...', 'blue');
  if (fs.existsSync('backend/.env')) {
    const envContent = fs.readFileSync('backend/.env', 'utf8');
    
    // Check for syntax errors in .env
    const lines = envContent.split('\n');
    lines.forEach((line, index) => {
      if (line.trim() && !line.startsWith('#')) {
        if (line.includes(',') && !line.includes('"')) {
          log(`⚠️  Line ${index + 1}: Possible syntax error - unexpected comma`, 'yellow');
          issuesFound++;
        }
        if (line.includes('= ') && !line.includes('"')) {
          log(`⚠️  Line ${index + 1}: Space after = might cause issues`, 'yellow');
          issuesFound++;
        }
      }
    });

    // Check for required variables
    const requiredVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY', 'OPENAI_API_KEY'];
    requiredVars.forEach(varName => {
      if (envContent.includes(`${varName}=`) && !envContent.includes(`${varName}=your_`)) {
        log(`✅ ${varName} configured`, 'green');
      } else {
        log(`⚠️  ${varName} needs configuration`, 'yellow');
        issuesFound++;
      }
    });
  }

  // Check 3: Package.json dependencies
  log('\n📦 Checking package.json...', 'blue');
  if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Check for version conflicts
    const dependencies = packageJson.dependencies || {};
    if (dependencies.expo && dependencies.expo.startsWith('^53')) {
      log('⚠️  Expo version might be too new, consider downgrading to ~49.0.10', 'yellow');
      issuesFound++;
    }
    
    if (dependencies['react-native'] && dependencies['react-native'].includes('^')) {
      log('⚠️  React Native version should be pinned (remove ^)', 'yellow');
      issuesFound++;
    }
  }

  // Check 4: Firebase configuration
  log('\n🔥 Checking Firebase configuration...', 'blue');
  if (fs.existsSync('src/services/firebase.ts')) {
    const firebaseContent = fs.readFileSync('src/services/firebase.ts', 'utf8');
    
    if (firebaseContent.includes('getAnalytics')) {
      log('⚠️  Analytics import detected - this can cause crashes in React Native', 'yellow');
      issuesFound++;
    }
    
    if (firebaseContent.includes('genibi-app.firebaseapp.com')) {
      log('✅ Firebase config updated with your project', 'green');
    } else {
      log('⚠️  Firebase config still has placeholder values', 'yellow');
      issuesFound++;
    }
  }

  // Summary
  log('\n📊 Summary:', 'blue');
  log(`Issues found: ${issuesFound}`, issuesFound > 0 ? 'yellow' : 'green');
  log(`Issues fixed: ${issuesFixed}`, 'green');

  if (issuesFound === 0) {
    log('\n🎉 No critical issues found! Your app should run without crashes.', 'green');
  } else {
    log('\n⚠️  Some issues detected. Check the messages above and fix them.', 'yellow');
  }

  // Recommendations
  log('\n💡 Recommendations:', 'blue');
  log('1. Run "npm install" to ensure all dependencies are installed', 'reset');
  log('2. Make sure your Firebase project is properly configured', 'reset');
  log('3. Add your OpenAI API key to backend/.env', 'reset');
  log('4. Test the app with "npm start" after fixing issues', 'reset');
  
  return issuesFound === 0;
}

// Run the check
const isHealthy = checkAndFix();
process.exit(isHealthy ? 0 : 1);
