const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');

// Share-first routes to avoid accidental :id conflicts later
router.get('/shared/:token', summaryController.getSharedSummary);
router.post('/:id/share', summaryController.shareSummary);

// CRUD
router.post('/generate', summaryController.generateSummary);
router.get('/', summaryController.getAllSummaries);
router.get('/:id', summaryController.getSummary);
router.put('/:id', summaryController.updateSummary);
router.delete('/:id', summaryController.deleteSummary);

module.exports = router;
