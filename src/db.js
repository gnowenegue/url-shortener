const db = require('monk')(process.env.MONGODB_URI);

module.exports = db;
