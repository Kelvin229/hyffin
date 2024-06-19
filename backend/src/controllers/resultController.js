// src/controllers/resultController.js
const resultService = require('../services/resultService');

exports.getAllResults = (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { resultSet, nextPage, prevPage, totalPages } = resultService.getPaginatedResults(page, limit);
  res.json({ resultSet, nextPage, prevPage, totalPages });
};
