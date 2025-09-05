# Genibi NT Healthcare Plus - Enhanced Version

A comprehensive mental health and wellness platform designed specifically for Nigerian students and young adults. This enhanced version provides AI-powered mental health support, wellness tracking, appointment management, and health record keeping.

## 🌟 New Features Added

### 🤖 Enhanced AI-Powered Mental Health Assistant
- **Intelligent Chatbot**: Powered by OpenAI GPT-3.5 with specialized mental health training
- **Risk Assessment**: Automatic detection of mental health risk levels (low, medium, high, emergency)
- **Personalized Responses**: Context-aware conversations with user name recognition
- **Session Management**: Persistent chat sessions with conversation history

### 📊 Comprehensive Wellness Tracking
- **Mood Logging**: Daily mood tracking with emotions and triggers
- **Exercise Tracking**: Log workouts, duration, and intensity
- **Sleep Monitoring**: Track sleep patterns and quality
- **Nutrition Logging**: Record meals and water intake
- **Vital Signs**: Monitor heart rate, blood pressure, temperature, and oxygen saturation

### 📅 Full Appointment Management System
- **Book Appointments**: Schedule appointments with healthcare providers
- **Upcoming Appointments**: View and manage scheduled appointments
- **Appointment History**: Track past appointments and outcomes
- **Real-time Updates**: Live appointment status updates

### 🏥 Digital Health Records
- **Comprehensive Records**: Store and manage all health information
- **Vital Signs History**: Track health metrics over time
- **Lab Results**: Store and organize test results
- **Quick Vital Recording**: Easy-to-use vital signs input forms

### 🔐 Enhanced Security & Privacy
- **Firebase Authentication**: Secure user authentication with JWT tokens
- **Data Encryption**: All sensitive data is encrypted
- **Privacy Controls**: User-controlled data sharing preferences
- **Session Management**: Secure session handling

## 🛠 Technology Stack

### Backend Enhancements
- **Node.js** with Express.js framework
- **Firebase Admin SDK** for authentication and database
- **MongoDB** with Mongoose for complex data modeling
- **OpenAI API** for AI-powered chat responses
- **Socket.IO** for real-time features
- **Express Validator** for comprehensive input validation

### Frontend Improvements
- **Enhanced API Integration**: Comprehensive API service layer
- **Real-time Updates**: Live data synchronization
- **Improved UX**: Better loading states and error handling
- **Mobile Optimization**: Enhanced mobile responsiveness

### New Database Collections
- **Users**: Enhanced user profiles with preferences
- **Wellness**: Daily wellness data and tracking
- **Appointments**: Complete appointment management
- **Health Records**: Medical records and vital signs
- **Chat Sessions**: AI chat conversations with context

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Firebase project with Authentication enabled
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd genibi-mental-fitness-mobile
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/genibi-health
   JWT_SECRET=your-jwt-secret-key
   OPENAI_API_KEY=your-openai-api-key
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Configure Firebase**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication with Email/Password
   - Download the service account key and place it in `backend/config/`
   - Update Firebase configuration in the frontend

5. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

6. **Serve the frontend**
   ```bash
   cd health-app
   # Use any static file server, e.g.:
   python -m http.server 3000
   # or
   npx serve .
   ```

7. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 📱 Enhanced Usage

### New User Experience
1. **Enhanced Registration**: Improved signup flow with better validation
2. **Smart Dashboard**: Personalized dashboard with real-time data
3. **Intelligent Chat**: Context-aware AI conversations
4. **Comprehensive Tracking**: All-in-one wellness monitoring

### Key Feature Enhancements

#### AI Chat Assistant
- Personalized greetings with user names
- Context-aware responses based on user history
- Automatic risk assessment and escalation
- Emergency detection with immediate support options

#### Wellness Tracking
- Real-time data synchronization
- Visual progress tracking
- Trend analysis and insights
- Goal setting and achievement tracking

#### Appointment Management
- Full CRUD operations for appointments
- Real-time status updates
- Integration with calendar systems
- Automated reminders

