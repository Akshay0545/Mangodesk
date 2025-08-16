const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');
// const test = require('./test.js') 

// Summary routes
router.post('/generate', summaryController.generateSummary);
router.get('/', summaryController.getAllSummaries);
router.get('/:id', summaryController.getSummary);
router.put('/:id', summaryController.updateSummary);
router.delete('/:id', summaryController.deleteSummary);
router.post('/:id/share', summaryController.shareSummary);
router.get('/shared/:token', summaryController.getSharedSummary);

module.exports = router;
