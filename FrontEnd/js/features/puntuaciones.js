import { apiGet, apiPost } from "../api/api.js";
import { $, mensaje, esc } from "../utils/ui.js";


export async function cargarSelects() {

    try {

        const [jugadores, videojuegos] = await Promise.all([
            apiGet("/jugadores"),
            apiGet("/videojuegos")
        ]);

        $("p-jugador").innerHTML = jugadores
            .map((jugador) => `
                <option value="${jugador.id}">
                    ${esc(jugador.gamertag)}
                </option>
            `)
            .join("");

        $("p-videojuego").innerHTML = videojuegos
            .map((videojuego) => `
                <option value="${videojuego.id}">
                    ${esc(videojuego.nombre)}
                </option>
            `)
            .join("");

    } catch (error) {

        console.error(error);

        mensaje(
            "No se pudieron cargar jugadores y videojuegos",
            "err"
        );
    }
}


async function registrarPuntuacion() {

    const jugadorId = $("p-jugador").value;
    const videojuegoId = $("p-videojuego").value;
    const valor = $("p-puntuacion").value;

    if (!jugadorId || !videojuegoId) {

        mensaje(
            "Selecciona jugador y videojuego",
            "err"
        );

        return;
    }

    if (valor === "") {

        mensaje(
            "Introduce una puntuación",
            "err"
        );

        return;
    }

    const puntuacion = Number(valor);

    if (puntuacion < 0) {

        mensaje(
            "La puntuación no puede ser negativa",
            "err"
        );

        return;
    }

    try {

        await apiPost("/puntuaciones", {
            jugador_id: Number(jugadorId),
            videojuego_id: Number(videojuegoId),
            puntuacion
        });

        $("p-puntuacion").value = "";

        mensaje(
            "Puntuación registrada correctamente",
            "ok"
        );

    } catch (error) {

        mensaje(
            error.message,
            "err"
        );
    }
}


export function inicializarPuntuaciones() {

    $("p-guardar").addEventListener(
        "click",
        registrarPuntuacion
    );
}