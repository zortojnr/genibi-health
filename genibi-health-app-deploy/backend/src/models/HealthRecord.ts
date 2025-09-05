import mongoose, { Document, Schema } from 'mongoose';

export interface IHealthRecord extends Document {
  _id: string;
  userId: string;
  recordType: 'vital-signs' | 'lab-results' | 'imaging' | 'prescription' | 'diagnosis' | 'procedure' | 'vaccination' | 'allergy' | 'family-history';
  date: Date;
  title: string;
  description?: string;
  
  // Vital Signs
  vitalSigns?: {
    bloodPressure?: {
      systolic: number;
      diastolic: number;
      unit: string;
    };
    heartRate?: {
      value: number;
      unit: string;
    };
    temperature?: {
      value: number;
      unit: string;
    };
    respiratoryRate?: {
      value: number;
      unit: string;
    };
    oxygenSaturation?: {
      value: number;
      unit: string;
    };
    weight?: {
      value: number;
      unit: string;
    };
    height?: {
      value: number;
      unit: string;
    };
    bmi?: {
      value: number;
      category: string;
    };
  };

  // Lab Results
  labResults?: {
    testName: string;
    results: Array<{
      parameter: string;
      value: string;
      unit?: string;
      referenceRange?: string;
      status: 'normal' | 'high' | 'low' | 'critical';
    }>;
    labName?: string;
    orderedBy?: string;
  };

  // Imaging
  imaging?: {
    type: string;
    bodyPart: string;
    findings: string;
    radiologist?: string;
    facility?: string;
    images?: string[];
  };

  // Prescription
  prescription?: {
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions?: string;
      prescribedBy: string;
    }>;
    pharmacy?: string;
    notes?: string;
  };

  // Diagnosis
  diagnosis?: {
    condition: string;
    icdCode?: string;
    severity: 'mild' | 'moderate' | 'severe';
    status: 'active' | 'resolved' | 'chronic';
    diagnosedBy: string;
    notes?: string;
  };

  // Procedure
  procedure?: {
    name: string;
    type: string;
    performedBy: string;
    facility?: string;
    outcome: string;
    complications?: string;
    notes?: string;
  };

  // Vaccination
  vaccination?: {
    vaccine: string;
    manufacturer?: string;
    lotNumber?: string;
    site: string;
    administeredBy: string;
    nextDue?: Date;
    reactions?: string;
  };

  // Allergy
  allergy?: {
    allergen: string;
    type: 'food' | 'medication' | 'environmental' | 'other';
    severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
    reactions: string[];
    treatment?: string;
    notes?: string;
  };

  // Family History
  familyHistory?: {
    relation: string;
    condition: string;
    ageOfOnset?: number;
    notes?: string;
  };

  // Common fields
  provider?: {
    name: string;
    specialty?: string;
    facility?: string;
    contact?: string;
  };
  
  attachments?: Array<{
    filename: string;
    url: string;
    type: string;
    size: number;
  }>;

  tags?: string[];
  isPrivate: boolean;
  sharedWith?: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

const HealthRecordSchema = new Schema<IHealthRecord>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  recordType: {
    type: String,
    enum: ['vital-signs', 'lab-results', 'imaging', 'prescription', 'diagnosis', 'procedure', 'vaccination', 'allergy', 'family-history'],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  
  vitalSigns: {
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
      unit: { type: String, default: 'mmHg' },
    },
    heartRate: {
      value: Number,
      unit: { type: String, default: 'bpm' },
    },
    temperature: {
      value: Number,
      unit: { type: String, default: '°F' },
    },
    respiratoryRate: {
      value: Number,
      unit: { type: String, default: '/min' },
    },
    oxygenSaturation: {
      value: Number,
      unit: { type: String, default: '%' },
    },
    weight: {
      value: Number,
      unit: { type: String, default: 'kg' },
    },
    height: {
      value: Number,
      unit: { type: String, default: 'cm' },
    },
    bmi: {
      value: Number,
      category: String,
    },
  },

  labResults: {
    testName: String,
    results: [{
      parameter: String,
      value: String,
      unit: String,
      referenceRange: String,
      status: {
        type: String,
        enum: ['normal', 'high', 'low', 'critical'],
      },
    }],
    labName: String,
    orderedBy: String,
  },

  imaging: {
    type: String,
    bodyPart: String,
    findings: String,
    radiologist: String,
    facility: String,
    images: [String],
  },

  prescription: {
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String,
      prescribedBy: String,
    }],
    pharmacy: String,
    notes: String,
  },

  diagnosis: {
    condition: String,
    icdCode: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'chronic'],
    },
    diagnosedBy: String,
    notes: String,
  },

  procedure: {
    name: String,
    type: String,
    performedBy: String,
    facility: String,
    outcome: String,
    complications: String,
    notes: String,
  },

  vaccination: {
    vaccine: String,
    manufacturer: String,
    lotNumber: String,
    site: String,
    administeredBy: String,
    nextDue: Date,
    reactions: String,
  },

  allergy: {
    allergen: String,
    type: {
      type: String,
      enum: ['food', 'medication', 'environmental', 'other'],
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'life-threatening'],
    },
    reactions: [String],
    treatment: String,
    notes: String,
  },

  familyHistory: {
    relation: String,
    condition: String,
    ageOfOnset: Number,
    notes: String,
  },

  provider: {
    name: String,
    specialty: String,
    facility: String,
    contact: String,
  },

  attachments: [{
    filename: String,
    url: String,
    type: String,
    size: Number,
  }],

  tags: [String],
  isPrivate: {
    type: Boolean,
    default: false,
  },
  sharedWith: [String],
}, {
  timestamps: true,
});

// Indexes for efficient queries
HealthRecordSchema.index({ userId: 1, date: -1 });
HealthRecordSchema.index({ userId: 1, recordType: 1 });
HealthRecordSchema.index({ tags: 1 });

export default mongoose.model<IHealthRecord>('HealthRecord', HealthRecordSchema);
