const pgp = require('pg-promise')();

const connection = {
  host: 'localhost',
  port: 5432,
  database: 'game_review_portal',
  user: 'your_username',
  password: 'your_password'
};

const db = pgp(connection);

module.exports = db;
