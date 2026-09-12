const express = require('express');

const {
    obtenerVideojuegos,
    registrarVideojuego
} = require('../controllers/videojuegos.controller');

const router = express.Router();

router.get('/', obtenerVideojuegos);
router.post('/', registrarVideojuego);

module.exports = router;