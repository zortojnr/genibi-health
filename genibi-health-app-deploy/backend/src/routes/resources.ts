import express from 'express';
import { optionalAuth, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Sample mental health resources data
const resources = [
  // Emergency Resources
  {
    id: '1',
    title: 'National Suicide Prevention Lifeline',
    description: '24/7 crisis support for immediate help',
    category: 'emergency',
    type: 'contact',
    phone: '199',
    emergency: true,
    location: 'Nigeria',
  },
  {
    id: '2',
    title: 'Campus Security Emergency',
    description: 'Immediate campus emergency response',
    category: 'emergency',
    type: 'contact',
    phone: '911',
    emergency: true,
    location: 'Campus',
  },
  
  // Counseling Resources
  {
    id: '3',
    title: 'University of Lagos Counseling Center',
    description: 'Free counseling services for UNILAG students',
    category: 'counseling',
    type: 'contact',
    phone: '+234-1-4932394',
    email: 'counseling@unilag.edu.ng',
    location: 'University of Lagos',
    hours: 'Mon-Fri 8AM-5PM',
  },
  {
    id: '4',
    title: 'Mentally Aware Nigeria Initiative (MANI)',
    description: 'Mental health advocacy and support organization',
    category: 'counseling',
    type: 'website',
    url: 'https://mentallyawareng.org',
    phone: '+234-809-993-6463',
    location: 'Nigeria',
  },
  {
    id: '5',
    title: 'She Writes Woman',
    description: 'Mental health support for women',
    category: 'counseling',
    type: 'website',
    url: 'https://shewriteswoman.org',
    location: 'Nigeria',
  },
  
  // Self-Help Resources
  {
    id: '6',
    title: 'Managing Anxiety: A Student Guide',
    description: 'Practical strategies for dealing with anxiety in university',
    category: 'self-help',
    type: 'article',
    url: 'https://example.com/anxiety-guide',
    tags: ['anxiety', 'students', 'coping'],
  },
  {
    id: '7',
    title: 'Mindfulness for Students',
    description: '10-minute daily meditation practices',
    category: 'self-help',
    type: 'audio',
    url: 'https://example.com/mindfulness',
    duration: '10 minutes',
    tags: ['mindfulness', 'meditation', 'stress'],
  },
  {
    id: '8',
    title: 'Stress Management Techniques',
    description: 'Video series on managing academic stress',
    category: 'self-help',
    type: 'video',
    url: 'https://example.com/stress-management',
    duration: '15 minutes',
    tags: ['stress', 'academic', 'techniques'],
  },
  {
    id: '9',
    title: 'Sleep Hygiene for Better Mental Health',
    description: 'Guide to improving sleep quality for mental wellness',
    category: 'self-help',
    type: 'article',
    url: 'https://example.com/sleep-hygiene',
    tags: ['sleep', 'wellness', 'mental-health'],
  },
  
  // Academic Support
  {
    id: '10',
    title: 'Academic Success Center',
    description: 'Study skills and academic support services',
    category: 'academic',
    type: 'contact',
    phone: '+234-xxx-xxx-xxxx',
    location: 'Campus',
    hours: 'Mon-Fri 9AM-6PM',
  },
  {
    id: '11',
    title: 'Time Management for Students',
    description: 'Learn effective time management strategies',
    category: 'academic',
    type: 'article',
    url: 'https://example.com/time-management',
    tags: ['time-management', 'productivity', 'students'],
  },
  
  // Wellness Resources
  {
    id: '12',
    title: 'Campus Fitness Center',
    description: 'Physical fitness and wellness programs',
    category: 'wellness',
    type: 'contact',
    phone: '+234-xxx-xxx-xxxx',
    location: 'Campus',
    hours: 'Mon-Sun 6AM-10PM',
  },
  {
    id: '13',
    title: 'Nutrition for Mental Health',
    description: 'How diet affects your mental wellbeing',
    category: 'wellness',
    type: 'article',
    url: 'https://example.com/nutrition-mental-health',
    tags: ['nutrition', 'diet', 'mental-health'],
  },
  
  // Support Groups
  {
    id: '14',
    title: 'Student Mental Health Support Group',
    description: 'Peer support group for students facing mental health challenges',
    category: 'support-groups',
    type: 'contact',
    email: 'support@studentmentalhealth.ng',
    location: 'Various campuses',
    schedule: 'Weekly meetings',
  },
  {
    id: '15',
    title: 'Anxiety and Depression Support Group',
    description: 'Support group for students dealing with anxiety and depression',
    category: 'support-groups',
    type: 'contact',
    phone: '+234-xxx-xxx-xxxx',
    location: 'Lagos',
    schedule: 'Bi-weekly meetings',
  },
];

// GET /api/resources - Get all resources with optional filtering
router.get('/', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { 
      category, 
      type, 
      emergency, 
      search, 
      limit = 50,
      offset = 0 
    } = req.query;

    let filteredResources = [...resources];

    // Filter by category
    if (category && category !== 'all') {
      filteredResources = filteredResources.filter(
        resource => resource.category === category
      );
    }

    // Filter by type
    if (type) {
      filteredResources = filteredResources.filter(
        resource => resource.type === type
      );
    }

    // Filter by emergency status
    if (emergency === 'true') {
      filteredResources = filteredResources.filter(
        resource => resource.emergency === true
      );
    }

    // Search functionality
    if (search) {
      const searchTerm = search.toString().toLowerCase();
      filteredResources = filteredResources.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm) ||
        resource.description.toLowerCase().includes(searchTerm) ||
        (resource.tags && resource.tags.some((tag: string) => 
          tag.toLowerCase().includes(searchTerm)
        ))
      );
    }

    // Pagination
    const startIndex = Number(offset);
    const endIndex = startIndex + Number(limit);
    const paginatedResources = filteredResources.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        resources: paginatedResources,
        total: filteredResources.length,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: endIndex < filteredResources.length,
      },
    });

  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch resources',
    });
  }
});

