// src/services/resultService.js
const results = Array.from({ length: 21 }, (_, index) => ({
  resultId: `result${index + 1}`,
  thumbnail: `/assets/thumbnails/thumbnail${(index ) + 1}.jpg`,
}));

exports.getPaginatedResults = (page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const resultSet = results.slice(startIndex, endIndex);
  const totalPages = Math.ceil(results.length / limit);

  const nextPage = endIndex < results.length ? page + 1 : null;
  const prevPage = startIndex > 0 ? page - 1 : null;

  return { resultSet, nextPage, prevPage, totalPages };
};
