const pool = require('../config/db');

const obtenerEstadisticas = async () => {
    const [totales] = await pool.query(`
        SELECT
            (SELECT COUNT(*) FROM jugadores) AS total_jugadores,
            (SELECT COUNT(*) FROM videojuegos) AS total_videojuegos,
            (SELECT COUNT(*) FROM puntuaciones) AS total_puntuaciones
    `);

    const [porVideojuego] = await pool.query(`
        SELECT
            v.id AS videojuego_id,
            v.nombre AS videojuego,
            v.genero,
            COUNT(p.id) AS total_puntuaciones,
            IFNULL(ROUND(AVG(p.puntuacion), 2), 0) AS puntuacion_promedio,
            IFNULL(MAX(p.puntuacion), 0) AS mejor_puntuacion
        FROM videojuegos v
        LEFT JOIN puntuaciones p
            ON p.videojuego_id = v.id
        GROUP BY v.id, v.nombre, v.genero
        ORDER BY v.nombre ASC
    `);

    return {
        ...totales[0],
        por_videojuego: porVideojuego
    };
};

module.exports = {
    obtenerEstadisticas
};
