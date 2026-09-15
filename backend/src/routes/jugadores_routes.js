const express = require('express');

const {
    obtenerJugadores,
    registrarJugador,
    buscarJugadores
} = require('../controllers/jugadores_controller');

const router = express.Router();


router.get('/', obtenerJugadores);

router.post('/', registrarJugador);

router.get('/buscar', buscarJugadores);


module.exports = router;