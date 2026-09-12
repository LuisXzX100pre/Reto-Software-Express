const puntuacionesService =
    require('../services/puntuaciones.service');


const obtenerPuntuaciones = async (req, res) => {
    try {

        const puntuaciones =
            await puntuacionesService.obtenerPuntuaciones();

        res.json(puntuaciones);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener puntuaciones'
        });
    }
};


const registrarPuntuacion = async (req, res) => {
    try {

        const {
            jugador_id,
            videojuego_id,
            puntuacion
        } = req.body;

        if (
            jugador_id === undefined ||
            videojuego_id === undefined ||
            puntuacion === undefined
        ) {
            return res.status(400).json({
                mensaje:
                    'Jugador, videojuego y puntuación son obligatorios'
            });
        }

        const puntuacionNumero = Number(puntuacion);

        if (Number.isNaN(puntuacionNumero)) {
            return res.status(400).json({
                mensaje:
                    'La puntuación debe ser un número'
            });
        }

        if (puntuacionNumero < 0) {
            return res.status(400).json({
                mensaje:
                    'La puntuación no puede ser negativa'
            });
        }

        const resultado =
            await puntuacionesService.registrarPuntuacion({
                jugador_id,
                videojuego_id,
                puntuacion: puntuacionNumero
            });

        res.status(201).json({
            mensaje: 'Puntuación registrada correctamente',
            id: resultado.id
        });

    } catch (error) {

        console.error(error);

        if (error.codigo === 'JUGADOR_NO_EXISTE') {
            return res.status(404).json({
                mensaje: 'El jugador no existe'
            });
        }

        if (error.codigo === 'VIDEOJUEGO_NO_EXISTE') {
            return res.status(404).json({
                mensaje: 'El videojuego no existe'
            });
        }

        res.status(500).json({
            mensaje:
                'Error al registrar puntuación'
        });
    }
};


module.exports = {
    obtenerPuntuaciones,
    registrarPuntuacion
};