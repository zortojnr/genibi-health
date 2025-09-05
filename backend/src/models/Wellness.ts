import mongoose, { Document, Schema } from 'mongoose';

export interface IWellness extends Document {
  _id: string;
  userId: string;
  date: Date;
  
  // Fitness Tracking
  fitness?: {
    steps?: {
      count: number;
      goal: number;
      distance?: number; // in km
      calories?: number;
    };
    exercise?: Array<{
      type: string;
      duration: number; // in minutes
      intensity: 'low' | 'moderate' | 'high';
      calories?: number;
      notes?: string;
    }>;
    sleep?: {
      bedtime?: Date;
      wakeTime?: Date;
      duration?: number; // in hours
      quality: 'poor' | 'fair' | 'good' | 'excellent';
      notes?: string;
    };
    heartRate?: {
      resting: number;
      max?: number;
      zones?: {
        fat_burn: number;
        cardio: number;
        peak: number;
      };
    };
  };

  // Mental Health
  mentalHealth?: {
    mood?: {
      rating: number; // 1-10 scale
      emotions: string[];
      triggers?: string[];
      notes?: string;
    };
    stress?: {
      level: number; // 1-10 scale
      sources?: string[];
      copingStrategies?: string[];
      notes?: string;
    };
    anxiety?: {
      level: number; // 1-10 scale
      symptoms?: string[];
      triggers?: string[];
      notes?: string;
    };
    meditation?: {
      duration: number; // in minutes
      type: string;
      notes?: string;
    };
    therapy?: {
      session: boolean;
      type?: string;
      notes?: string;
    };
  };

  // Nutrition
  nutrition?: {
    meals?: Array<{
      type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
      foods: Array<{
        name: string;
        quantity?: string;
        calories?: number;
      }>;
      totalCalories?: number;
      notes?: string;
    }>;
    water?: {
      intake: number; // in liters
      goal: number;
    };
    supplements?: Array<{
      name: string;
      dosage: string;
      taken: boolean;
      time?: Date;
    }>;
  };

  // Lifestyle
  lifestyle?: {
    screenTime?: {
      total: number; // in hours
      breakdown?: {
        work: number;
        social: number;
        entertainment: number;
        other: number;
      };
    };
    socialInteraction?: {
      quality: 'poor' | 'fair' | 'good' | 'excellent';
      duration?: number; // in hours
      type?: string[];
      notes?: string;
    };
    productivity?: {
      rating: number; // 1-10 scale
      tasksCompleted?: number;
      focusLevel?: number; // 1-10 scale
      notes?: string;
    };
    habits?: Array<{
      name: string;
      completed: boolean;
      streak?: number;
      notes?: string;
    }>;
  };

  // Health Metrics
  healthMetrics?: {
    weight?: number;
    bodyFat?: number;
    muscleMass?: number;
    bmi?: number;
    bloodPressure?: {
      systolic: number;
      diastolic: number;
    };
    bloodSugar?: number;
    temperature?: number;
  };

  // Goals and Achievements
  goals?: Array<{
    category: 'fitness' | 'mental-health' | 'nutrition' | 'lifestyle';
    description: string;
    target: number;
    current: number;
    unit: string;
    deadline?: Date;
    achieved: boolean;
  }>;

  achievements?: Array<{
    title: string;
    description: string;
    category: string;
    earnedAt: Date;
    icon?: string;
  }>;

  // Overall Wellness Score
  wellnessScore?: {
    overall: number; // 1-100
    fitness: number;
    mentalHealth: number;
    nutrition: number;
    lifestyle: number;
    calculatedAt: Date;
  };

  notes?: string;
  tags?: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

const WellnessSchema = new Schema<IWellness>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  date: {
    type: Date,
    required: true,
  },

  fitness: {
    steps: {
      count: Number,
      goal: { type: Number, default: 10000 },
      distance: Number,
      calories: Number,
    },
    exercise: [{
      type: String,
      duration: Number,
      intensity: {
        type: String,
        enum: ['low', 'moderate', 'high'],
      },
      calories: Number,
      notes: String,
    }],
    sleep: {
      bedtime: Date,
      wakeTime: Date,
      duration: Number,
      quality: {
        type: String,
        enum: ['poor', 'fair', 'good', 'excellent'],
      },
      notes: String,
    },
    heartRate: {
      resting: Number,
      max: Number,
      zones: {
        fat_burn: Number,
        cardio: Number,
        peak: Number,
      },
    },
  },

  mentalHealth: {
    mood: {
      rating: {
        type: Number,
        min: 1,
        max: 10,
      },
      emotions: [String],
      triggers: [String],
      notes: String,
    },
    stress: {
      level: {
        type: Number,
        min: 1,
        max: 10,
      },
      sources: [String],
      copingStrategies: [String],
      notes: String,
    },
    anxiety: {
      level: {
        type: Number,
        min: 1,
        max: 10,
      },
      symptoms: [String],
      triggers: [String],
      notes: String,
    },
    meditation: {
      duration: Number,
      type: String,
      notes: String,
    },
    therapy: {
      session: Boolean,
      type: String,
      notes: String,
    },
  },

  nutrition: {
    meals: [{
      type: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      },
      foods: [{
        name: String,
        quantity: String,
        calories: Number,
      }],
      totalCalories: Number,
      notes: String,
    }],
    water: {
      intake: Number,
      goal: { type: Number, default: 2.5 },
    },
    supplements: [{
      name: String,
      dosage: String,
      taken: Boolean,
      time: Date,
    }],
  },

  lifestyle: {
    screenTime: {
      total: Number,
      breakdown: {
        work: Number,
        social: Number,
        entertainment: Number,
        other: Number,
      },
    },
    socialInteraction: {
      quality: {
        type: String,
        enum: ['poor', 'fair', 'good', 'excellent'],
      },
      duration: Number,
      type: [String],
      notes: String,
    },
    productivity: {
      rating: {
        type: Number,
        min: 1,
        max: 10,
      },
      tasksCompleted: Number,
      focusLevel: {
        type: Number,
        min: 1,
        max: 10,
      },
      notes: String,
    },
    habits: [{
      name: String,
      completed: Boolean,
      streak: { type: Number, default: 0 },
      notes: String,
    }],
  },

  healthMetrics: {
    weight: Number,
    bodyFat: Number,
    muscleMass: Number,
    bmi: Number,
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
    },
    bloodSugar: Number,
    temperature: Number,
  },

  goals: [{
    category: {
      type: String,
      enum: ['fitness', 'mental-health', 'nutrition', 'lifestyle'],
    },
    description: String,
    target: Number,
    current: Number,
    unit: String,
    deadline: Date,
    achieved: { type: Boolean, default: false },
  }],

  achievements: [{
    title: String,
    description: String,
    category: String,
    earnedAt: Date,
    icon: String,
  }],

  wellnessScore: {
    overall: {
      type: Number,
      min: 1,
      max: 100,
    },
    fitness: {
      type: Number,
      min: 1,
      max: 100,
    },
    mentalHealth: {
      type: Number,
      min: 1,
      max: 100,
    },
    nutrition: {
      type: Number,
      min: 1,
      max: 100,
    },
    lifestyle: {
      type: Number,
      min: 1,
      max: 100,
    },
    calculatedAt: Date,
  },

  notes: String,
  tags: [String],
}, {
  timestamps: true,
});

// Indexes for efficient queries
WellnessSchema.index({ userId: 1, date: -1 });
WellnessSchema.index({ userId: 1, 'goals.category': 1 });

export default mongoose.model<IWellness>('Wellness', WellnessSchema);
