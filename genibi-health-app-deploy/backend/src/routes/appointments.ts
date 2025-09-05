import express from 'express';
import admin from 'firebase-admin';
import { body, validationResult } from 'express-validator';
import { AuthenticatedRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();
const db = admin.firestore();

// GET /api/appointments - Get user's appointments
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const { status, limit = 50, startDate, endDate } = req.query;

    let query = db.collection('appointments')
      .where('userId', '==', req.userId)
      .orderBy('date', 'desc')
      .limit(parseInt(limit as string));

    if (status) {
      query = query.where('status', '==', status);
    }

    if (startDate) {
      query = query.where('date', '>=', new Date(startDate as string));
    }

    if (endDate) {
      query = query.where('date', '<=', new Date(endDate as string));
    }

    const snapshot = await query.get();
    const appointments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    throw createError('Failed to get appointments', 500);
  }
});

// POST /api/appointments - Create new appointment
router.post('/', [
  body('doctorName').trim().isLength({ min: 1 }).withMessage('Doctor name is required'),
  body('specialty').trim().isLength({ min: 1 }).withMessage('Specialty is required'),
  body('appointmentType').isIn(['consultation', 'follow-up', 'emergency', 'routine-checkup', 'specialist', 'telemedicine']),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format required (HH:MM)'),
  body('reason').trim().isLength({ min: 1 }).withMessage('Reason is required'),
], async (req: AuthenticatedRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const appointmentData = {
      userId: req.userId,
      doctorName: req.body.doctorName,
      specialty: req.body.specialty,
      appointmentType: req.body.appointmentType,
      date: admin.firestore.Timestamp.fromDate(new Date(req.body.date)),
      time: req.body.time,
      duration: req.body.duration || 30,
      status: 'scheduled',
      location: req.body.location || { type: 'in-person' },
      reason: req.body.reason,
      notes: req.body.notes || '',
      symptoms: req.body.symptoms || [],
      cost: req.body.cost || {
        consultation: 0,
        total: 0,
        currency: 'NGN',
        paymentStatus: 'pending',
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('appointments').add(appointmentData);

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: {
        id: docRef.id,
        ...appointmentData,
      },
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    throw createError('Failed to create appointment', 500);
  }
});

// PUT /api/appointments/:id - Update appointment
router.put('/:id', [
  body('status').optional().isIn(['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show', 'rescheduled']),
  body('date').optional().isISO8601(),
  body('time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
], async (req: AuthenticatedRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const appointmentId = req.params.id;
    const appointmentRef = db.collection('appointments').doc(appointmentId);
    const appointmentDoc = await appointmentRef.get();

    if (!appointmentDoc.exists) {
      return res.status(404).json({
        error: 'Appointment not found',
        message: 'The specified appointment does not exist',
      });
    }

    const appointmentData = appointmentDoc.data();
    if (appointmentData?.userId !== req.userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own appointments',
      });
    }

    const updates: any = {
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (req.body.date) {
      updates.date = admin.firestore.Timestamp.fromDate(new Date(req.body.date));
    }

    await appointmentRef.update(updates);

    res.json({
      success: true,
      message: 'Appointment updated successfully',
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    throw createError('Failed to update appointment', 500);
  }
});

// DELETE /api/appointments/:id - Cancel appointment
router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const appointmentId = req.params.id;
    const appointmentRef = db.collection('appointments').doc(appointmentId);
    const appointmentDoc = await appointmentRef.get();

    if (!appointmentDoc.exists) {
      return res.status(404).json({
        error: 'Appointment not found',
        message: 'The specified appointment does not exist',
      });
    }

    const appointmentData = appointmentDoc.data();
    if (appointmentData?.userId !== req.userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only cancel your own appointments',
      });
    }

    await appointmentRef.update({
      status: 'cancelled',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    throw createError('Failed to cancel appointment', 500);
  }
});

// GET /api/appointments/:id - Get specific appointment
router.get('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const appointmentId = req.params.id;
    const appointmentDoc = await db.collection('appointments').doc(appointmentId).get();

    if (!appointmentDoc.exists) {
      return res.status(404).json({
        error: 'Appointment not found',
        message: 'The specified appointment does not exist',
      });
    }

    const appointmentData = appointmentDoc.data();
    if (appointmentData?.userId !== req.userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only view your own appointments',
      });
    }

    res.json({
      success: true,
      data: {
        id: appointmentDoc.id,
        ...appointmentData,
      },
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    throw createError('Failed to get appointment', 500);
  }
});

// GET /api/appointments/upcoming - Get upcoming appointments
router.get('/upcoming/list', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const now = new Date();
    const snapshot = await db.collection('appointments')
      .where('userId', '==', req.userId)
      .where('date', '>=', admin.firestore.Timestamp.fromDate(now))
      .where('status', 'in', ['scheduled', 'confirmed'])
      .orderBy('date', 'asc')
      .limit(10)
      .get();

    const appointments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error('Get upcoming appointments error:', error);
    throw createError('Failed to get upcoming appointments', 500);
  }
});

export default router;
