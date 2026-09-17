const videojuegosService = require('../services/videojuegos_service');

const responderError = (res, error, mensajeGeneral) => {
    if (error.codigo === 'VIDEOJUEGO_DUPLICADO' || error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ mensaje: 'El videojuego ya está registrado' });
    }
    if (error.codigo === 'VIDEOJUEGO_NO_EXISTE') {
        return res.status(404).json({ mensaje: error.message });
    }
    console.error(error);
    return res.status(500).json({ mensaje: mensajeGeneral });
};

const obtenerVideojuegos = async (req, res) => {
    try {
        res.json(await videojuegosService.obtenerVideojuegos());
    } catch (error) {
        responderError(res, error, 'Error al obtener videojuegos');
    }
};

const validarDatos = (body) => {
    const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
    const genero = typeof body.genero === 'string' ? body.genero.trim() : '';
    if (!nombre || !genero) return { error: 'Nombre y género son obligatorios' };
    return { nombre, genero };
};

const registrarVideojuego = async (req, res) => {
    const datos = validarDatos(req.body);
    if (datos.error) return res.status(400).json({ mensaje: datos.error });

    try {
        const videojuego = await videojuegosService.registrarVideojuego(datos);
        res.status(201).json({ mensaje: 'Videojuego registrado correctamente', id: videojuego.id });
    } catch (error) {
        responderError(res, error, 'Error al registrar videojuego');
    }
};

const actualizarVideojuego = async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ mensaje: 'ID de videojuego inválido' });
    }

    const datos = validarDatos(req.body);
    if (datos.error) return res.status(400).json({ mensaje: datos.error });

    try {
        await videojuegosService.actualizarVideojuego(id, datos);
        res.json({ mensaje: 'Videojuego actualizado correctamente' });
    } catch (error) {
        responderError(res, error, 'Error al actualizar videojuego');
    }
};

const eliminarVideojuego = async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ mensaje: 'ID de videojuego inválido' });
    }

    try {
        await videojuegosService.eliminarVideojuego(id);
        res.json({ mensaje: 'Videojuego eliminado correctamente' });
    } catch (error) {
        responderError(res, error, 'Error al eliminar videojuego');
    }
};

module.exports = {
    obtenerVideojuegos,
    registrarVideojuego,
    actualizarVideojuego,
    eliminarVideojuego
};
