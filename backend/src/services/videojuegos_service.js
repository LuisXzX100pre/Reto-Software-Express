const pool = require('../config/db');

const crearError = (codigo, mensaje) => {
    const error = new Error(mensaje);
    error.codigo = codigo;
    return error;
};

const validarDuplicado = async (nombre, excluirId = null) => {
    let sql = "SELECT id FROM videojuegos WHERE LOWER(nombre) = LOWER(?)";
    const params = [nombre];

    if (excluirId !== null) {
        sql += " AND id <> ?";
        params.push(excluirId);
    }

    const [coincidencias] = await pool.query(sql, params);
    if (coincidencias.length) {
        throw crearError("VIDEOJUEGO_DUPLICADO", "El videojuego ya está registrado");
    }
};

const obtenerVideojuegos = async () => {
    const [videojuegos] = await pool.query(
        `SELECT id, nombre, genero
         FROM videojuegos
         ORDER BY nombre`
    );
    return videojuegos;
};

const registrarVideojuego = async ({ nombre, genero }) => {
    await validarDuplicado(nombre);

    const [resultado] = await pool.query(
        `INSERT INTO videojuegos (nombre, genero)
         VALUES (?, ?)`,
        [nombre, genero]
    );
    return { id: resultado.insertId };
};

const actualizarVideojuego = async (id, { nombre, genero }) => {
    const [existente] = await pool.query(
        "SELECT id FROM videojuegos WHERE id = ?",
        [id]
    );
    if (!existente.length) {
        throw crearError("VIDEOJUEGO_NO_EXISTE", "El videojuego no existe");
    }

    await validarDuplicado(nombre, id);

    await pool.query(
        `UPDATE videojuegos
         SET nombre = ?, genero = ?
         WHERE id = ?`,
        [nombre, genero, id]
    );
    return { id };
};

const eliminarVideojuego = async (id) => {
    const [resultado] = await pool.query(
        "DELETE FROM videojuegos WHERE id = ?",
        [id]
    );
    if (!resultado.affectedRows) {
        throw crearError("VIDEOJUEGO_NO_EXISTE", "El videojuego no existe");
    }
    return { id };
};

module.exports = {
    obtenerVideojuegos,
    registrarVideojuego,
    actualizarVideojuego,
    eliminarVideojuego
};
