import { apiGet, apiPost } from "../api/api.js";
import { $, mensaje, esc } from "../utils/ui.js";


// ==========================================
// CARGAR JUGADORES Y VIDEOJUEGOS
// ==========================================

export async function cargarSelects() {

    const selectJugador =
        $("p-jugador");

    const selectVideojuego =
        $("p-videojuego");

    try {

        const [jugadores, videojuegos] =
            await Promise.all([
                apiGet("/jugadores"),
                apiGet("/videojuegos")
            ]);


        selectJugador.innerHTML = `
            <option value="" selected disabled>
                Selecciona un jugador
            </option>

            ${jugadores
                .map((jugador) => `
                    <option value="${jugador.id}">
                        ${esc(jugador.gamertag)}
                    </option>
                `)
                .join("")}
        `;


        selectVideojuego.innerHTML = `
            <option value="" selected disabled>
                Selecciona un videojuego
            </option>

            ${videojuegos
                .map((videojuego) => `
                    <option value="${videojuego.id}">
                        ${esc(videojuego.nombre)}
                    </option>
                `)
                .join("")}
        `;

    } catch (error) {

        console.error(
            "Error al cargar selects:",
            error
        );

        mensaje(
            "No se pudieron cargar jugadores y videojuegos",
            "err"
        );
    }
}


// ==========================================
// REGISTRAR PUNTUACIÓN
// ==========================================

async function registrarPuntuacion(event) {

    event.preventDefault();

    const formulario =
        $("form-puntuacion");

    const jugadorId =
        $("p-jugador").value;

    const videojuegoId =
        $("p-videojuego").value;

    const valor =
        $("p-puntuacion").value;

    const boton = formulario.querySelector(
        'button[type="submit"]'
    );


    if (!jugadorId || !videojuegoId) {

        mensaje(
            "Selecciona un jugador y un videojuego",
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


    const puntuacion =
        Number(valor);


    if (!Number.isFinite(puntuacion)) {

        mensaje(
            "La puntuación debe ser un número válido",
            "err"
        );

        return;
    }


    if (puntuacion < 0) {

        mensaje(
            "La puntuación no puede ser negativa",
            "err"
        );

        return;
    }


    try {

        boton.disabled = true;

        await apiPost("/puntuaciones", {
            jugador_id: Number(jugadorId),
            videojuego_id: Number(videojuegoId),
            puntuacion
        });

        formulario.reset();

        mensaje(
            "Puntuación registrada correctamente",
            "ok"
        );

    } catch (error) {

        mensaje(
            error.message,
            "err"
        );

    } finally {

        boton.disabled = false;
    }
}


// ==========================================
// INICIALIZAR FEATURE
// ==========================================

export function inicializarPuntuaciones() {

    $("form-puntuacion").addEventListener(
        "submit",
        registrarPuntuacion
    );
}