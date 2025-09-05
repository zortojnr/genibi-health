import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  _id: string;
  userId: string;
  doctorId?: string;
  doctorName: string;
  specialty: string;
  appointmentType: 'consultation' | 'follow-up' | 'emergency' | 'routine-checkup' | 'specialist' | 'telemedicine';
  date: Date;
  time: string;
  duration: number; // in minutes
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show' | 'rescheduled';
  location?: {
    type: 'in-person' | 'telemedicine';
    address?: string;
    room?: string;
    meetingLink?: string;
  };
  reason: string;
  notes?: string;
  symptoms?: string[];
  vitals?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
  };
  prescription?: {
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions?: string;
    }>;
    notes?: string;
  };
  followUp?: {
    required: boolean;
    date?: Date;
    notes?: string;
  };
  cost?: {
    consultation: number;
    procedures?: number;
    total: number;
    currency: string;
    paymentStatus: 'pending' | 'paid' | 'partially-paid' | 'refunded';
  };
  reminders?: Array<{
    type: 'email' | 'sms' | 'push';
    sentAt: Date;
    status: 'sent' | 'delivered' | 'failed';
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  doctorId: {
    type: String,
    ref: 'Doctor',
  },
  doctorName: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  appointmentType: {
    type: String,
    enum: ['consultation', 'follow-up', 'emergency', 'routine-checkup', 'specialist', 'telemedicine'],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 30,
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show', 'rescheduled'],
    default: 'scheduled',
  },
  location: {
    type: {
      type: String,
      enum: ['in-person', 'telemedicine'],
      default: 'in-person',
    },
    address: String,
    room: String,
    meetingLink: String,
  },
  reason: {
    type: String,
    required: true,
  },
  notes: String,
  symptoms: [String],
  vitals: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    weight: Number,
    height: Number,
  },
  prescription: {
    medications: [{
      name: { type: String, required: true },
      dosage: { type: String, required: true },
      frequency: { type: String, required: true },
      duration: { type: String, required: true },
      instructions: String,
    }],
    notes: String,
  },
  followUp: {
    required: { type: Boolean, default: false },
    date: Date,
    notes: String,
  },
  cost: {
    consultation: Number,
    procedures: Number,
    total: Number,
    currency: { type: String, default: 'NGN' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'partially-paid', 'refunded'],
      default: 'pending',
    },
  },
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'push'],
    },
    sentAt: Date,
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed'],
    },
  }],
}, {
  timestamps: true,
});

// Index for efficient queries
AppointmentSchema.index({ userId: 1, date: 1 });
AppointmentSchema.index({ doctorId: 1, date: 1 });
AppointmentSchema.index({ status: 1 });

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
