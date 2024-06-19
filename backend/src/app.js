// src/app.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const routes = require('./routes');
const resultRoutes = require('./routes/resultRoutes');
const imageRoutes = require('./routes/imageRoutes');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Serve static files from the public directory
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));

// Routes
app.use('/', routes);
app.use('/results', resultRoutes);
app.use('/images', imageRoutes);

module.exports = app;
