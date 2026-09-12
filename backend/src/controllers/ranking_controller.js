const rankingService =
    require('../services/ranking.service');


const obtenerRanking = async (req, res) => {
    try {

        const ranking =
            await rankingService.obtenerRanking();

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