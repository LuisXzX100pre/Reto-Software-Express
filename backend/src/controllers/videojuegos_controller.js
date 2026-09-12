const videojuegosService =
    require('../services/videojuegos_service');


const obtenerVideojuegos = async (req, res) => {
    try {

        const videojuegos =
            await videojuegosService.obtenerVideojuegos();

        res.json(videojuegos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener videojuegos'
        });
    }
};


const registrarVideojuego = async (req, res) => {
    try {

        const { nombre, genero } = req.body;

        if (!nombre || !genero) {
            return res.status(400).json({
                mensaje: 'Nombre y género son obligatorios'
            });
        }

        const videojuego =
            await videojuegosService.registrarVideojuego({
                nombre,
                genero
            });

        res.status(201).json({
            mensaje: 'Videojuego registrado correctamente',
            id: videojuego.id
        });

    } catch (error) {

        console.error(error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensaje:
                    'El videojuego ya está registrado'
            });
        }

        res.status(500).json({
            mensaje: 'Error al registrar videojuego'
        });
    }
};


module.exports = {
    obtenerVideojuegos,
    registrarVideojuego
};