#### Health Records
- Comprehensive medical history
- Easy vital signs recording
- Data visualization and trends
- Export capabilities for healthcare providers

## 🔧 Enhanced API Documentation

### New Authentication Endpoints
- `POST /api/auth/register` - Enhanced user registration
- `POST /api/auth/login` - Secure user login
- `GET /api/auth/verify` - Token verification
- `POST /api/auth/logout` - Secure logout

### Wellness Tracking APIs
- `GET /api/wellness` - Get wellness data with filtering
- `POST /api/wellness` - Save comprehensive wellness data
- `POST /api/wellness/mood` - Quick mood logging
- `POST /api/wellness/exercise` - Exercise tracking
- `GET /api/wellness/stats` - Wellness analytics

### Appointment Management APIs
- `GET /api/appointments` - List appointments with filters
- `POST /api/appointments` - Create new appointments
- `PUT /api/appointments/:id` - Update appointments
- `DELETE /api/appointments/:id` - Cancel appointments
- `GET /api/appointments/upcoming/list` - Get upcoming appointments

### Health Records APIs
- `GET /api/health-records` - Retrieve health records
- `POST /api/health-records` - Create health records
- `POST /api/health-records/vital-signs` - Quick vital signs recording
- `GET /api/health-records/summary/overview` - Health summary

### Enhanced Chat APIs
- `POST /api/chat/message` - Send messages with session management
- `GET /api/chat/sessions` - Get chat session history
- `GET /api/chat/sessions/:id` - Get specific session details

## 🎨 Enhanced Design System

### Improved UI/UX
- **Consistent Color Scheme**: Calming blues and greens for health and wellness
- **Better Typography**: Improved readability and accessibility
- **Enhanced Responsiveness**: Optimized for all device sizes
- **Loading States**: Better user feedback during operations
- **Error Handling**: Comprehensive error messages and recovery options

### New Interactive Elements
- **Smart Forms**: Auto-validation and helpful hints
- **Progress Indicators**: Visual progress tracking
- **Real-time Updates**: Live data synchronization
- **Contextual Help**: In-app guidance and tooltips

## 🔒 Enhanced Security Features

### Data Protection
- **End-to-end Encryption**: All sensitive data encrypted
- **Secure Authentication**: JWT tokens with refresh mechanism
- **Input Validation**: Comprehensive server-side validation
- **Rate Limiting**: Protection against abuse

### Privacy Enhancements
- **Granular Permissions**: Fine-grained privacy controls
- **Data Minimization**: Only collect necessary information
- **Audit Logging**: Track data access and modifications
- **GDPR Compliance**: Full compliance with privacy regulations

## 📞 Support & Emergency

### Enhanced Support System
**24/7 Helpline**: +234 806 027 0792
- Mental health crisis support
- Technical assistance
- Appointment scheduling help
- General health inquiries

### Emergency Protocols
- Automatic crisis detection in chat
- Immediate escalation to human support
- Emergency contact integration
- Crisis intervention resources

## 🤝 Contributing

We welcome contributions to improve Genibi NT Healthcare Plus! 

### Development Guidelines
- Follow existing code style and conventions
- Write comprehensive tests for new features
- Update documentation for any changes
- Ensure mobile responsiveness for UI changes

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT-3.5 API for mental health assistance
- Firebase for authentication and database services
- MongoDB for robust data modeling capabilities
- The Nigerian healthcare community for guidance and feedback
- All contributors and testers who helped improve this platform

---

**Genibi NT Healthcare Plus** - Empowering Nigerian students with comprehensive mental health and wellness support. 🇳🇬💚

## 🔄 Version History

### v2.0.0 (Enhanced Version)
- Added comprehensive backend API with MongoDB integration
- Enhanced AI chat with OpenAI GPT-3.5 integration
- Full appointment management system
- Digital health records with vital signs tracking
- Improved security and authentication
- Real-time features with Socket.IO
- Enhanced mobile responsiveness

### v1.0.0 (Original Version)
- Basic mental health chatbot
- Simple mood tracking
- Firebase integration
- Basic user authentication
