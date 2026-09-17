const pool = require('../config/db');

const crearError = (codigo, mensaje) => {
    const error = new Error(mensaje);
    error.codigo = codigo;
    return error;
};

const validarReferencias = async (jugador_id, videojuego_id) => {
    const [jugadores] = await pool.query('SELECT id FROM jugadores WHERE id = ?', [jugador_id]);
    if (!jugadores.length) throw crearError('JUGADOR_NO_EXISTE', 'El jugador no existe');

    const [videojuegos] = await pool.query('SELECT id FROM videojuegos WHERE id = ?', [videojuego_id]);
    if (!videojuegos.length) throw crearError('VIDEOJUEGO_NO_EXISTE', 'El videojuego no existe');
};

const obtenerPuntuaciones = async () => {
    const [puntuaciones] = await pool.query(`
        SELECT
            p.id,
            p.jugador_id,
            j.nombre AS nombre_jugador,
            j.gamertag,
            p.videojuego_id,
            v.nombre AS videojuego,
            p.puntuacion,
            p.fecha
        FROM puntuaciones p
        INNER JOIN jugadores j ON p.jugador_id = j.id
        INNER JOIN videojuegos v ON p.videojuego_id = v.id
        ORDER BY p.fecha DESC
    `);
    return puntuaciones;
};

const registrarPuntuacion = async ({ jugador_id, videojuego_id, puntuacion }) => {
    await validarReferencias(jugador_id, videojuego_id);

    const [resultado] = await pool.query(
        `INSERT INTO puntuaciones (jugador_id, videojuego_id, puntuacion)
         VALUES (?, ?, ?)`,
        [jugador_id, videojuego_id, puntuacion]
    );
    return { id: resultado.insertId };
};

const actualizarPuntuacion = async (id, { jugador_id, videojuego_id, puntuacion }) => {
    const [existente] = await pool.query('SELECT id FROM puntuaciones WHERE id = ?', [id]);
    if (!existente.length) throw crearError('PUNTUACION_NO_EXISTE', 'La puntuación no existe');

    await validarReferencias(jugador_id, videojuego_id);

    await pool.query(
        `UPDATE puntuaciones
         SET jugador_id = ?, videojuego_id = ?, puntuacion = ?
         WHERE id = ?`,
        [jugador_id, videojuego_id, puntuacion, id]
    );
    return { id };
};

module.exports = {
    obtenerPuntuaciones,
    registrarPuntuacion,
    actualizarPuntuacion
};
