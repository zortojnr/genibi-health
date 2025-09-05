import express from 'express';
import admin from 'firebase-admin';
import { body, validationResult } from 'express-validator';
import { AuthenticatedRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();
const db = admin.firestore();

// GET /api/wellness - Get wellness data
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const { startDate, endDate, limit = 30 } = req.query;

    let query = db.collection('wellness')
      .where('userId', '==', req.userId)
      .orderBy('date', 'desc')
      .limit(parseInt(limit as string));

    if (startDate) {
      query = query.where('date', '>=', admin.firestore.Timestamp.fromDate(new Date(startDate as string)));
    }

    if (endDate) {
      query = query.where('date', '<=', admin.firestore.Timestamp.fromDate(new Date(endDate as string)));
    }

    const snapshot = await query.get();
    const wellnessData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: wellnessData,
    });
  } catch (error) {
    console.error('Get wellness data error:', error);
    throw createError('Failed to get wellness data', 500);
  }
});

// POST /api/wellness - Create/Update wellness entry
router.post('/', [
  body('date').isISO8601().withMessage('Valid date is required'),
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

    const date = new Date(req.body.date);
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Check if entry already exists for this date
    const existingQuery = await db.collection('wellness')
      .where('userId', '==', req.userId)
      .where('dateString', '==', dateString)
      .limit(1)
      .get();

    const wellnessData = {
      userId: req.userId,
      date: admin.firestore.Timestamp.fromDate(date),
      dateString: dateString,
      fitness: req.body.fitness || {},
      mentalHealth: req.body.mentalHealth || {},
      nutrition: req.body.nutrition || {},
      lifestyle: req.body.lifestyle || {},
      healthMetrics: req.body.healthMetrics || {},
      goals: req.body.goals || [],
      achievements: req.body.achievements || [],
      wellnessScore: req.body.wellnessScore || null,
      notes: req.body.notes || '',
      tags: req.body.tags || [],
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    let docRef;
    if (!existingQuery.empty) {
      // Update existing entry
      const existingDoc = existingQuery.docs[0];
      await existingDoc.ref.update(wellnessData);
      docRef = existingDoc.ref;
    } else {
      // Create new entry
      wellnessData.createdAt = admin.firestore.FieldValue.serverTimestamp();
      docRef = await db.collection('wellness').add(wellnessData);
    }

    res.status(201).json({
      success: true,
      message: 'Wellness data saved successfully',
      data: {
        id: docRef.id,
        ...wellnessData,
      },
    });
  } catch (error) {
    console.error('Save wellness data error:', error);
    throw createError('Failed to save wellness data', 500);
  }
});

// GET /api/wellness/today - Get today's wellness data
router.get('/today', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const today = new Date().toISOString().split('T')[0];
    
    const snapshot = await db.collection('wellness')
      .where('userId', '==', req.userId)
      .where('dateString', '==', today)
      .limit(1)
      .get();

    let wellnessData = null;
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      wellnessData = {
        id: doc.id,
        ...doc.data(),
      };
    }

    res.json({
      success: true,
      data: wellnessData,
    });
  } catch (error) {
    console.error('Get today wellness data error:', error);
    throw createError('Failed to get today wellness data', 500);
  }
});

