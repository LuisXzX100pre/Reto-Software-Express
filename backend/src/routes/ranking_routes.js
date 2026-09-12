const express = require('express');

const {
    obtenerRanking
} = require('../controllers/ranking.controller');

const router = express.Router();

router.get('/', obtenerRanking);

module.exports = router;