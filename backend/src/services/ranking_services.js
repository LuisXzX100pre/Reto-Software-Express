const pool = require('../config/db');


const obtenerRanking = async () => {

    const [ranking] = await pool.query(`
        SELECT
            j.gamertag AS jugador,
            v.nombre AS videojuego,
            p.puntuacion,
            p.fecha
        FROM puntuaciones p

        INNER JOIN jugadores j
            ON p.jugador_id = j.id

        INNER JOIN videojuegos v
            ON p.videojuego_id = v.id

        ORDER BY p.puntuacion DESC
    `);

    return ranking.map((registro, index) => ({
        posicion: index + 1,
        ...registro
    }));
};


module.exports = {
    obtenerRanking
};