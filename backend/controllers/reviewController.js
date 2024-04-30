const db = require('../db');

const reviewController = {
  getReviews: async (req, res) => {
    const { appName } = req.query;
    try {
      const reviews = await db.any('SELECT * FROM dataset WHERE app_name = $1', [appName]);
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  addReview: async (req, res) => {
    const {appName, review} = req.body;

    const existingGame = await db.oneOrNone('SELECT * FROM dataset WHERE app_name = $1 LIMIT 1', [appName]);

    let app_id;
    if (existingGame) {
      app_id = existingGame.app_id;
    } 
    else{
      const highestAppIdQuery = 'SELECT * FROM dataset where app_id is not null ORDER BY app_id DESC LIMIT 1';
      const highestAppIdRecord = await db.oneOrNone(highestAppIdQuery);

      app_id = highestAppIdRecord.app_id+1;
    }

    


    try {

      await db.none('INSERT INTO dataset (app_id, app_name, review_text, review_score, review_votes) VALUES ($1, $2, $3, $4, $5)', [app_id, appName, review, 1, 0]);
      res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  deleteReview: async (req, res) => {
    const { id } = req.params;
    try {
      await db.none('DELETE FROM dataset WHERE id = $1', [id]);
      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = reviewController;
