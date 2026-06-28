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

export const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),

  body('department')
    .optional()
    .isIn(['CSE', 'ECE', 'ME', 'CE', 'EE', 'BIOTECH', 'OTHER'])
    .withMessage(' Invalid department'),

  body('year')
    .optional()
    .isIn(['1', '2', '3', '4'])
    .withMessage('Year must be 1, 2, 3, or 4'),

  body('profileImage')
  .optional({ checkFalsy: true })
  .isURL()
  .withMessage('Profile image must be a valid URL'),

  (req, res, next) => {
    handleValidationErrors(req, res, next);
  },
];

// Add skills validation
export const validateAddSkills = [
  body('skills')
    .isArray({ min: 1 })
    .withMessage('Skills must be an array with at least 1 skill')
    .custom((skills) => {
      if (skills.length > 10) {
        throw new Error(' Maximum 10 skills allowed');
      }
      if (!skills.every((s) => typeof s === 'string' && s.trim().length > 0)) {
        throw new Error(' Each skill must be a non-empty string');
      }
      return true;
    }),

  (req, res, next) => {
    handleValidationErrors(req, res, next);
  },
];

// Add interests validation
export const validateAddInterests = [
  body('interests')
    .isArray({ min: 1 })
    .withMessage('Interests must be an array with at least 1 interest')
    .custom((interests) => {
      if (interests.length > 10) {
        throw new Error(' Maximum 10 interests allowed');
      }
      if (!interests.every((i) => typeof i === 'string' && i.trim().length > 0)) {
        throw new Error(' Each interest must be a non-empty string');
      }
      return true;
    }),

  (req, res, next) => {
    handleValidationErrors(req, res, next);
  },
];

// Get all users with query validation
export const validateGetUsers = [
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  body('search')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Search term must not be empty'),

  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),

  body('department')
    .optional()
    .isIn(['CSE', 'ECE', 'ME', 'CE', 'EE', 'BIOTECH', 'OTHER'])
    .withMessage(' Invalid department'),

  (req, res, next) => {
    handleValidationErrors(req, res, next);
  },
];