const express = require('express');
const {
    obtenerPuntuaciones,
    registrarPuntuacion,
    actualizarPuntuacion
} = require('../controllers/puntuaciones_controller');

const router = express.Router();
router.get('/', obtenerPuntuaciones);
router.post('/', registrarPuntuacion);
router.put('/:id', actualizarPuntuacion);

module.exports = router;
