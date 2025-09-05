# 🧠 GENIBI Mental Fitness - Complete Setup Guide

## ✅ What's Already Done for You

1. ✅ Project structure created
2. ✅ All dependencies configured
3. ✅ Firebase config updated with your project details
4. ✅ Backend environment file created
5. ✅ All source code files ready

## 🔧 What You Need to Do (2 Simple Steps)

### Step 1: Get Firebase Service Account Key

1. **Go to**: https://console.firebase.google.com
2. **Select your "genibi-app" project**
3. **Click the gear icon** ⚙️ next to "Project Overview"
4. **Click "Project settings"**
5. **Go to "Service accounts" tab**
6. **Click "Generate new private key"**
7. **Click "Generate key"** - downloads a JSON file
8. **Open the JSON file** and find these two values:
   - `client_email` (looks like: firebase-adminsdk-xxxxx@genibi-app.iam.gserviceaccount.com)
   - `private_key` (long text starting with -----BEGIN PRIVATE KEY-----)

9. **Edit `backend/.env` file** and replace:
   - Replace `firebase-adminsdk-xxxxx@genibi-app.iam.gserviceaccount.com` with your actual client_email
   - Replace `YOUR_ACTUAL_PRIVATE_KEY_FROM_JSON_FILE` with your actual private_key

### Step 2: Get OpenAI API Key

1. **Go to**: https://platform.openai.com/api-keys
2. **Sign up or log in**
3. **Click "Create new secret key"**
4. **Name it**: genibi-mental-fitness
5. **Copy the key** (starts with sk-...)
6. **Edit `backend/.env` file** and replace `sk-your-openai-api-key-here` with your actual key

## 🚀 Running the App

### Start Backend Server
```bash
cd backend
npm run dev
```

### Start Mobile App (in new terminal)
```bash
npm start
```

### Test on Phone
1. Install "Expo Go" app on your phone
2. Scan the QR code from terminal
3. App will load on your phone!

## 🎯 What Should Work

After setup:
- ✅ Welcome screen
- ✅ Anonymous access
- ✅ User registration/login
- ✅ AI chatbot with mental health support
- ✅ Resources library
- ✅ Profile management
- ✅ Mood tracking

## 🆘 Need Help?

If you get stuck:
1. Check that both terminals are running (backend and mobile app)
2. Make sure you replaced the API keys in backend/.env
3. Ensure your phone and computer are on the same WiFi network
4. Try restarting the servers if something doesn't work

## 📱 Firebase Setup Checklist

Make sure these are enabled in Firebase Console:
- ✅ Authentication > Email/Password enabled
- ✅ Authentication > Google Sign-In enabled  
- ✅ Firestore Database created
- ✅ Service account key downloaded

Your app is ready to help Nigerian students with their mental health! 🧠✨
