const pool = require('../config/db');


const obtenerJugadores = async () => {

    const [jugadores] = await pool.query(`
        SELECT
            id,
            nombre,
            gamertag,
            correo,
            fecha_registro
        FROM jugadores
        ORDER BY fecha_registro DESC
    `);

    return jugadores;
};


const registrarJugador = async ({
    nombre,
    gamertag,
    correo
}) => {

    const [resultado] = await pool.query(`
        INSERT INTO jugadores (
            nombre,
            gamertag,
            correo
        )
        VALUES (?, ?, ?)
    `, [
        nombre,
        gamertag,
        correo
    ]);

    return {
        id: resultado.insertId
    };
};


const buscarJugadores = async (termino) => {

    const busqueda = `%${termino}%`;

    const [jugadores] = await pool.query(`
        SELECT
            id,
            nombre,
            gamertag,
            correo,
            fecha_registro
        FROM jugadores
        WHERE nombre LIKE ?
           OR gamertag LIKE ?
        ORDER BY nombre
    `, [
        busqueda,
        busqueda
    ]);

    return jugadores;
};


module.exports = {
    obtenerJugadores,
    registrarJugador,
    buscarJugadores
};