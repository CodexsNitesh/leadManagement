const express = require('express');
const { param } = require('express-validator');
const { trackClick, trackOpen } = require('../controllers/trackingController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/open/:leadId.png', [param('leadId').isMongoId().withMessage('Invalid lead id.')], validateRequest, trackOpen);
router.get('/click/:leadId', [param('leadId').isMongoId().withMessage('Invalid lead id.')], validateRequest, trackClick);

module.exports = router;
