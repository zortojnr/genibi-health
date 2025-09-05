# GENIBI Health App - Production Deployment Guide

## 🚀 Quick Start

### Option 1: Simple Node.js Deployment
1. Run `start-production.bat` (Windows) or `npm start` (Cross-platform)
2. Open http://localhost:8080 in your browser

### Option 2: PM2 Process Manager (Recommended for Production)
```bash
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### Option 3: Docker Deployment
```bash
docker-compose up -d
```

## 🔧 Configuration

1. **Environment Variables**: Update `.env` file with your configuration
2. **Database**: Configure MongoDB connection string
3. **External Services**: Set up Firebase, OpenAI, Twilio credentials
4. **Security**: Update JWT secret and CORS settings

## 📊 Monitoring

- **Health Check**: GET /api/health
- **Logs**: Check `logs/` directory
- **PM2 Monitoring**: `pm2 monit`

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

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/vitals/:userId` - Get vital signs
- `POST /api/vitals` - Save vital signs
- `GET /api/medications/:userId` - Get medications
- `POST /api/medications` - Add medication
- `GET /api/appointments/:userId` - Get appointments
- `POST /api/appointments` - Schedule appointment
- `GET /api/moods/:userId` - Get mood entries
- `POST /api/moods` - Log mood
- `POST /api/chat` - Send chat message
- `POST /api/emergency` - Trigger emergency alert

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
