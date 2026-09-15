const pool = require('../config/db');


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

        INNER JOIN jugadores j
            ON p.jugador_id = j.id

        INNER JOIN videojuegos v
            ON p.videojuego_id = v.id

        ORDER BY p.fecha DESC
    `);

    return puntuaciones;
};


const registrarPuntuacion = async ({
    jugador_id,
    videojuego_id,
    puntuacion
}) => {

    const [jugadores] = await pool.query(
        'SELECT id FROM jugadores WHERE id = ?',
        [jugador_id]
    );

    if (jugadores.length === 0) {

        const error = new Error(
            'Jugador no encontrado'
        );

        error.codigo = 'JUGADOR_NO_EXISTE';

        throw error;
    }


    const [videojuegos] = await pool.query(
        'SELECT id FROM videojuegos WHERE id = ?',
        [videojuego_id]
    );

    if (videojuegos.length === 0) {

        const error = new Error(
            'Videojuego no encontrado'
        );

        error.codigo = 'VIDEOJUEGO_NO_EXISTE';

        throw error;
    }


    const [resultado] = await pool.query(`
        INSERT INTO puntuaciones (
            jugador_id,
            videojuego_id,
            puntuacion
        )
        VALUES (?, ?, ?)
    `, [
        jugador_id,
        videojuego_id,
        puntuacion
    ]);

    return {
        id: resultado.insertId
    };
};


module.exports = {
    obtenerPuntuaciones,
    registrarPuntuacion
};