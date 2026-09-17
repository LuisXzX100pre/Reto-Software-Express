const express = require('express');
const {
    obtenerVideojuegos,
    registrarVideojuego,
    actualizarVideojuego,
    eliminarVideojuego
} = require('../controllers/videojuegos_controller');

const router = express.Router();
router.get('/', obtenerVideojuegos);
router.post('/', registrarVideojuego);
router.put('/:id', actualizarVideojuego);
router.delete('/:id', eliminarVideojuego);

module.exports = router;
