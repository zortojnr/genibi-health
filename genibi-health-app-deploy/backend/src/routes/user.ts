import express from 'express';
import admin from 'firebase-admin';
import { body, validationResult } from 'express-validator';
import { AuthenticatedRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// GET /api/user/preferences - Get user preferences
router.get('/preferences', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const userDoc = await admin.firestore()
      .collection('users')
      .doc(req.userId)
      .get();

    if (!userDoc.exists) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile not found',
      });
    }

    const userData = userDoc.data();
    const preferences = userData?.preferences || {
      notifications: true,
      anonymousMode: false,
      reminderFrequency: 'daily',
      crisisAlerts: true,
    };

    res.json({
      success: true,
      data: preferences,
    });

  } catch (error) {
    console.error('Get preferences error:', error);
    throw createError('Failed to get user preferences', 500);
  }
});

// PUT /api/user/preferences - Update user preferences
router.put('/preferences', [
  body('notifications')
    .optional()
    .isBoolean()
    .withMessage('Notifications must be a boolean'),
  body('anonymousMode')
    .optional()
    .isBoolean()
    .withMessage('Anonymous mode must be a boolean'),
  body('reminderFrequency')
    .optional()
    .isIn(['never', 'daily', 'weekly'])
    .withMessage('Reminder frequency must be never, daily, or weekly'),
  body('crisisAlerts')
    .optional()
    .isBoolean()
    .withMessage('Crisis alerts must be a boolean'),
], async (req: AuthenticatedRequest, res: any) => {
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

    const updates = {
      preferences: req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await admin.firestore()
      .collection('users')
      .doc(req.userId)
      .update(updates);

    res.json({
      success: true,
      message: 'Preferences updated successfully',
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    throw createError('Failed to update preferences', 500);
  }
});

// POST /api/user/mood-entry - Log mood entry
router.post('/mood-entry', [
  body('mood')
    .isInt({ min: 1, max: 10 })
    .withMessage('Mood must be a number between 1 and 10'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters'),
  body('activities')
    .optional()
    .isArray()
    .withMessage('Activities must be an array'),
], async (req: AuthenticatedRequest, res: any) => {
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

    const { mood, notes, activities } = req.body;

    const moodEntry = {
      userId: req.userId,
      mood,
      notes: notes || '',
      activities: activities || [],
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    };

    const docRef = await admin.firestore()
      .collection('moodEntries')
      .add(moodEntry);

    res.status(201).json({
      success: true,
      message: 'Mood entry logged successfully',
      data: {
        id: docRef.id,
        ...moodEntry,
      },
    });

  } catch (error) {
    console.error('Log mood entry error:', error);
    throw createError('Failed to log mood entry', 500);
  }
});

// GET /api/user/mood-history - Get mood history
router.get('/mood-history', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const { limit = 30, startDate, endDate } = req.query;

    let query = admin.firestore()
      .collection('moodEntries')
      .where('userId', '==', req.userId)
      .orderBy('timestamp', 'desc');

    if (startDate && endDate) {
      query = query
        .where('date', '>=', startDate)
        .where('date', '<=', endDate);
    }

    query = query.limit(Number(limit));

    const snapshot = await query.get();
    const moodEntries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: moodEntries,
    });

  } catch (error) {
    console.error('Get mood history error:', error);
    throw createError('Failed to get mood history', 500);
  }
});

// GET /api/user/mood-stats - Get mood statistics
router.get('/mood-stats', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const { period = '30' } = req.query; // days
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - Number(period));
    const startDate = daysAgo.toISOString().split('T')[0];

    const snapshot = await admin.firestore()
      .collection('moodEntries')
      .where('userId', '==', req.userId)
      .where('date', '>=', startDate)
      .get();

    const moodEntries = snapshot.docs.map(doc => doc.data());

    if (moodEntries.length === 0) {
      return res.json({
        success: true,
        data: {
          averageMood: 0,
          totalEntries: 0,
          moodTrend: 'neutral',
          period: Number(period),
        },
      });
    }

    const totalMood = moodEntries.reduce((sum, entry) => sum + entry.mood, 0);
    const averageMood = totalMood / moodEntries.length;

    // Calculate trend (comparing first half vs second half)
    const midpoint = Math.floor(moodEntries.length / 2);
    const firstHalf = moodEntries.slice(0, midpoint);
    const secondHalf = moodEntries.slice(midpoint);

    const firstHalfAvg = firstHalf.reduce((sum, entry) => sum + entry.mood, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, entry) => sum + entry.mood, 0) / secondHalf.length;

    let moodTrend = 'neutral';
    if (secondHalfAvg > firstHalfAvg + 0.5) {
      moodTrend = 'improving';
    } else if (secondHalfAvg < firstHalfAvg - 0.5) {
      moodTrend = 'declining';
    }

    res.json({
      success: true,
      data: {
        averageMood: Math.round(averageMood * 10) / 10,
        totalEntries: moodEntries.length,
        moodTrend,
        period: Number(period),
        firstHalfAverage: Math.round(firstHalfAvg * 10) / 10,
        secondHalfAverage: Math.round(secondHalfAvg * 10) / 10,
      },
    });

  } catch (error) {
    console.error('Get mood stats error:', error);
    throw createError('Failed to get mood statistics', 500);
  }
});

