// GENIBI Health App - Production Deployment Script
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting GENIBI Health App Production Deployment...');

// Check if Node.js dependencies are installed
function checkDependencies() {
    console.log('📦 Checking dependencies...');
    
    if (!fs.existsSync('node_modules')) {
        console.log('📥 Installing dependencies...');
        try {
            execSync('npm install', { stdio: 'inherit' });
            console.log('✅ Dependencies installed successfully');
        } catch (error) {
            console.error('❌ Failed to install dependencies:', error.message);
            process.exit(1);
        }
    } else {
        console.log('✅ Dependencies already installed');
    }
}

// Create production environment file
function createEnvFile() {
    console.log('⚙️ Creating environment configuration...');
    
    const envContent = `# GENIBI Health App - Production Environment
NODE_ENV=production
PORT=8080

# Database Configuration (MongoDB)
MONGODB_URI=mongodb://localhost:27017/genibi-health

# JWT Secret for Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Twilio Configuration (for SMS notifications)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# OpenAI Configuration (for AI chatbot)
OPENAI_API_KEY=your-openai-api-key

# Firebase Configuration
FIREBASE_PROJECT_ID=genibi-health
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@genibi-health.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

# Security Configuration
CORS_ORIGIN=http://localhost:8080
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=logs/genibi-health.log
`;

    if (!fs.existsSync('.env')) {
        fs.writeFileSync('.env', envContent);
        console.log('✅ Environment file created (.env)');
        console.log('⚠️  Please update the .env file with your actual configuration values');
    } else {
        console.log('✅ Environment file already exists');
    }
}

// Create logs directory
function createLogsDirectory() {
    console.log('📁 Creating logs directory...');
    
    if (!fs.existsSync('logs')) {
        fs.mkdirSync('logs');
        console.log('✅ Logs directory created');
    } else {
        console.log('✅ Logs directory already exists');
    }
}

// Create production start script
function createStartScript() {
    console.log('📝 Creating production start script...');
    
    const startScript = `@echo off
echo 🚀 Starting GENIBI Health App Production Server...
echo.
echo 🔧 Environment: Production
echo 🌐 Port: 8080
echo 📱 Real-time features: Enabled
echo 🔒 Security: Active
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Start the server
echo ⚡ Starting server...
node server.js

pause
`;

    fs.writeFileSync('start-production.bat', startScript);
    console.log('✅ Production start script created (start-production.bat)');
}

// Create PM2 ecosystem file for production deployment
function createPM2Config() {
    console.log('⚙️ Creating PM2 configuration...');
    
    const pm2Config = {
        apps: [{
            name: 'genibi-health-app',
            script: 'server.js',
            instances: 'max',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'development',
                PORT: 8080
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 8080
            },
            error_file: './logs/err.log',
            out_file: './logs/out.log',
            log_file: './logs/combined.log',
            time: true,
            watch: false,
            max_memory_restart: '1G',
            node_args: '--max-old-space-size=1024'
        }]
    };

    fs.writeFileSync('ecosystem.config.js', `module.exports = ${JSON.stringify(pm2Config, null, 2)};`);
    console.log('✅ PM2 configuration created (ecosystem.config.js)');
}

// Create Docker configuration
function createDockerConfig() {
    console.log('🐳 Creating Docker configuration...');
    
    const dockerfile = `# GENIBI Health App - Production Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node -e "require('http').get('http://localhost:8080/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start application
CMD ["node", "server.js"]
`;

    const dockerCompose = `version: '3.8'

services:
  genibi-app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - PORT=8080
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    depends_on:
      - mongodb
      - redis

  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  mongodb_data:
  redis_data:
`;

    fs.writeFileSync('Dockerfile', dockerfile);
    fs.writeFileSync('docker-compose.yml', dockerCompose);
    console.log('✅ Docker configuration created');
}

// Create deployment README
function createDeploymentReadme() {
    console.log('📚 Creating deployment documentation...');
    
    const readme = `# GENIBI Health App - Production Deployment Guide

## 🚀 Quick Start

### Option 1: Simple Node.js Deployment
1. Run \`start-production.bat\` (Windows) or \`npm start\` (Cross-platform)
2. Open http://localhost:8080 in your browser

### Option 2: PM2 Process Manager (Recommended for Production)
\`\`\`bash
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
\`\`\`

### Option 3: Docker Deployment
\`\`\`bash
docker-compose up -d
\`\`\`

## 🔧 Configuration

1. **Environment Variables**: Update \`.env\` file with your configuration
2. **Database**: Configure MongoDB connection string
3. **External Services**: Set up Firebase, OpenAI, Twilio credentials
4. **Security**: Update JWT secret and CORS settings

## 📊 Monitoring

- **Health Check**: GET /api/health
- **Logs**: Check \`logs/\` directory
- **PM2 Monitoring**: \`pm2 monit\`

## 🔒 Security Features

- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- JWT authentication

## 📱 Real-time Features

- WebSocket connections via Socket.IO
- Live health data updates
- Real-time chat
- Push notifications
- Emergency alerts

## 🏥 API Endpoints

- \`POST /api/auth/register\` - User registration
- \`POST /api/auth/login\` - User login
- \`GET /api/vitals/:userId\` - Get vital signs
- \`POST /api/vitals\` - Save vital signs
- \`GET /api/medications/:userId\` - Get medications
- \`POST /api/medications\` - Add medication
- \`GET /api/appointments/:userId\` - Get appointments
- \`POST /api/appointments\` - Schedule appointment
- \`GET /api/moods/:userId\` - Get mood entries
- \`POST /api/moods\` - Log mood
- \`POST /api/chat\` - Send chat message
- \`POST /api/emergency\` - Trigger emergency alert

## 🌐 Production Checklist

- [ ] Update environment variables
- [ ] Configure database
- [ ] Set up SSL/HTTPS
- [ ] Configure domain name
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test emergency features
- [ ] Load testing
- [ ] Security audit

## 📞 Support

For technical support, contact the GENIBI development team.
Emergency helpline: +234 806 027 0792
`;

    fs.writeFileSync('DEPLOYMENT.md', readme);
    console.log('✅ Deployment documentation created (DEPLOYMENT.md)');
}

// Main deployment function
function deploy() {
    try {
        console.log('🏥 GENIBI Health App - Production Deployment');
        console.log('==========================================');
        
        checkDependencies();
        createEnvFile();
        createLogsDirectory();
        createStartScript();
        createPM2Config();
        createDockerConfig();
        createDeploymentReadme();
        
        console.log('');
        console.log('🎉 Deployment preparation completed successfully!');
        console.log('');
        console.log('📋 Next Steps:');
        console.log('1. Update .env file with your configuration');
        console.log('2. Run start-production.bat to start the server');
        console.log('3. Open http://localhost:8080 in your browser');
        console.log('4. Test all features including real-time functionality');
        console.log('');
        console.log('🔗 Production Server: http://localhost:8080');
        console.log('📊 Health Check: http://localhost:8080/api/health');
        console.log('📱 Real-time Features: Enabled');
        console.log('🔒 Security: Active');
        console.log('');
        console.log('🏥 GENIBI Health App is ready for production! 🇳🇬');
        
    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        process.exit(1);
    }
}

// Run deployment
deploy();
