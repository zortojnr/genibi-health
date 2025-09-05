#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔧 Fixing Metro bundler compatibility issue...\n');

try {
  // Step 1: Clear npm cache
  console.log('1. Clearing npm cache...');
  execSync('npm cache clean --force', { stdio: 'inherit' });

  // Step 2: Remove node_modules and package-lock.json
  console.log('2. Removing node_modules...');
  if (fs.existsSync('node_modules')) {
    execSync('rmdir /s /q node_modules', { stdio: 'inherit', shell: true });
  }
  if (fs.existsSync('package-lock.json')) {
    fs.unlinkSync('package-lock.json');
  }

  // Step 3: Install dependencies
  console.log('3. Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Step 4: Install specific Metro version
  console.log('4. Installing compatible Metro version...');
  execSync('npm install metro@0.76.8 --save-dev', { stdio: 'inherit' });

  console.log('\n✅ Metro bundler fixed! Try running "npm start" now.');

} catch (error) {
  console.error('❌ Error fixing Metro:', error.message);
  console.log('\n🔧 Manual fix steps:');
  console.log('1. Delete node_modules folder');
  console.log('2. Delete package-lock.json');
  console.log('3. Run: npm install');
  console.log('4. Run: npm install metro@0.76.8 --save-dev');
  console.log('5. Run: npm start');
}
