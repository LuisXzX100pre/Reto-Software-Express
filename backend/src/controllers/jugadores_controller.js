const jugadoresService = require('../services/jugadores_service');

const obtenerJugadores = async (req, res) => {

    try {

        const pagina = Math.max(
            parseInt(req.query.pagina) || 1,
            1
        );

        const limite = Math.min(
            Math.max(
                parseInt(req.query.limite) || 10,
                1
            ),
            50
        );

        const resultado =
            await jugadoresService.obtenerJugadores(
                pagina,
                limite
            );

        res.json(resultado);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje:
                "Error al obtener los jugadores"
        });
    }
};


const buscarJugadores = async (req, res) => {

    try {

        const termino =
            (req.query.q || "").trim();

        const pagina = Math.max(
            parseInt(req.query.pagina) || 1,
            1
        );

        const limite = Math.min(
            Math.max(
                parseInt(req.query.limite) || 10,
                1
            ),
            50
        );

        const resultado =
            await jugadoresService.buscarJugadores(
                termino,
                pagina,
                limite
            );

        res.json(resultado);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje:
                "Error al buscar jugadores"
        });
    }
};


const obtenerOpcionesJugadores = async (
    req,
    res
) => {

    try {

        const jugadores =
            await jugadoresService
                .obtenerOpcionesJugadores();

        res.json(jugadores);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje:
                "Error al obtener jugadores"
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


module.exports = {
    obtenerJugadores,
    buscarJugadores,
    obtenerOpcionesJugadores,
    registrarJugador
};