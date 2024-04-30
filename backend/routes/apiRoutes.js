const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.get('/api/data', gameController.getGames);
router.post('/api/data', gameController.addGame);
router.put('/api/data/:id', gameController.updateGameDetails);

module.exports = router;


