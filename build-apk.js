#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('📱 GENIBI Mental Fitness - APK Builder');
console.log('=====================================\n');

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

async function buildAPK() {
  try {
    log('🔧 Step 1: Installing EAS CLI...', 'blue');
    try {
      execSync('eas --version', { stdio: 'ignore' });
      log('✅ EAS CLI already installed', 'green');
    } catch {
      log('Installing EAS CLI globally...', 'yellow');
      execSync('npm install -g eas-cli', { stdio: 'inherit' });
    }

    log('\n🔑 Step 2: Login to Expo account...', 'blue');
    log('You will need to create an Expo account if you don\'t have one', 'yellow');
    log('Visit: https://expo.dev/signup', 'yellow');
    
    try {
      execSync('eas whoami', { stdio: 'ignore' });
      log('✅ Already logged in to Expo', 'green');
    } catch {
      log('Please login to your Expo account:', 'yellow');
      execSync('eas login', { stdio: 'inherit' });
    }

    log('\n🏗️  Step 3: Building APK...', 'blue');
    log('This will build a production APK for Android', 'yellow');
    log('Build will happen in the cloud (may take 10-15 minutes)', 'yellow');
    
    execSync('eas build --platform android --profile production', { stdio: 'inherit' });

    log('\n🎉 APK Build Complete!', 'green');
    log('Your APK will be available for download from the Expo dashboard', 'green');
    log('Visit: https://expo.dev/accounts/[your-username]/projects/genibi-mental-fitness/builds', 'blue');

  } catch (error) {
    log('\n❌ Build failed:', 'red');
    log(error.message, 'red');
    
    log('\n🔧 Manual build steps:', 'yellow');
    log('1. Install EAS CLI: npm install -g eas-cli', 'reset');
    log('2. Login to Expo: eas login', 'reset');
    log('3. Build APK: eas build --platform android --profile production', 'reset');
    log('4. Download from: https://expo.dev', 'reset');
  }
}

// Start the build process
buildAPK();
