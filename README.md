# 🧠 GENIBI Mental Fitness

A comprehensive mobile application designed to enhance mental well-being among undergraduate students in Nigeria. GENIBI provides AI-powered mental health support, resources, and professional referrals in a safe, accessible platform.

## ✨ Features

### 🤖 AI-Powered Mental Health Assistant
- **OpenAI GPT Integration**: Intelligent chatbot trained for mental health support
- **Risk Assessment**: Automatic detection of mental health crisis levels
- **24/7 Availability**: Round-the-clock support for students
- **Culturally Sensitive**: Tailored for Nigerian undergraduate students

### 🔐 Privacy & Security
- **Anonymous Mode**: Use the app without creating an account
- **Firebase Authentication**: Secure user management
- **Data Protection**: End-to-end encryption for sensitive conversations
- **GDPR Compliant**: Privacy-first approach

### 📚 Comprehensive Resources
- **E-Library**: Mental health articles, guides, and resources
- **Emergency Contacts**: Quick access to crisis support services
- **Professional Referrals**: Connect with licensed therapists and counselors
- **Support Groups**: Peer support network connections

### 📱 User Experience
- **Cross-Platform**: iOS and Android support via React Native
- **Offline Access**: Key resources available without internet
- **Mood Tracking**: Daily check-ins and progress monitoring
- **Personalized Dashboard**: Customized experience based on user needs

## 🛠️ Tech Stack

### Frontend (Mobile App)
- **React Native** with Expo
- **TypeScript** for type safety
- **React Native Paper** for UI components
- **React Navigation** for navigation
- **Firebase SDK** for authentication and data

### Backend (API)
- **Node.js** with Express
- **TypeScript** for type safety
- **Firebase Admin SDK** for user management
- **OpenAI API** for AI chatbot functionality
- **Firebase Firestore** for data storage

### Infrastructure
- **Firebase** for authentication, database, and hosting
- **OpenAI GPT** for conversational AI
- **Expo** for mobile app development and deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- Firebase account
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/genibi-mental-fitness.git
cd genibi-mental-fitness-mobile
```

2. **Install mobile app dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
```

4. **Environment Setup**
```bash
# Copy environment template
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

5. **Firebase Configuration**
- Create a Firebase project
- Enable Authentication and Firestore
- Download service account key
- Update Firebase config in the app

6. **OpenAI Setup**
- Get OpenAI API key
- Add to environment variables

### Development

**Start the backend server:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Start the mobile app:**
```bash
npm start
# Opens Expo development tools
```

**Run on device:**
```bash
# iOS
npm run ios

# Android
npm run android
```

## 📁 Project Structure

```
genibi-mental-fitness-mobile/
├── src/                    # Mobile app source code
│   ├── components/         # Reusable UI components
│   ├── screens/           # App screens
│   ├── services/          # API and external services
│   ├── context/           # React context providers
│   ├── theme/             # App theme and styling
│   └── utils/             # Utility functions
├── backend/               # Backend API
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   └── index.ts       # Server entry point
│   ├── .env.example       # Environment template
│   └── package.json       # Backend dependencies
├── assets/                # App assets (images, icons)
├── app.json              # Expo configuration
├── package.json          # Mobile app dependencies
└── README.md             # This file
```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication (Email/Password, Google)
3. Create Firestore database
4. Download service account key
5. Update configuration in both frontend and backend

### OpenAI Setup
1. Create OpenAI account
2. Generate API key
3. Add to backend environment variables
4. Configure rate limits and usage monitoring

### Environment Variables

**Backend (.env):**
```env
NODE_ENV=development
PORT=5000
OPENAI_API_KEY=your_openai_api_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
```

**Mobile App:**
- Firebase config in `src/services/firebase.ts`
- API endpoints in service files

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run mobile app tests
npm test
```

## 📱 Deployment

### Mobile App Deployment
```bash
# Build for production
expo build:android
expo build:ios

# Or use EAS Build
eas build --platform all
```

### Backend Deployment
- Deploy to Railway, Render, or Heroku
- Set environment variables
- Configure domain and SSL

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Nigerian undergraduate students for inspiration
- Mental health professionals for guidance
- Open source community for tools and libraries
- Firebase and OpenAI for powerful platforms

## 📞 Support

For support, email support@genibi.ng or join our community discussions.

---

**Made with ❤️ for Nigerian students' mental wellness**
