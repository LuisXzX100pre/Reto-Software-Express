const express = require("express");

const router = express.Router();

const jugadoresController =
    require("../controllers/jugadores_controller");


router.get(
    "/",
    jugadoresController.obtenerJugadores
);

router.get(
    "/buscar",
    jugadoresController.buscarJugadores
);

router.get(
    "/opciones",
    jugadoresController.obtenerOpcionesJugadores
);


router.post(
    "/",
    jugadoresController.registrarJugador
);


module.exports = router;