const pgp = require('pg-promise')();

const db = pgp({
  host: 'postgres',
  port: 5432,
  database: 'game-review-portal',
  user: 'postgres',
  password: 'password'
});

module.exports = db;
