const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.get('/api/data', gameController.getGames);

module.exports = router;


