// src/routes/resultRoutes.js
const express = require('express');
const resultController = require('../controllers/resultController');
const router = express.Router();

router.get('/allResults', resultController.getAllResults);

module.exports = router;