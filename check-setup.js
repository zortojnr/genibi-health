#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 GENIBI Setup Checker');
console.log('========================\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`${colors.green}✅ ${description}${colors.reset}`);
    return true;
  } else {
    console.log(`${colors.red}❌ ${description}${colors.reset}`);
    return false;
  }
}

function checkEnvVariable(envPath, variable, description) {
  if (!fs.existsSync(envPath)) {
    console.log(`${colors.red}❌ ${description} - .env file not found${colors.reset}`);
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasVariable = envContent.includes(`${variable}=`) && 
                     !envContent.includes(`${variable}=your_`) && 
                     !envContent.includes(`${variable}=sk-your-`);
  
  if (hasVariable) {
    console.log(`${colors.green}✅ ${description}${colors.reset}`);
    return true;
  } else {
    console.log(`${colors.yellow}⚠️  ${description} - needs configuration${colors.reset}`);
    return false;
  }
}

console.log('📁 Checking Project Structure...');
checkFile('package.json', 'Mobile app package.json');
checkFile('App.tsx', 'Main app file');
checkFile('src/services/firebase.ts', 'Firebase configuration');
checkFile('backend/package.json', 'Backend package.json');
checkFile('backend/src/index.ts', 'Backend server file');
checkFile('backend/.env', 'Backend environment file');

console.log('\n🔧 Checking Dependencies...');
checkFile('node_modules', 'Mobile app dependencies installed');
checkFile('backend/node_modules', 'Backend dependencies installed');

console.log('\n🔑 Checking API Keys...');
const envPath = 'backend/.env';
checkEnvVariable(envPath, 'OPENAI_API_KEY', 'OpenAI API Key configured');
checkEnvVariable(envPath, 'FIREBASE_CLIENT_EMAIL', 'Firebase Client Email configured');
checkEnvVariable(envPath, 'FIREBASE_PRIVATE_KEY', 'Firebase Private Key configured');

console.log('\n📱 Firebase Configuration Check...');
const firebaseConfigPath = 'src/services/firebase.ts';
if (fs.existsSync(firebaseConfigPath)) {
  const firebaseContent = fs.readFileSync(firebaseConfigPath, 'utf8');
  const hasRealConfig = firebaseContent.includes('genibi-app.firebaseapp.com');
  
  if (hasRealConfig) {
    console.log(`${colors.green}✅ Firebase config updated with your project${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠️  Firebase config needs your project details${colors.reset}`);
  }
}

console.log('\n🚀 Next Steps:');
console.log(`${colors.blue}1. If you see ⚠️  warnings, check SETUP_GUIDE.md${colors.reset}`);
console.log(`${colors.blue}2. Get your Firebase service account key${colors.reset}`);
console.log(`${colors.blue}3. Get your OpenAI API key${colors.reset}`);
console.log(`${colors.blue}4. Run: cd backend && npm run dev${colors.reset}`);
console.log(`${colors.blue}5. Run: npm start (in new terminal)${colors.reset}`);

console.log(`\n${colors.green}🎯 Your GENIBI Mental Fitness app is almost ready!${colors.reset}`);
