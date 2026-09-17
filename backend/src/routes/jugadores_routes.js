const express = require("express");
const jugadoresController = require("../controllers/jugadores_controller");
const router = express.Router();

router.get("/", jugadoresController.obtenerJugadores);
router.get("/buscar", jugadoresController.buscarJugadores);
router.get("/opciones", jugadoresController.obtenerOpcionesJugadores);
router.post("/", jugadoresController.registrarJugador);
router.put("/:id", jugadoresController.actualizarJugador);
router.delete("/:id", jugadoresController.eliminarJugador);

module.exports = router;
