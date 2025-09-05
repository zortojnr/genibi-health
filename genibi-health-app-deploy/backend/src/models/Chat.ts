import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  _id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    confidence?: number;
    entities?: Array<{
      entity: string;
      value: string;
      confidence: number;
    }>;
    sentiment?: {
      score: number;
      label: 'positive' | 'negative' | 'neutral';
    };
  };
}

export interface IChatSession extends Document {
  _id: string;
  userId: string;
  sessionId: string;
  title?: string;
  messages: IMessage[];
  status: 'active' | 'ended' | 'archived';
  context?: {
    currentTopic?: string;
    userMood?: string;
    healthConcerns?: string[];
    followUpRequired?: boolean;
    escalationLevel?: 'none' | 'low' | 'medium' | 'high' | 'emergency';
  };
  summary?: {
    keyTopics: string[];
    recommendations: string[];
    actionItems: string[];
    sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
    riskLevel: 'low' | 'medium' | 'high';
  };
  startedAt: Date;
  endedAt?: Date;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  type: {
    type: String,
    enum: ['user', 'bot'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    intent: String,
    confidence: Number,
    entities: [{
      entity: String,
      value: String,
      confidence: Number,
    }],
    sentiment: {
      score: Number,
      label: {
        type: String,
        enum: ['positive', 'negative', 'neutral'],
      },
    },
  },
});

const ChatSessionSchema = new Schema<IChatSession>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  title: String,
  messages: [MessageSchema],
  status: {
    type: String,
    enum: ['active', 'ended', 'archived'],
    default: 'active',
  },
  context: {
    currentTopic: String,
    userMood: String,
    healthConcerns: [String],
    followUpRequired: { type: Boolean, default: false },
    escalationLevel: {
      type: String,
      enum: ['none', 'low', 'medium', 'high', 'emergency'],
      default: 'none',
    },
  },
  summary: {
    keyTopics: [String],
    recommendations: [String],
    actionItems: [String],
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral', 'mixed'],
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  endedAt: Date,
  lastActivity: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes for efficient queries
ChatSessionSchema.index({ userId: 1, lastActivity: -1 });
ChatSessionSchema.index({ sessionId: 1 });
ChatSessionSchema.index({ status: 1 });

// Update lastActivity on message addition
ChatSessionSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.lastActivity = new Date();
  }
  next();
});

export default mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);
