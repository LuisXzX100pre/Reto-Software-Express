const express = require('express');

const {
    obtenerPuntuaciones,
    registrarPuntuacion
} = require('../controllers/puntuaciones.controller');

const router = express.Router();

router.get('/', obtenerPuntuaciones);
router.post('/', registrarPuntuacion);

module.exports = router;