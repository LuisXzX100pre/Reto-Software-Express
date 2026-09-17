const jugadoresService = require('../services/jugadores_service');

const limpiar = (valor) => typeof valor === "string" ? valor.trim() : "";

const responderError = (res, error, mensajeGeneral) => {
    if (error.codigo === 'GAMERTAG_DUPLICADO' || error.codigo === 'CORREO_DUPLICADO') {
        return res.status(409).json({ mensaje: error.message });
    }
    if (error.codigo === 'JUGADOR_NO_EXISTE') {
        return res.status(404).json({ mensaje: error.message });
    }
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ mensaje: 'El gamertag ya está registrado' });
    }
    console.error(error);
    return res.status(500).json({ mensaje: mensajeGeneral });
};

const obtenerJugadores = async (req, res) => {
    try {
        const pagina = Math.max(parseInt(req.query.pagina) || 1, 1);
        const limite = Math.min(Math.max(parseInt(req.query.limite) || 10, 1), 50);
        res.json(await jugadoresService.obtenerJugadores(pagina, limite));
    } catch (error) {
        responderError(res, error, "Error al obtener los jugadores");
    }
};

const buscarJugadores = async (req, res) => {
    try {
        const termino = (req.query.q || "").trim();
        const pagina = Math.max(parseInt(req.query.pagina) || 1, 1);
        const limite = Math.min(Math.max(parseInt(req.query.limite) || 10, 1), 50);
        res.json(await jugadoresService.buscarJugadores(termino, pagina, limite));
    } catch (error) {
        responderError(res, error, "Error al buscar jugadores");
    }
};

const obtenerOpcionesJugadores = async (req, res) => {
    try {
        res.json(await jugadoresService.obtenerOpcionesJugadores());
    } catch (error) {
        responderError(res, error, "Error al obtener jugadores");
    }
};

const validarDatos = (body) => {
    const nombre = limpiar(body.nombre);
    const gamertag = limpiar(body.gamertag);
    const correo = limpiar(body.correo).toLowerCase();

    if (!nombre || !gamertag || !correo) {
        return { error: 'Nombre, gamertag y correo son obligatorios' };
    }
    if (!/^\S+@\S+\.\S+$/.test(correo)) {
        return { error: 'Ingresa un correo electrónico válido' };
    }
    return { nombre, gamertag, correo };
};

const registrarJugador = async (req, res) => {
    const datos = validarDatos(req.body);
    if (datos.error) return res.status(400).json({ mensaje: datos.error });

    try {
        const jugador = await jugadoresService.registrarJugador(datos);
        res.status(201).json({ mensaje: 'Jugador registrado correctamente', id: jugador.id });
    } catch (error) {
        responderError(res, error, 'Error al registrar jugador');
    }
};

const actualizarJugador = async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ mensaje: 'ID de jugador inválido' });
    }

    const datos = validarDatos(req.body);
    if (datos.error) return res.status(400).json({ mensaje: datos.error });

    try {
        await jugadoresService.actualizarJugador(id, datos);
        res.json({ mensaje: 'Jugador actualizado correctamente' });
    } catch (error) {
        responderError(res, error, 'Error al actualizar jugador');
    }
};

const eliminarJugador = async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ mensaje: 'ID de jugador inválido' });
    }

    try {
        await jugadoresService.eliminarJugador(id);
        res.json({ mensaje: 'Jugador eliminado correctamente' });
    } catch (error) {
        responderError(res, error, 'Error al eliminar jugador');
    }
};

module.exports = {
    obtenerJugadores,
    buscarJugadores,
    obtenerOpcionesJugadores,
    registrarJugador,
    actualizarJugador,
    eliminarJugador
};
