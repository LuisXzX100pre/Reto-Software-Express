import { apiGet, apiPost } from "../api/api.js";
import { $, mensaje, esc } from "../utils/ui.js";


// ==========================================
// CARGAR VIDEOJUEGOS
// ==========================================

export async function cargarVideojuegos() {

    const tbody = $("v-tabla");

    try {

        const videojuegos =
            await apiGet("/videojuegos");

        if (!videojuegos.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="2" class="vacio">
                        Sin videojuegos
                    </td>
                </tr>
            `;

            return;
        }

        tbody.innerHTML = videojuegos
            .map((videojuego) => `
                <tr>
                    <td>${esc(videojuego.nombre)}</td>
                    <td>${esc(videojuego.genero)}</td>
                </tr>
            `)
            .join("");

    } catch (error) {

        console.error(
            "Error al cargar videojuegos:",
            error
        );

        tbody.innerHTML = `
            <tr>
                <td colspan="2" class="vacio">
                    Error al cargar videojuegos
                </td>
            </tr>
        `;
    }
}


// ==========================================
// REGISTRAR VIDEOJUEGO
// ==========================================

async function registrarVideojuego(event) {

    event.preventDefault();

    const formulario =
        $("form-videojuego");

    const nombre =
        $("v-nombre").value.trim();

    const genero =
        $("v-genero").value.trim();

    const boton = formulario.querySelector(
        'button[type="submit"]'
    );

    if (!nombre || !genero) {

        mensaje(
            "Nombre y género son obligatorios",
            "err"
        );

        return;
    }

    try {

        boton.disabled = true;

        await apiPost("/videojuegos", {
            nombre,
            genero
        });

        formulario.reset();

        mensaje(
            "Videojuego registrado correctamente",
            "ok"
        );

        await cargarVideojuegos();

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

export function inicializarVideojuegos() {

    $("form-videojuego").addEventListener(
        "submit",
        registrarVideojuego
    );
}