// POST /api/user/emergency-contact - Add emergency contact
router.post('/emergency-contact', [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name is required and must be less than 100 characters'),
  body('phone')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Phone is required and must be less than 20 characters'),
  body('relationship')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Relationship is required and must be less than 50 characters'),
], async (req: AuthenticatedRequest, res: any) => {
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

    const { name, phone, relationship } = req.body;

    const emergencyContact = {
      userId: req.userId,
      name,
      phone,
      relationship,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await admin.firestore()
      .collection('emergencyContacts')
      .add(emergencyContact);

    res.status(201).json({
      success: true,
      message: 'Emergency contact added successfully',
      data: {
        id: docRef.id,
        ...emergencyContact,
      },
    });

  } catch (error) {
    console.error('Add emergency contact error:', error);
    throw createError('Failed to add emergency contact', 500);
  }
});

// GET /api/user/emergency-contacts - Get emergency contacts
router.get('/emergency-contacts', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const snapshot = await admin.firestore()
      .collection('emergencyContacts')
      .where('userId', '==', req.userId)
      .orderBy('createdAt', 'desc')
      .get();

    const contacts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: contacts,
    });

  } catch (error) {
    console.error('Get emergency contacts error:', error);
    throw createError('Failed to get emergency contacts', 500);
  }
});

// GET /api/user/profile - Get user profile
router.get('/profile', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const userDoc = await admin.firestore()
      .collection('users')
      .doc(req.userId)
      .get();

    if (!userDoc.exists) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile not found',
      });
    }

    const userData = userDoc.data();

    // Remove sensitive information
    const { password, ...safeUserData } = userData || {};

    res.json({
      success: true,
      data: {
        id: userDoc.id,
        ...safeUserData,
      },
    });

  } catch (error) {
    console.error('Get profile error:', error);
    throw createError('Failed to get user profile', 500);
  }
});

// PUT /api/user/profile - Update user profile
router.put('/profile', [
  body('firstName').optional().trim().isLength({ min: 1 }).withMessage('First name cannot be empty'),
  body('lastName').optional().trim().isLength({ min: 1 }).withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phoneNumber').optional().isMobilePhone('any').withMessage('Valid phone number is required'),
], async (req: AuthenticatedRequest, res: any) => {
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

    const updates = {
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.password;
    delete updates.createdAt;
    delete updates.isEmailVerified;

    await admin.firestore()
      .collection('users')
      .doc(req.userId)
      .update(updates);

    res.json({
      success: true,
      message: 'Profile updated successfully',
    });

  } catch (error) {
    console.error('Update profile error:', error);
    throw createError('Failed to update user profile', 500);
  }
});

// GET /api/user/dashboard - Get dashboard data
router.get('/dashboard', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    // Get user profile
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(req.userId)
      .get();

    const userData = userDoc.exists ? userDoc.data() : null;

    // Get recent mood entries
    const moodSnapshot = await admin.firestore()
      .collection('moodEntries')
      .where('userId', '==', req.userId)
      .orderBy('timestamp', 'desc')
      .limit(7)
      .get();

    // Calculate stats
    const moodEntries = moodSnapshot.docs.map(doc => doc.data());
    const averageMood = moodEntries.length > 0
      ? moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length
      : 0;

    const dashboardData = {
      user: {
        firstName: userData?.firstName || 'User',
        lastName: userData?.lastName || '',
        email: userData?.email || '',
      },
      stats: {
        totalMoodEntries: moodEntries.length,
        averageMood: Math.round(averageMood * 10) / 10,
        weeklyEntries: moodEntries.filter(entry => {
          const entryDate = entry.timestamp.toDate();
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return entryDate >= weekAgo;
        }).length,
      },
      recentActivity: moodEntries.slice(0, 5).map(entry => ({
        type: 'mood',
        description: `Mood logged: ${entry.mood}/10`,
        timestamp: entry.timestamp,
        notes: entry.notes,
      })),
      quickActions: [
        { type: 'mood', label: 'Log Mood', icon: 'smile' },
        { type: 'chat', label: 'Chat with AI', icon: 'robot' },
        { type: 'resources', label: 'View Resources', icon: 'book' },
        { type: 'emergency', label: 'Emergency Help', icon: 'phone' },
      ],
    };

    res.json({
      success: true,
      data: dashboardData,
    });

  } catch (error) {
    console.error('Get dashboard error:', error);
    throw createError('Failed to get dashboard data', 500);
  }
});

export default router;
