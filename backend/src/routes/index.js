// src/routes/index.js
const express = require('express');
const router = express.Router();

const resultRoutes = require('./resultRoutes');
const imageRoutes = require('./imageRoutes');

router.use('/results', resultRoutes);
router.use('/images', imageRoutes);

// Root route
router.get('/', (req, res) => {
    res.send('Welcome to the Hyffins API');
});

// Catch-all route for unknown routes
router.use((req, res) => {
    res.status(404).send('Not Found');
});

module.exports = router;
