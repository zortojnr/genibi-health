const fs = require('fs');
const path = require('path');

// Create a simple SVG that can be converted to PNG
const createSVG = (size, text, bgColor = '#4A90E2', textColor = '#FFFFFF') => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${bgColor}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size/8}" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="${textColor}">
    ${text}
  </text>
</svg>`;
};

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}

// Create icon SVG (will need to be converted to PNG manually)
const iconSVG = createSVG(1024, 'GENIBI');
fs.writeFileSync(path.join(assetsDir, 'icon.svg'), iconSVG);

// Create splash SVG
const splashSVG = createSVG(1024, 'GENIBI\nMental Fitness');
fs.writeFileSync(path.join(assetsDir, 'splash.svg'), splashSVG);

// Create adaptive icon SVG
const adaptiveIconSVG = createSVG(1024, 'G');
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.svg'), adaptiveIconSVG);

console.log('✅ SVG assets created successfully!');
console.log('📝 Next steps:');
console.log('1. Convert SVG files to PNG using an online converter');
console.log('2. Or use: npx expo install expo-image-utils');
console.log('3. Then run: npx expo install --fix');
