const pool = require("../config/db");


const obtenerJugadores = async (pagina, limite) => {

    const offset = (pagina - 1) * limite;

    const [jugadores] = await pool.query(
        `
        SELECT
            id,
            nombre,
            gamertag,
            correo,
            fecha_registro
        FROM jugadores
        ORDER BY fecha_registro DESC
        LIMIT ? OFFSET ?
        `,
        [limite, offset]
    );

    const [totalResultado] = await pool.query(`
        SELECT COUNT(*) AS total
        FROM jugadores
    `);

    const total = totalResultado[0].total;

    return {
        datos: jugadores,
        paginacion: {
            pagina,
            limite,
            total,
            totalPaginas: Math.ceil(total / limite)
        }
    };
};


const registrarJugador = async ({
    nombre,
    gamertag,
    correo
}) => {

    const [resultado] = await pool.query(
        `
        INSERT INTO jugadores (
            nombre,
            gamertag,
            correo
        )
        VALUES (?, ?, ?)
        `,
        [nombre, gamertag, correo]
    );

    return resultado.insertId;
};


const buscarJugadores = async (
    termino,
    pagina,
    limite
) => {

    const offset = (pagina - 1) * limite;

    const busqueda = `%${termino}%`;

    const [jugadores] = await pool.query(
        `
        SELECT
            id,
            nombre,
            gamertag,
            correo,
            fecha_registro
        FROM jugadores
        WHERE nombre LIKE ?
           OR gamertag LIKE ?
        ORDER BY fecha_registro DESC
        LIMIT ? OFFSET ?
        `,
        [
            busqueda,
            busqueda,
            limite,
            offset
        ]
    );

    const [totalResultado] = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM jugadores
        WHERE nombre LIKE ?
           OR gamertag LIKE ?
        `,
        [busqueda, busqueda]
    );

    const total = totalResultado[0].total;

    return {
        datos: jugadores,
        paginacion: {
            pagina,
            limite,
            total,
            totalPaginas: Math.ceil(total / limite)
        }
    };
};


const obtenerOpcionesJugadores = async () => {

    const [jugadores] = await pool.query(
        `
        SELECT
            id,
            gamertag
        FROM jugadores
        ORDER BY gamertag ASC
        `
    );

    return jugadores;
};


module.exports = {
    obtenerJugadores,
    registrarJugador,
    buscarJugadores,
    obtenerOpcionesJugadores
};