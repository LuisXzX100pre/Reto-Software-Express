const pool = require('../config/db');

const obtenerRanking = async (videojuegoId = null) => {
    const params = [];
    let filtro = '';

    if (videojuegoId !== null) {
        filtro = 'WHERE p.videojuego_id = ?';
        params.push(videojuegoId);
    }

    const [ranking] = await pool.query(`
        SELECT
            j.gamertag AS jugador,
            v.id AS videojuego_id,
            v.nombre AS videojuego,
            p.puntuacion,
            p.fecha
        FROM puntuaciones p
        INNER JOIN jugadores j
            ON p.jugador_id = j.id
        INNER JOIN videojuegos v
            ON p.videojuego_id = v.id
        ${filtro}
        ORDER BY p.puntuacion DESC, p.fecha ASC
    `, params);

    return ranking.map((registro, index) => ({
        posicion: index + 1,
        ...registro
    }));
};

module.exports = {
    obtenerRanking
};
