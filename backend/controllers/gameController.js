const db = require('../db');

const gameController = {
  getGames: async (req, res) => {
    try {
      const games = await db.any('SELECT * FROM dataset LIMIT 10');
      res.json(games);
    } catch (error) {
      console.error('Error fetching games:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = gameController;
