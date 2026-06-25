const express = require('express');
const { body, param } = require('express-validator');
const { createLead, getLeadById, getLeads } = require('../controllers/leadController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/',
  [
    body('fullName').trim().isLength({ min: 2, max: 120 }).withMessage('Full name must be 2-120 characters.'),
    body('email').trim().isEmail().withMessage('A valid email is required.').normalizeEmail(),
    body('phone').trim().isLength({ min: 7, max: 30 }).withMessage('Phone must be 7-30 characters.'),
    body('company').optional({ values: 'falsy' }).trim().isLength({ max: 160 }).withMessage('Company is too long.'),
    body('requirement').trim().isLength({ min: 10, max: 3000 }).withMessage('Requirement must be 10-3000 characters.'),
  ],
  validateRequest,
  createLead
);

router.get('/', getLeads);

router.get('/:id', [param('id').isMongoId().withMessage('Invalid lead id.')], validateRequest, getLeadById);

module.exports = router;
