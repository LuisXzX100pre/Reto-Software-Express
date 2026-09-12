require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        mensaje: 'Backend del Torneo de Videojuegos funcionando'
    });
});

// Probar conexión con MySQL
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 AS conectado');

        res.json({
            mensaje: 'Conexión con MySQL correcta',
            resultado: rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error al conectar con MySQL',
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});