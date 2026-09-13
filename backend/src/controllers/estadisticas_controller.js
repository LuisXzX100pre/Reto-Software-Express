const estadisticasService =
    require('../services/estadisticas.service');


const obtenerEstadisticas = async (req, res) => {
    try {

        const estadisticas =
            await estadisticasService.obtenerEstadisticas();

        res.json(estadisticas);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje:
                'Error al obtener estadísticas'
        });
    }
};


module.exports = {
    obtenerEstadisticas
};