const pool = require("../config/db");

const crearError = (codigo, mensaje) => {
    const error = new Error(mensaje);
    error.codigo = codigo;
    return error;
};

const validarDuplicado = async ({ gamertag, correo, excluirId = null }) => {
    let sql = `
        SELECT id, gamertag, correo
        FROM jugadores
        WHERE (LOWER(gamertag) = LOWER(?) OR LOWER(correo) = LOWER(?))
    `;
    const params = [gamertag, correo];

    if (excluirId !== null) {
        sql += " AND id <> ?";
        params.push(excluirId);
    }

    const [coincidencias] = await pool.query(sql, params);

    for (const jugador of coincidencias) {
        if (String(jugador.gamertag).toLowerCase() === String(gamertag).toLowerCase()) {
            throw crearError("GAMERTAG_DUPLICADO", "El gamertag ya está registrado");
        }
        if (String(jugador.correo).toLowerCase() === String(correo).toLowerCase()) {
            throw crearError("CORREO_DUPLICADO", "El correo ya está registrado en otro jugador");
        }
    }
};

const obtenerJugadores = async (pagina, limite) => {
    const offset = (pagina - 1) * limite;

    const [jugadores] = await pool.query(
        `SELECT id, nombre, gamertag, correo, fecha_registro
         FROM jugadores
         ORDER BY fecha_registro DESC
         LIMIT ? OFFSET ?`,
        [limite, offset]
    );

    const [totalResultado] = await pool.query(
        "SELECT COUNT(*) AS total FROM jugadores"
    );

    const total = totalResultado[0].total;

    return {
        datos: jugadores,
        paginacion: {
            pagina,
            limite,
            total,
            totalPaginas: Math.max(Math.ceil(total / limite), 1)
        }
    };
};

const registrarJugador = async ({ nombre, gamertag, correo }) => {
    await validarDuplicado({ gamertag, correo });

    const [resultado] = await pool.query(
        `INSERT INTO jugadores (nombre, gamertag, correo)
         VALUES (?, ?, ?)`,
        [nombre, gamertag, correo]
    );

    return { id: resultado.insertId };
};

const actualizarJugador = async (id, { nombre, gamertag, correo }) => {
    const [existente] = await pool.query(
        "SELECT id FROM jugadores WHERE id = ?",
        [id]
    );

    if (!existente.length) {
        throw crearError("JUGADOR_NO_EXISTE", "El jugador no existe");
    }

    await validarDuplicado({ gamertag, correo, excluirId: id });

    await pool.query(
        `UPDATE jugadores
         SET nombre = ?, gamertag = ?, correo = ?
         WHERE id = ?`,
        [nombre, gamertag, correo, id]
    );

    return { id };
};

const eliminarJugador = async (id) => {
    const [resultado] = await pool.query(
        "DELETE FROM jugadores WHERE id = ?",
        [id]
    );

    if (!resultado.affectedRows) {
        throw crearError("JUGADOR_NO_EXISTE", "El jugador no existe");
    }

    return { id };
};

const buscarJugadores = async (termino, pagina, limite) => {
    const offset = (pagina - 1) * limite;
    const busqueda = `%${termino}%`;

    const [jugadores] = await pool.query(
        `SELECT id, nombre, gamertag, correo, fecha_registro
         FROM jugadores
         WHERE nombre LIKE ? OR gamertag LIKE ?
         ORDER BY fecha_registro DESC
         LIMIT ? OFFSET ?`,
        [busqueda, busqueda, limite, offset]
    );

    const [totalResultado] = await pool.query(
        `SELECT COUNT(*) AS total
         FROM jugadores
         WHERE nombre LIKE ? OR gamertag LIKE ?`,
        [busqueda, busqueda]
    );

    const total = totalResultado[0].total;

    return {
        datos: jugadores,
        paginacion: {
            pagina,
            limite,
            total,
            totalPaginas: Math.max(Math.ceil(total / limite), 1)
        }
    };
};

const obtenerOpcionesJugadores = async () => {
    const [jugadores] = await pool.query(
        `SELECT id, gamertag
         FROM jugadores
         ORDER BY gamertag ASC`
    );
    return jugadores;
};

module.exports = {
    obtenerJugadores,
    registrarJugador,
    actualizarJugador,
    eliminarJugador,
    buscarJugadores,
    obtenerOpcionesJugadores
};
