const express = require('express');
const cors = require('cors');

const jugadoresRoutes = require('./routes/jugadores_routes.js');
const videojuegosRoutes = require('./routes/videojuegos_routes');
const puntuacionesRoutes = require('./routes/puntuaciones_routes');
const rankingRoutes = require('./routes/ranking_routes');
const estadisticasRoutes = require('./routes/estadisticas_routes');

const app = express();

app.use(cors());
app.use(express.json());


// Ruta principal
app.get('/', (req, res) => {
    res.json({
        mensaje: 'Backend del Torneo de Videojuegos funcionando'
    });
});


// Rutas de la API
app.use('/api/jugadores', jugadoresRoutes);
app.use('/api/videojuegos', videojuegosRoutes);
app.use('/api/puntuaciones', puntuacionesRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/estadisticas', estadisticasRoutes);


module.exports = app;