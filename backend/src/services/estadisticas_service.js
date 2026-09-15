const pool = require('../config/db');


const obtenerEstadisticas = async () => {

    const [resultado] = await pool.query(`
        SELECT

            (SELECT COUNT(*)
             FROM jugadores)
             AS total_jugadores,

            (SELECT COUNT(*)
             FROM videojuegos)
             AS total_videojuegos,

            (SELECT COUNT(*)
             FROM puntuaciones)
             AS total_puntuaciones,

            (
                SELECT IFNULL(
                    ROUND(AVG(puntuacion), 2),
                    0
                )
                FROM puntuaciones
            )
            AS puntuacion_promedio
    `);

    return resultado[0];
};


module.exports = {
    obtenerEstadisticas
};