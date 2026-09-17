const express = require('express');

const {
    obtenerEstadisticas
} = require('../controllers/estadisticas_controller');

const router = express.Router();

router.get('/', obtenerEstadisticas);

module.exports = router;