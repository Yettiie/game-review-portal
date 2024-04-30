const db = require('../db');

const gameController = {
  getGames: async (req, res) => {
    try {
      const games = await db.any('SELECT * FROM dataset LIMIT 100');
      res.json(games);
    } catch (error) {
      console.error('Error fetching games:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  addGame: async (req, res) => {
    const { name, platform, year, genre, publisher, na_sales, eu_sales, jp_sales, other_sales, global_sales } = req.body;
    
    let rank;

    // Name has to be unique
    const existingGame = await db.oneOrNone('SELECT * FROM vgsales WHERE name = $1 LIMIT 1', [name]);
    if (existingGame) {
      return res.status(400).json({ error: 'Game with the same name already exists' });
    }

    try {
      // Largest rank already present in the database
      const highestAppIdQuery = 'SELECT * FROM vgsales where rank is not null ORDER BY rank DESC LIMIT 1';
      const highestAppIdRecord = await db.oneOrNone(highestAppIdQuery);
      rank = highestAppIdRecord.rank+1;

      await db.none(
        `INSERT INTO vgsales (rank, name, platform, year, genre, publisher, na_sales, eu_sales, jp_sales, other_sales, global_sales) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, [rank, name, platform, year, genre, publisher, na_sales, eu_sales, jp_sales, other_sales, global_sales]
      );

      res.status(201).json({ message: 'Game added successfully' });
    } catch (error) {
      console.error('Error adding new game:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },



  updateGameDetails: async (req, res) => {
    const { id } = req.params;
    const { name, platform, year, genre, publisher, na_sales, eu_sales, jp_sales, other_sales, global_sales } = req.body;
    
    // Name has to be unique
    const existingGame = await db.oneOrNone('SELECT * FROM vgsales WHERE name = $1 AND rank != $2 LIMIT 1', [name, id]);
    if (existingGame) {
      return res.status(400).json({ error: 'Game with the same name already exists' });
    }


    try {

      await db.none(
        `UPDATE vgsales SET name = $1, platform = $2, year = $3, genre = $4, publisher = $5, na_sales = $6, eu_sales = $7, jp_sales = $8, other_sales = $9, global_sales = $10 WHERE rank = $11`, [name, platform, year, genre, publisher, na_sales, eu_sales, jp_sales, other_sales, global_sales, id]
      );

      res.json({ message: 'Game details updated successfully' });
    } catch (error) {
      console.error('Error updating game details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = gameController;
