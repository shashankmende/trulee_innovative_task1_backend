const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
// const loggingService = require('../services/loggingService');


router.get('/', candidateController.getCandidates);
router.post('/', candidateController.createCandidate);
router.patch('/:id', candidateController.updateCandidate);
router.get('/:id', candidateController.getCandidateById);

module.exports = router;
