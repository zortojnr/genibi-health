import express from 'express';
import admin from 'firebase-admin';
import { body, validationResult } from 'express-validator';
import { AuthenticatedRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Validation middleware
const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must be less than 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must be less than 50 characters'),
  body('university')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('University is required'),
  body('studyLevel')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Study level must be less than 20 characters'),
];

// POST /api/auth/register - Register new user
router.post('/register', validateUserRegistration, async (req: any, res: any) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { email, password, firstName, lastName, university, studyLevel } = req.body;

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // Create user profile in Firestore
    const userProfile = {
      uid: userRecord.uid,
      email,
      firstName,
      lastName,
      university,
      studyLevel: studyLevel || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true,
      preferences: {
        notifications: true,
        anonymousMode: false,
      },
    };

    await admin.firestore()
      .collection('users')
      .doc(userRecord.uid)
      .set(userProfile);

    // Generate custom token for immediate login
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        customToken,
      },
    });

  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({
        error: 'Email already exists',
        message: 'An account with this email already exists',
      });
    }

    if (error.code === 'auth/invalid-email') {
      return res.status(400).json({
        error: 'Invalid email',
        message: 'The email address is not valid',
      });
    }

    if (error.code === 'auth/weak-password') {
      return res.status(400).json({
        error: 'Weak password',
        message: 'The password is too weak',
      });
    }

    throw createError('Registration failed', 500);
  }
});

// POST /api/auth/verify-token - Verify Firebase ID token
router.post('/verify-token', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        error: 'Token required',
        message: 'ID token is required',
      });
    }

    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Get user profile from Firestore
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(decodedToken.uid)
      .get();

    let userProfile = null;
    if (userDoc.exists) {
      userProfile = userDoc.data();
    }

    res.json({
      success: true,
      data: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        profile: userProfile,
      },
    });

  } catch (error: any) {
    console.error('Token verification error:', error);

    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'The ID token has expired',
      });
    }

    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({
        error: 'Token revoked',
        message: 'The ID token has been revoked',
      });
    }

    return res.status(401).json({
      error: 'Invalid token',
      message: 'Token verification failed',
    });
  }
});

// GET /api/auth/me - Get current user profile
router.get('/me', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    // Get user profile from Firestore
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

    const userProfile = userDoc.data();

    res.json({
      success: true,
      data: userProfile,
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    throw createError('Failed to get user profile', 500);
  }
});

// PUT /api/auth/profile - Update user profile
router.put('/profile', [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be less than 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be less than 50 characters'),
  body('university')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('University must be less than 100 characters'),
  body('studyLevel')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Study level must be less than 20 characters'),
], async (req: AuthenticatedRequest, res: any) => {
  try {
    // Check validation results
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

    // Update user profile in Firestore
    await admin.firestore()
      .collection('users')
      .doc(req.userId)
      .update(updates);

    // Update display name in Firebase Auth if name changed
    if (req.body.firstName || req.body.lastName) {
      const userDoc = await admin.firestore()
        .collection('users')
        .doc(req.userId)
        .get();
      
      const userData = userDoc.data();
      const displayName = `${req.body.firstName || userData?.firstName} ${req.body.lastName || userData?.lastName}`;
      
      await admin.auth().updateUser(req.userId, { displayName });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
    });

  } catch (error) {
    console.error('Update profile error:', error);
    throw createError('Failed to update profile', 500);
  }
});

// DELETE /api/auth/account - Delete user account
router.delete('/account', async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    // Delete user from Firebase Auth
    await admin.auth().deleteUser(req.userId);

    // Delete user profile from Firestore
    await admin.firestore()
      .collection('users')
      .doc(req.userId)
      .delete();

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });

  } catch (error) {
    console.error('Delete account error:', error);
    throw createError('Failed to delete account', 500);
  }
});

export default router;
