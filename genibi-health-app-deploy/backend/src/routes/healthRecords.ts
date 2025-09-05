import express from 'express';
import admin from 'firebase-admin';
import { body, validationResult } from 'express-validator';
import { AuthenticatedRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();
const db = admin.firestore();

// GET /api/health-records - Get health records
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const { recordType, limit = 50, startDate, endDate } = req.query;

    let query = db.collection('healthRecords')
      .where('userId', '==', req.userId)
      .orderBy('date', 'desc')
      .limit(parseInt(limit as string));

    if (recordType) {
      query = query.where('recordType', '==', recordType);
    }

    if (startDate) {
      query = query.where('date', '>=', admin.firestore.Timestamp.fromDate(new Date(startDate as string)));
    }

    if (endDate) {
      query = query.where('date', '<=', admin.firestore.Timestamp.fromDate(new Date(endDate as string)));
    }

    const snapshot = await query.get();
    const records = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: records,
    });
  } catch (error) {
    console.error('Get health records error:', error);
    throw createError('Failed to get health records', 500);
  }
});

// POST /api/health-records - Create health record
router.post('/', [
  body('recordType').isIn(['vital-signs', 'lab-results', 'imaging', 'prescription', 'diagnosis', 'procedure', 'vaccination', 'allergy', 'family-history']),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
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

    const recordData = {
      userId: req.userId,
      recordType: req.body.recordType,
      date: admin.firestore.Timestamp.fromDate(new Date(req.body.date)),
      title: req.body.title,
      description: req.body.description || '',
      vitalSigns: req.body.vitalSigns || null,
      labResults: req.body.labResults || null,
      imaging: req.body.imaging || null,
      prescription: req.body.prescription || null,
      diagnosis: req.body.diagnosis || null,
      procedure: req.body.procedure || null,
      vaccination: req.body.vaccination || null,
      allergy: req.body.allergy || null,
      familyHistory: req.body.familyHistory || null,
      provider: req.body.provider || null,
      attachments: req.body.attachments || [],
      tags: req.body.tags || [],
      isPrivate: req.body.isPrivate || false,
      sharedWith: req.body.sharedWith || [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('healthRecords').add(recordData);

    res.status(201).json({
      success: true,
      message: 'Health record created successfully',
      data: {
        id: docRef.id,
        ...recordData,
      },
    });
  } catch (error) {
    console.error('Create health record error:', error);
    throw createError('Failed to create health record', 500);
  }
});

// PUT /api/health-records/:id - Update health record
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1 }),
  body('recordType').optional().isIn(['vital-signs', 'lab-results', 'imaging', 'prescription', 'diagnosis', 'procedure', 'vaccination', 'allergy', 'family-history']),
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

    const recordId = req.params.id;
    const recordRef = db.collection('healthRecords').doc(recordId);
    const recordDoc = await recordRef.get();

    if (!recordDoc.exists) {
      return res.status(404).json({
        error: 'Health record not found',
        message: 'The specified health record does not exist',
      });
    }

    const recordData = recordDoc.data();
    if (recordData?.userId !== req.userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own health records',
      });
    }

    const updates: any = {
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (req.body.date) {
      updates.date = admin.firestore.Timestamp.fromDate(new Date(req.body.date));
    }

    await recordRef.update(updates);

    res.json({
      success: true,
      message: 'Health record updated successfully',
    });
  } catch (error) {
    console.error('Update health record error:', error);
    throw createError('Failed to update health record', 500);
  }
});

// DELETE /api/health-records/:id - Delete health record
router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const recordId = req.params.id;
    const recordRef = db.collection('healthRecords').doc(recordId);
    const recordDoc = await recordRef.get();

    if (!recordDoc.exists) {
      return res.status(404).json({
        error: 'Health record not found',
        message: 'The specified health record does not exist',
      });
    }

    const recordData = recordDoc.data();
    if (recordData?.userId !== req.userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own health records',
      });
    }

    await recordRef.delete();

    res.json({
      success: true,
      message: 'Health record deleted successfully',
    });
  } catch (error) {
    console.error('Delete health record error:', error);
    throw createError('Failed to delete health record', 500);
  }
});

// GET /api/health-records/:id - Get specific health record
router.get('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const recordId = req.params.id;
    const recordDoc = await db.collection('healthRecords').doc(recordId).get();

    if (!recordDoc.exists) {
      return res.status(404).json({
        error: 'Health record not found',
        message: 'The specified health record does not exist',
      });
    }

    const recordData = recordDoc.data();
    if (recordData?.userId !== req.userId && !recordData?.sharedWith?.includes(req.userId)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only view your own health records or records shared with you',
      });
    }

    res.json({
      success: true,
      data: {
        id: recordDoc.id,
        ...recordData,
      },
    });
  } catch (error) {
    console.error('Get health record error:', error);
    throw createError('Failed to get health record', 500);
  }
});

// POST /api/health-records/vital-signs - Quick vital signs entry
router.post('/vital-signs', [
  body('bloodPressure.systolic').optional().isInt({ min: 50, max: 300 }),
  body('bloodPressure.diastolic').optional().isInt({ min: 30, max: 200 }),
  body('heartRate.value').optional().isInt({ min: 30, max: 250 }),
  body('temperature.value').optional().isFloat({ min: 90, max: 110 }),
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

    const vitalSigns = req.body;
    const recordData = {
      userId: req.userId,
      recordType: 'vital-signs',
      date: admin.firestore.Timestamp.fromDate(new Date()),
      title: `Vital Signs - ${new Date().toLocaleDateString()}`,
      description: 'Vital signs measurement',
      vitalSigns: vitalSigns,
      tags: ['vital-signs', 'self-recorded'],
      isPrivate: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('healthRecords').add(recordData);

    res.status(201).json({
      success: true,
      message: 'Vital signs recorded successfully',
      data: {
        id: docRef.id,
        ...recordData,
      },
    });
  } catch (error) {
    console.error('Record vital signs error:', error);
    throw createError('Failed to record vital signs', 500);
  }
});

// GET /api/health-records/summary - Get health records summary
router.get('/summary/overview', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    // Get counts by record type
    const snapshot = await db.collection('healthRecords')
      .where('userId', '==', req.userId)
      .get();

    const summary = {
      totalRecords: snapshot.size,
      recordTypes: {},
      recentRecords: [],
      latestVitals: null,
    };

    const records = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Count by record type
    records.forEach(record => {
      const type = record.recordType;
      summary.recordTypes[type] = (summary.recordTypes[type] || 0) + 1;
    });

    // Get recent records (last 5)
    summary.recentRecords = records
      .sort((a, b) => b.date.seconds - a.date.seconds)
      .slice(0, 5);

    // Get latest vital signs
    const latestVitals = records
      .filter(record => record.recordType === 'vital-signs')
      .sort((a, b) => b.date.seconds - a.date.seconds)[0];

    if (latestVitals) {
      summary.latestVitals = latestVitals;
    }

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Get health records summary error:', error);
    throw createError('Failed to get health records summary', 500);
  }
});

export default router;
