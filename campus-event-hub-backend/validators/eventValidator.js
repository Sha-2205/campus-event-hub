import { body, validationResult } from 'express-validator';


export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: ' Validation Error',
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};


export const validateCreateEvent = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Event title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Event description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),

  body('eventDate')
    .notEmpty()
    .withMessage('Event date is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error(' Event date must be in the future');
      }
      return true;
    }),

  body('eventTime')
    .notEmpty()
    .withMessage('Event time is required')
    .matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/)
    .withMessage('Invalid time format (use HH:MM)'),

  body('location')
    .trim()
    .notEmpty()
    .withMessage('Event location is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Location must be between 3 and 100 characters'),

  body('category')
    .notEmpty()
    .withMessage('Event category is required')
    .isIn([
      'Technical',
      'Sports',
      'Cultural',
      'Academic',
      'Social',
      'Workshop',
      'Seminar',
      'Competition',
      'Other',
    ])
    .withMessage(' Invalid category'),

  body('capacity')
    .notEmpty()
    .withMessage('Event capacity is required')
    .isInt({ min: 1, max: 5000 })
    .withMessage('Capacity must be between 1 and 5000'),

  body('requiredSkills')
    .optional()
    .isArray()
    .withMessage('Required skills must be an array')
    .custom((skills) => {
      if (skills && skills.length > 10) {
        throw new Error(' Maximum 10 required skills allowed');
      }
      return true;
    }),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags && tags.length > 10) {
        throw new Error('Maximum 10 tags allowed');
      }
      return true;
    }),

  body('image')
    .optional()
    .isURL()
    .withMessage('Image must be a valid URL'),

  (req, res, next) => {
    handleValidationErrors(req, res, next);
  },
];

// Update event validation
export const validateUpdateEvent = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),

  body('eventDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      if (value && new Date(value) < new Date()) {
        throw new Error(' Event date must be in the future');
      }
      return true;
    }),

  body('eventTime')
    .optional()
    .matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/)
    .withMessage('Invalid time format (use HH:MM)'),

  body('location')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Location must be between 3 and 100 characters'),

  body('category')
    .optional()
    .isIn([
      'Technical',
      'Sports',
      'Cultural',
      'Academic',
      'Social',
      'Workshop',
      'Seminar',
      'Competition',
      'Other',
    ])
    .withMessage('Invalid category'),

  body('capacity')
    .optional()
    .isInt({ min: 1, max: 5000 })
    .withMessage('Capacity must be between 1 and 5000'),

  (req, res, next) => {
    handleValidationErrors(req, res, next);
  },
];

// Cancel event validation
export const validateCancelEvent = [
  body('cancellationReason')
    .trim()
    .notEmpty()
    .withMessage('Cancellation reason is required')
    .isLength({ min: 5 })
    .withMessage('Reason must be at least 5 characters'),

  (req, res, next) => {
    handleValidationErrors(req, res, next);
  },
];