// POST /api/wellness/mood - Log mood
router.post('/mood', [
  body('rating').isInt({ min: 1, max: 10 }).withMessage('Mood rating must be between 1 and 10'),
  body('emotions').optional().isArray().withMessage('Emotions must be an array'),
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

    const today = new Date().toISOString().split('T')[0];
    
    // Get or create today's wellness entry
    const snapshot = await db.collection('wellness')
      .where('userId', '==', req.userId)
      .where('dateString', '==', today)
      .limit(1)
      .get();

    const moodData = {
      rating: req.body.rating,
      emotions: req.body.emotions || [],
      triggers: req.body.triggers || [],
      notes: req.body.notes || '',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (!snapshot.empty) {
      // Update existing entry
      const doc = snapshot.docs[0];
      await doc.ref.update({
        'mentalHealth.mood': moodData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      // Create new entry
      const wellnessData = {
        userId: req.userId,
        date: admin.firestore.Timestamp.fromDate(new Date()),
        dateString: today,
        mentalHealth: { mood: moodData },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      await db.collection('wellness').add(wellnessData);
    }

    res.json({
      success: true,
      message: 'Mood logged successfully',
      data: moodData,
    });
  } catch (error) {
    console.error('Log mood error:', error);
    throw createError('Failed to log mood', 500);
  }
});

// POST /api/wellness/exercise - Log exercise
router.post('/exercise', [
  body('type').trim().isLength({ min: 1 }).withMessage('Exercise type is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('intensity').isIn(['low', 'moderate', 'high']).withMessage('Intensity must be low, moderate, or high'),
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

    const today = new Date().toISOString().split('T')[0];
    
    const exerciseData = {
      type: req.body.type,
      duration: req.body.duration,
      intensity: req.body.intensity,
      calories: req.body.calories || null,
      notes: req.body.notes || '',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Get or create today's wellness entry
    const snapshot = await db.collection('wellness')
      .where('userId', '==', req.userId)
      .where('dateString', '==', today)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      // Update existing entry
      const doc = snapshot.docs[0];
      const docData = doc.data();
      const currentExercises = docData.fitness?.exercise || [];
      
      await doc.ref.update({
        'fitness.exercise': [...currentExercises, exerciseData],
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      // Create new entry
      const wellnessData = {
        userId: req.userId,
        date: admin.firestore.Timestamp.fromDate(new Date()),
        dateString: today,
        fitness: { exercise: [exerciseData] },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      await db.collection('wellness').add(wellnessData);
    }

    res.json({
      success: true,
      message: 'Exercise logged successfully',
      data: exerciseData,
    });
  } catch (error) {
    console.error('Log exercise error:', error);
    throw createError('Failed to log exercise', 500);
  }
});

// GET /api/wellness/stats - Get wellness statistics
router.get('/stats', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const { period = '30' } = req.query;
    const days = parseInt(period as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const snapshot = await db.collection('wellness')
      .where('userId', '==', req.userId)
      .where('date', '>=', admin.firestore.Timestamp.fromDate(startDate))
      .orderBy('date', 'desc')
      .get();

    const wellnessEntries = snapshot.docs.map(doc => doc.data());

    // Calculate statistics
    const stats = {
      totalEntries: wellnessEntries.length,
      averageMood: 0,
      totalExerciseMinutes: 0,
      averageWellnessScore: 0,
      streaks: {
        exercise: 0,
        mood: 0,
      },
      trends: {
        mood: [],
        exercise: [],
        wellnessScore: [],
      },
    };

    if (wellnessEntries.length > 0) {
      // Calculate averages
      const moodRatings = wellnessEntries
        .filter(entry => entry.mentalHealth?.mood?.rating)
        .map(entry => entry.mentalHealth.mood.rating);
      
      if (moodRatings.length > 0) {
        stats.averageMood = moodRatings.reduce((sum, rating) => sum + rating, 0) / moodRatings.length;
      }

      // Calculate total exercise minutes
      wellnessEntries.forEach(entry => {
        if (entry.fitness?.exercise) {
          entry.fitness.exercise.forEach((exercise: any) => {
            stats.totalExerciseMinutes += exercise.duration || 0;
          });
        }
      });

      // Calculate average wellness score
      const wellnessScores = wellnessEntries
        .filter(entry => entry.wellnessScore?.overall)
        .map(entry => entry.wellnessScore.overall);
      
      if (wellnessScores.length > 0) {
        stats.averageWellnessScore = wellnessScores.reduce((sum, score) => sum + score, 0) / wellnessScores.length;
      }
    }

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get wellness stats error:', error);
    throw createError('Failed to get wellness statistics', 500);
  }
});

export default router;
