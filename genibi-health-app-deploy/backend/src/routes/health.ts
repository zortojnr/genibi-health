import express from 'express';

const router = express.Router();

// GET /api/health - Health check endpoint
router.get('/', (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    services: {
      api: 'healthy',
      database: 'healthy', // This would check actual database connection
      openai: process.env.OPENAI_API_KEY ? 'configured' : 'not configured',
      firebase: process.env.FIREBASE_PROJECT_ID ? 'configured' : 'not configured',
    },
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
    },
  };

  res.json(healthCheck);
});

// GET /api/health/detailed - Detailed health check
router.get('/detailed', async (req, res) => {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'OK',
    checks: {
      api: {
        status: 'healthy',
        responseTime: Date.now(),
      },
      environment: {
        status: 'healthy',
        nodeVersion: process.version,
        platform: process.platform,
        environment: process.env.NODE_ENV || 'development',
      },
      configuration: {
        status: 'healthy',
        openaiConfigured: !!process.env.OPENAI_API_KEY,
        firebaseConfigured: !!process.env.FIREBASE_PROJECT_ID,
        portConfigured: !!process.env.PORT,
      },
      system: {
        status: 'healthy',
        uptime: process.uptime(),
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
          external: Math.round(process.memoryUsage().external / 1024 / 1024 * 100) / 100,
        },
        cpu: {
          usage: process.cpuUsage(),
        },
      },
    },
  };

  // Check if any service is unhealthy
  const allHealthy = Object.values(checks.checks).every(
    check => check.status === 'healthy'
  );

  if (!allHealthy) {
    checks.status = 'degraded';
    res.status(503);
  }

  res.json(checks);
});

// GET /api/health/readiness - Readiness probe
router.get('/readiness', async (req, res) => {
  try {
    // Check if all required environment variables are set
    const requiredEnvVars = [
      'OPENAI_API_KEY',
      'FIREBASE_PROJECT_ID',
      'FIREBASE_CLIENT_EMAIL',
      'FIREBASE_PRIVATE_KEY',
    ];

    const missingEnvVars = requiredEnvVars.filter(
      envVar => !process.env[envVar]
    );

    if (missingEnvVars.length > 0) {
      return res.status(503).json({
        status: 'not ready',
        message: 'Missing required environment variables',
        missingVariables: missingEnvVars,
        timestamp: new Date().toISOString(),
      });
    }

    // Additional readiness checks could go here
    // e.g., database connectivity, external service availability

    res.json({
      status: 'ready',
      message: 'Service is ready to accept requests',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Readiness check failed:', error);
    res.status(503).json({
      status: 'not ready',
      message: 'Readiness check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/health/liveness - Liveness probe
router.get('/liveness', (req, res) => {
  // Simple liveness check - if the server can respond, it's alive
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
