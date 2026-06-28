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


export const validateCreateTeam = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Team name is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Team name must be between 3 and 50 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Team description is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),

  body('requiredSkills')
    .isArray({ min: 1, max: 10 })
    .withMessage('Required skills must be an array with 1-10 items')
    .custom((skills) => {
      if (!Array.isArray(skills) || skills.length === 0) {
        throw new Error(' At least one required skill is needed');
      }
      return true;
    }),

  body('maxMembers')
    .notEmpty()
    .withMessage('Max members is required')
    .isInt({ min: 2, max: 20 })
    .withMessage('Max members must be between 2 and 20'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags && tags.length > 10) {
        throw new Error(' Maximum 10 tags allowed');
      }
      return true;
    }),

  body('objective')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Objective cannot exceed 300 characters'),

  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),

  (req, res, next) => {
    handleValidationErrors(req, res, next);
  },
];


export const validateUpdateTeam = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Team name must be between 3 and 50 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),

  body('maxMembers')
    .optional()
    .isInt({ min: 2, max: 20 })
    .withMessage('Max members must be between 2 and 20'),

  body('objective')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Objective cannot exceed 300 characters'),

  (req, res, next) => {
    handleValidationErrors(req, res, next);
  },
];


export const validateJoinRequest = [
  body('message')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Message cannot exceed 200 characters'),

  (req, res, next) => {
    handleValidationErrors(req, res, next);
  },
];


export const validateAddMember = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID format'),

  (req, res, next) => {
    handleValidationErrors(req, res, next);
  },
];