const jugadoresService = require('../services/jugadores.service');


const obtenerJugadores = async (req, res) => {
    try {

        const jugadores =
            await jugadoresService.obtenerJugadores();

        res.json(jugadores);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener jugadores'
        });
    }
};


const registrarJugador = async (req, res) => {
    try {

        const { nombre, gamertag, correo } = req.body;

        if (!nombre || !gamertag || !correo) {
            return res.status(400).json({
                mensaje:
                    'Nombre, gamertag y correo son obligatorios'
            });
        }

        const jugador =
            await jugadoresService.registrarJugador({
                nombre,
                gamertag,
                correo
            });

        res.status(201).json({
            mensaje: 'Jugador registrado correctamente',
            id: jugador.id
        });

    } catch (error) {

        console.error(error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensaje: 'El gamertag ya está registrado'
            });
        }

        res.status(500).json({
            mensaje: 'Error al registrar jugador'
        });
    }
};


const buscarJugadores = async (req, res) => {
    try {

        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                mensaje:
                    'Debes proporcionar un término de búsqueda'
            });
        }

        const jugadores =
            await jugadoresService.buscarJugadores(q);

        res.json(jugadores);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al buscar jugadores'
        });
    }
};


module.exports = {
    obtenerJugadores,
    registrarJugador,
    buscarJugadores
};