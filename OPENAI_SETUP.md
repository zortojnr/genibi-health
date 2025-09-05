# 🤖 OpenAI Setup for GENIBI Mental Fitness

## Step 1: Create OpenAI Account

1. **Go to**: https://platform.openai.com
2. **Sign up** or **log in** with your account
3. **Verify your email** if needed

## Step 2: Get API Key

### 2.1 Navigate to API Keys
1. **Click your profile** in the top right corner
2. **Click "View API keys"** or go to https://platform.openai.com/api-keys

### 2.2 Create New API Key
1. **Click "Create new secret key"**
2. **Name**: `genibi-mental-fitness`
3. **Click "Create secret key"**
4. **Copy the key** - it starts with `sk-...`

⚠️ **Important**: Save this key immediately! You won't be able to see it again.

## Step 3: Add API Key to Backend

### 3.1 Edit backend/.env file
Replace this line in `backend/.env`:

```env
# Replace this:
OPENAI_API_KEY=sk-your-openai-api-key-here

# With your actual key:
OPENAI_API_KEY=sk-proj-abcd1234567890...
```

## Step 4: Test OpenAI Integration

### 4.1 Start Backend
```bash
cd backend
npm run dev
```

### 4.2 Test Chat Endpoint
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Hello, I am feeling anxious about my exams"
      }
    ]
  }'
```

Should return a JSON response with AI-generated mental health support.

## Step 5: Understanding the AI Features

### 5.1 Mental Health Assistant
The AI chatbot is specifically trained to:
- ✅ Provide empathetic mental health support
- ✅ Detect risk levels (low, medium, high, emergency)
- ✅ Offer culturally sensitive advice for Nigerian students
- ✅ Suggest coping strategies and resources
- ✅ Recommend professional help when needed

### 5.2 Risk Assessment
The system automatically assesses:
- **LOW**: General wellness, mild stress
- **MEDIUM**: Persistent sadness, anxiety, sleep issues
- **HIGH**: Severe depression, panic attacks, substance concerns
- **EMERGENCY**: Suicidal thoughts, self-harm, immediate danger

### 5.3 Safety Features
- Never provides medical diagnoses
- Always prioritizes user safety
- Recommends professional help for serious issues
- Provides emergency resources when needed

## 💰 Cost Considerations

### 5.1 OpenAI Pricing
- **GPT-3.5-turbo**: ~$0.002 per 1K tokens
- **Average conversation**: ~$0.01-0.05
- **Monthly estimate**: $10-50 for moderate usage

### 5.2 Cost Management
- Set usage limits in OpenAI dashboard
- Monitor usage regularly
- Consider rate limiting for production

## ✅ OpenAI Setup Complete!

Your AI chatbot is now ready to:
- ✅ Provide 24/7 mental health support
- ✅ Detect crisis situations
- ✅ Offer personalized coping strategies
- ✅ Connect students with appropriate resources

The GENIBI Mental Fitness app now has intelligent AI support! 🧠✨
