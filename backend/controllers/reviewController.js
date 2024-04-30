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
    const { app_id, appName, review } = req.body;
    try {
      await db.none('INSERT INTO dataset (app_id, app_name, review_text, review_score, review_votes) VALUES ($1, $2, $3, $4, $5)', [app_id, appName, review, 1, 1]);
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
