# Converting to React Native CLI

If you want to use React Native CLI instead of Expo, here's how to convert the project:

## 🔄 Conversion Steps

### 1. Create New React Native CLI Project
```bash
npx react-native init GenibiBare --template react-native-template-typescript
cd GenibiBare
```

### 2. Install Required Dependencies
```bash
# Navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler

# UI Components
npm install react-native-paper react-native-vector-icons
npm install react-native-linear-gradient

# Firebase
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore

# Google Sign-In
npm install @react-native-google-signin/google-signin

# Other utilities
npm install @react-native-async-storage/async-storage
npm install axios react-hook-form date-fns
```

### 3. Platform-Specific Setup

#### Android Setup
```bash
# Add to android/app/build.gradle
implementation 'com.google.android.gms:play-services-auth:20.7.0'

# Add to android/settings.gradle
include ':react-native-vector-icons'
project(':react-native-vector-icons').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-vector-icons/android')
```

#### iOS Setup
```bash
cd ios && pod install
```

### 4. Key Changes Needed

#### Remove Expo Dependencies
- Remove `expo` and all `expo-*` packages
- Replace `expo-linear-gradient` with `react-native-linear-gradient`
- Replace `expo-status-bar` with React Native's StatusBar
- Replace `expo-auth-session` with Firebase Auth

#### Update Imports
```typescript
// Before (Expo)
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

// After (React Native CLI)
import LinearGradient from 'react-native-linear-gradient';
import { StatusBar } from 'react-native';
```

#### Firebase Configuration
```typescript
// Replace Firebase web SDK with React Native Firebase
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Instead of
import { auth, db } from 'firebase/app';
```

### 5. Updated Package.json
```json
{
  "name": "genibi-bare",
  "version": "1.0.0",
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "start": "react-native start",
    "test": "jest",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.6",
    "@react-navigation/native": "^6.1.7",
    "@react-navigation/stack": "^6.3.17",
    "@react-navigation/bottom-tabs": "^6.5.8",
    "react-native-screens": "^3.22.0",
    "react-native-safe-area-context": "^4.6.3",
    "react-native-gesture-handler": "^2.12.0",
    "react-native-paper": "^5.10.1",
    "react-native-vector-icons": "^10.0.0",
    "react-native-linear-gradient": "^2.8.3",
    "@react-native-firebase/app": "^18.3.0",
    "@react-native-firebase/auth": "^18.3.0",
    "@react-native-firebase/firestore": "^18.3.0",
    "@react-native-google-signin/google-signin": "^10.0.1",
    "@react-native-async-storage/async-storage": "^1.18.2",
    "axios": "^1.5.0",
    "react-hook-form": "^7.47.0",
    "date-fns": "^2.30.0"
  }
}
```

## 🛠️ Development Workflow Changes

### Building and Running
```bash
# Development
npm run android  # or react-native run-android
npm run ios      # or react-native run-ios

# Release builds
cd android && ./gradlew assembleRelease
cd ios && xcodebuild -workspace GenibiBare.xcworkspace -scheme GenibiBare archive
```

### Testing
```bash
# No Expo Go - need physical device or emulator
# Android: Android Studio emulator
# iOS: Xcode simulator
```

## 📱 Deployment Changes

### Android
- Generate signed APK/AAB through Android Studio
- Upload to Google Play Console

### iOS
- Archive through Xcode
- Upload to App Store Connect

## 🤔 Should You Convert?

**Stay with Expo if:**
- You want faster development
- You're building an MVP
- You don't need complex native features
- You want easier deployment

**Convert to CLI if:**
- You need specific native modules
- You want smaller app size
- You need full control over native code
- You have native development experience

## 🚀 Hybrid Approach: Expo Dev Build

Consider **Expo Dev Build** as a middle ground:
- Use Expo tools and workflow
- Add custom native code when needed
- Keep most Expo benefits
- More flexibility than managed workflow

```bash
# Create development build
eas build --profile development --platform android
```

This gives you the best of both worlds!
