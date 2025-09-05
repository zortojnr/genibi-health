# 🔥 Firebase Setup for GENIBI Mental Fitness

## Step 1: Enable Firebase Services

### 1.1 Enable Authentication
1. Go to https://console.firebase.google.com
2. Select your "genibi-app" project
3. Click "Authentication" in the left sidebar
4. Click "Get started"
5. Go to "Sign-in method" tab
6. Enable these providers:
   - ✅ **Email/Password** - Click and toggle "Enable"
   - ✅ **Google** - Click, toggle "Enable", add your email

### 1.2 Create Firestore Database
1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode"
4. Select location: Choose closest to Nigeria (like europe-west1)
5. Click "Done"

## Step 2: Get Service Account Key

### 2.1 Download Service Account JSON
1. In Firebase Console, click the **gear icon** ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Go to "Service accounts" tab
4. Click "Generate new private key"
5. Click "Generate key" - downloads a JSON file
6. **Save this file securely** (don't share it!)

### 2.2 Extract Credentials
Open the downloaded JSON file and find these values:

```json
{
  "type": "service_account",
  "project_id": "genibi-app",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@genibi-app.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

You need:
- **client_email** (the firebase-adminsdk email)
- **private_key** (the entire private key including BEGIN/END lines)

## Step 3: Update Backend Configuration

### 3.1 Edit backend/.env file
Replace these values in `backend/.env`:

```env
# Replace this line:
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@genibi-app.iam.gserviceaccount.com
# With your actual client_email from the JSON file

# Replace this line:
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY_FROM_JSON_FILE\n-----END PRIVATE KEY-----"
# With your actual private_key from the JSON file
```

**Important**: Keep the quotes around the private key and include the \n characters!

## Step 4: Test Firebase Connection

### 4.1 Start Backend
```bash
cd backend
npm run dev
```

### 4.2 Test Health Endpoint
```bash
curl http://localhost:5000/health
```

Should return JSON with Firebase status.

## ✅ Firebase Setup Complete!

Your Firebase is now configured for:
- ✅ User authentication (email/password + Google)
- ✅ Firestore database for user data
- ✅ Backend API integration
- ✅ Secure service account access

Next: Get your OpenAI API key to enable the AI chatbot!