// GET /api/resources/categories - Get available categories
router.get('/categories', (req, res) => {
  const categories = [
    { id: 'emergency', label: 'Emergency', count: resources.filter(r => r.category === 'emergency').length },
    { id: 'counseling', label: 'Counseling', count: resources.filter(r => r.category === 'counseling').length },
    { id: 'self-help', label: 'Self-Help', count: resources.filter(r => r.category === 'self-help').length },
    { id: 'academic', label: 'Academic Support', count: resources.filter(r => r.category === 'academic').length },
    { id: 'wellness', label: 'Wellness', count: resources.filter(r => r.category === 'wellness').length },
    { id: 'support-groups', label: 'Support Groups', count: resources.filter(r => r.category === 'support-groups').length },
  ];

  res.json({
    success: true,
    data: categories,
  });
});

// GET /api/resources/emergency - Get emergency resources only
router.get('/emergency', (req, res) => {
  const emergencyResources = resources.filter(resource => resource.emergency === true);

  res.json({
    success: true,
    data: emergencyResources,
  });
});

// GET /api/resources/:id - Get specific resource
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const resource = resources.find(r => r.id === id);

  if (!resource) {
    return res.status(404).json({
      error: 'Resource not found',
      message: 'The requested resource does not exist',
    });
  }

  res.json({
    success: true,
    data: resource,
  });
});

// GET /api/resources/search/suggestions - Get search suggestions
router.get('/search/suggestions', (req, res) => {
  const suggestions = [
    'anxiety',
    'depression',
    'stress management',
    'sleep problems',
    'academic pressure',
    'counseling',
    'emergency help',
    'mindfulness',
    'support groups',
    'wellness',
  ];

  res.json({
    success: true,
    data: suggestions,
  });
});

export default router;
