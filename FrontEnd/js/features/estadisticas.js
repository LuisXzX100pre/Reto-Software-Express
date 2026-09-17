import { apiGet } from "../api/api.js";
import { $, mensaje } from "../utils/ui.js";


export async function cargarEstadisticas() {

    try {

        const estadisticas =
            await apiGet("/estadisticas");

        $("e-jugadores").textContent =
            estadisticas.total_jugadores;

        $("e-videojuegos").textContent =
            estadisticas.total_videojuegos;

        $("e-puntuaciones").textContent =
            estadisticas.total_puntuaciones;

        $("e-promedio").textContent =
            Math.round(
                estadisticas.puntuacion_promedio || 0
            );

    } catch (error) {

        console.error(error);

        mensaje(
            "No se pudieron cargar las estadísticas",
            "err"
        );
    }
}