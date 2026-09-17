const rankingService = require('../services/ranking_services');

const obtenerRanking = async (req, res) => {
    try {
        const valor = req.query.videojuego_id;
        let videojuegoId = null;

        if (valor !== undefined && valor !== '') {
            videojuegoId = Number(valor);

            if (!Number.isInteger(videojuegoId) || videojuegoId <= 0) {
                return res.status(400).json({
                    mensaje: 'El videojuego seleccionado no es válido'
                });
            }
        }

        const ranking = await rankingService.obtenerRanking(videojuegoId);
        res.json(ranking);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener ranking'
        });
    }
};

module.exports = {
    obtenerRanking
};
