const db = require('monk')(process.env.MONGODB_URI);

db.then(() => {
  console.log('Connected correctly to DB.');
}).catch(e => console.error(e));

module.exports = db;
