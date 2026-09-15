import { apiGet, apiPost } from "../api/api.js";
import { $, mensaje, esc } from "../utils/ui.js";


// ==========================================
// CARGAR / BUSCAR JUGADORES
// ==========================================

export async function cargarJugadores(filtro = "") {

    const tbody = $("j-tabla");

    try {

        const ruta = filtro
            ? "/jugadores/buscar?q=" + encodeURIComponent(filtro)
            : "/jugadores";

        const jugadores = await apiGet(ruta);

        if (!jugadores.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="3" class="vacio">
                        Sin jugadores
                    </td>
                </tr>
            `;

            return;
        }

        tbody.innerHTML = jugadores
            .map((jugador) => `
                <tr>
                    <td>${esc(jugador.gamertag)}</td>
                    <td>${esc(jugador.correo)}</td>
                    <td>${esc(jugador.fecha_registro)}</td>
                </tr>
            `)
            .join("");

    } catch (error) {

        console.error("Error al cargar jugadores:", error);

        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="vacio">
                    Error al cargar jugadores
                </td>
            </tr>
        `;
    }
}


// ==========================================
// REGISTRAR JUGADOR
// ==========================================

async function registrarJugador(event) {

    event.preventDefault();

    const formulario = $("form-jugador");

    const nombre = $("j-nombre").value.trim();
    const gamertag = $("j-gamertag").value.trim();
    const correo = $("j-correo").value.trim();

    const boton = formulario.querySelector(
        'button[type="submit"]'
    );

    if (!nombre || !gamertag || !correo) {

        mensaje(
            "Nombre, gamertag y correo son obligatorios",
            "err"
        );

        return;
    }

    try {

        boton.disabled = true;

        await apiPost("/jugadores", {
            nombre,
            gamertag,
            correo
        });

        formulario.reset();

        mensaje(
            "Jugador registrado correctamente",
            "ok"
        );

        await cargarJugadores();

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

export function inicializarJugadores() {

    $("form-jugador").addEventListener(
        "submit",
        registrarJugador
    );


    let buscarTimer;

    $("j-buscar").addEventListener(
        "input",
        (event) => {

            clearTimeout(buscarTimer);

            const termino =
                event.target.value.trim();

            buscarTimer = setTimeout(
                () => cargarJugadores(termino),
                250
            );
        }
    );


    $("form-buscar-jugador").addEventListener(
        "submit",
        (event) => {
            event.preventDefault();
        }
    );
}