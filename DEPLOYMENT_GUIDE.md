# Deployment Guide - Genibi NT Healthcare Plus

This guide provides step-by-step instructions for deploying the Genibi NT Healthcare Plus application to production environments.

## 🚀 Deployment Options

### Option 1: Cloud Deployment (Recommended)
- **Backend**: Heroku, Railway, or DigitalOcean
- **Database**: MongoDB Atlas
- **Frontend**: Netlify, Vercel, or Firebase Hosting
- **Authentication**: Firebase Auth

### Option 2: VPS Deployment
- **Server**: Ubuntu/CentOS VPS
- **Database**: Self-hosted MongoDB
- **Web Server**: Nginx
- **Process Manager**: PM2

## 🔧 Pre-deployment Setup

### 1. Environment Configuration

Create production environment files:

**Backend `.env.production`:**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/genibi-health
JWT_SECRET=your-super-secure-jwt-secret-key
OPENAI_API_KEY=your-openai-api-key
FRONTEND_URL=https://your-frontend-domain.com
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

### 2. Database Setup

**MongoDB Atlas Setup:**
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Set up database user and password
4. Configure network access (whitelist your server IPs)
5. Get connection string

**Local MongoDB (for VPS):**
```bash
# Install MongoDB on Ubuntu
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 3. Firebase Configuration

1. Go to Firebase Console
2. Create a new project or use existing
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Generate service account key
6. Download the JSON key file

## 🌐 Cloud Deployment

### Backend Deployment (Heroku)

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd backend
   heroku create genibi-backend
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-atlas-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set OPENAI_API_KEY=your-openai-key
   heroku config:set FRONTEND_URL=https://your-frontend-domain.com
   ```

5. **Deploy to Heroku**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push heroku main
   ```

### Frontend Deployment (Netlify)

1. **Build the Frontend**
   ```bash
   cd health-app
   # Update API base URL in js/api.js
   # Change API_BASE_URL to your backend URL
   ```

2. **Deploy to Netlify**
   - Go to Netlify dashboard
   - Drag and drop the `health-app` folder
   - Or connect GitHub repository for automatic deployments

### Alternative: Railway Deployment

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy**
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

## 🖥️ VPS Deployment

### 1. Server Setup (Ubuntu 20.04)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Install Nginx
sudo apt install nginx -y

# Install PM2
sudo npm install -g pm2
```

### 2. Application Setup

```bash
# Clone repository
git clone <your-repo-url>
cd genibi-mental-fitness-mobile

# Install backend dependencies
cd backend
npm install --production

# Create production environment file
cp .env.example .env.production
# Edit .env.production with your production values

# Start with PM2
pm2 start src/index.js --name "genibi-backend" --env production
pm2 save
pm2 startup
```

### 3. Nginx Configuration

Create `/etc/nginx/sites-available/genibi`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/genibi-mental-fitness-mobile/health-app;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/genibi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 🔒 Security Configuration

### 1. Firewall Setup

```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 2. MongoDB Security

```bash
# Enable authentication
sudo nano /etc/mongod.conf

# Add these lines:
security:
  authorization: enabled

# Restart MongoDB
sudo systemctl restart mongod

# Create admin user
mongo
use admin
db.createUser({
  user: "admin",
  pwd: "secure-password",
  roles: ["userAdminAnyDatabase"]
})
```

### 3. Environment Security

- Use strong passwords for all services
- Enable 2FA where possible
- Regularly update dependencies
- Monitor logs for suspicious activity
- Use environment variables for all secrets

## 📊 Monitoring & Maintenance

### 1. Application Monitoring

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs genibi-backend

# Restart application
pm2 restart genibi-backend
```

### 2. Database Backup

```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --db genibi-health --out /backups/mongodb_$DATE

# Add to crontab for daily backups
0 2 * * * /path/to/backup-script.sh
```

### 3. Log Rotation

```bash
# Configure logrotate for application logs
sudo nano /etc/logrotate.d/genibi

/var/log/genibi/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reload genibi-backend
    endscript
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd backend
        npm ci
    
    - name: Run tests
      run: |
        cd backend
        npm test
    
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "genibi-backend"
        heroku_email: "your-email@example.com"
        appdir: "backend"
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check connection string
   - Verify network access in MongoDB Atlas
   - Ensure MongoDB service is running

2. **OpenAI API Errors**
   - Verify API key is correct
   - Check API usage limits
   - Ensure proper error handling

3. **Firebase Authentication Issues**
   - Verify Firebase configuration
   - Check service account permissions
   - Ensure proper environment variables

4. **CORS Errors**
   - Update FRONTEND_URL in backend environment
   - Check CORS configuration in Express

### Health Checks

Create health check endpoints:

```javascript
// Add to your Express app
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## 📞 Support

For deployment support:
- **Technical Issues**: Create GitHub issue
- **Emergency Support**: +234 806 027 0792
- **Documentation**: Check ENHANCED_README.md

---

**Deployment completed successfully!** 🎉

Your Genibi NT Healthcare Plus application is now live and ready to help Nigerian students with their mental health and wellness journey.
