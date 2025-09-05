# Genibi Health App - Deployment Package

## Quick Start

### Option 1: Simple HTTP Server (Recommended for testing)
```bash
# Using Python (if installed)
cd health-app
python -m http.server 8080

# Using Node.js (if installed)
npx serve health-app -p 8080

# Using PHP (if installed)
cd health-app
php -S localhost:8080
```

Then open: http://localhost:8080

### Option 2: Using the included server script
```bash
node server.js
```

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
1. Upload the `health-app` folder to your hosting service
2. Set the root directory to `health-app`
3. Deploy!

### VPS/Server Deployment
1. Upload files to your server
2. Use Nginx or Apache to serve the `health-app` directory
3. Optionally set up the backend for full functionality

## Support

- **Emergency**: +234 806 027 0792
- **Technical Support**: Create an issue on GitHub
- **Documentation**: See ENHANCED_README.md for detailed setup

---

**Genibi NT Healthcare Plus** - Empowering Nigerian students with comprehensive mental health and wellness support. 🇳🇬💚
