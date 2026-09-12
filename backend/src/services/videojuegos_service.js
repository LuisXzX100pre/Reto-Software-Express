const pool = require('../config/db');


const obtenerVideojuegos = async () => {

    const [videojuegos] = await pool.query(`
        SELECT
            id,
            nombre,
            genero
        FROM videojuegos
        ORDER BY nombre
    `);

    return videojuegos;
};


const registrarVideojuego = async ({
    nombre,
    genero
}) => {

    const [resultado] = await pool.query(`
        INSERT INTO videojuegos (
            nombre,
            genero
        )
        VALUES (?, ?)
    `, [
        nombre,
        genero
    ]);

    return {
        id: resultado.insertId
    };
};


module.exports = {
    obtenerVideojuegos,
    registrarVideojuego
};