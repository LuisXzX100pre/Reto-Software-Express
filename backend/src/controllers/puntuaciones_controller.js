const puntuacionesService = require('../services/puntuaciones_service');

const validarDatos = (body) => {
    const jugador_id = Number(body.jugador_id);
    const videojuego_id = Number(body.videojuego_id);
    const puntuacion = Number(body.puntuacion);

    if (!Number.isInteger(jugador_id) || jugador_id <= 0 ||
        !Number.isInteger(videojuego_id) || videojuego_id <= 0) {
        return { error: 'Jugador y videojuego son obligatorios' };
    }
    if (!Number.isFinite(puntuacion)) return { error: 'La puntuación debe ser un número' };
    if (puntuacion < 0) return { error: 'La puntuación no puede ser negativa' };

    return { jugador_id, videojuego_id, puntuacion };
};

const responderError = (res, error, mensajeGeneral) => {
    if (error.codigo === 'JUGADOR_NO_EXISTE' || error.codigo === 'VIDEOJUEGO_NO_EXISTE' || error.codigo === 'PUNTUACION_NO_EXISTE') {
        return res.status(404).json({ mensaje: error.message });
    }
    console.error(error);
    return res.status(500).json({ mensaje: mensajeGeneral });
};

const obtenerPuntuaciones = async (req, res) => {
    try {
        res.json(await puntuacionesService.obtenerPuntuaciones());
    } catch (error) {
        responderError(res, error, 'Error al obtener puntuaciones');
    }
};

const registrarPuntuacion = async (req, res) => {
    const datos = validarDatos(req.body);
    if (datos.error) return res.status(400).json({ mensaje: datos.error });

    try {
        const resultado = await puntuacionesService.registrarPuntuacion(datos);
        res.status(201).json({ mensaje: 'Puntuación registrada correctamente', id: resultado.id });
    } catch (error) {
        responderError(res, error, 'Error al registrar puntuación');
    }
};

const actualizarPuntuacion = async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ mensaje: 'ID de puntuación inválido' });
    }

    const datos = validarDatos(req.body);
    if (datos.error) return res.status(400).json({ mensaje: datos.error });

    try {
        await puntuacionesService.actualizarPuntuacion(id, datos);
        res.json({ mensaje: 'Puntuación actualizada correctamente' });
    } catch (error) {
        responderError(res, error, 'Error al actualizar puntuación');
    }
};

module.exports = {
    obtenerPuntuaciones,
    registrarPuntuacion,
    actualizarPuntuacion
};
