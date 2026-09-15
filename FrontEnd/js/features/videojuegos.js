import { apiGet, apiPost } from "../api/api.js";
import { $, mensaje, esc } from "../utils/ui.js";


export async function cargarVideojuegos() {

    const tbody = $("v-tabla");

    try {

        const videojuegos = await apiGet("/videojuegos");

        tbody.innerHTML = videojuegos.length
            ? videojuegos
                .map((videojuego) => `
                    <tr>
                        <td>${esc(videojuego.nombre)}</td>
                        <td>${esc(videojuego.genero)}</td>
                    </tr>
                `)
                .join("")
            : `
                <tr>
                    <td colspan="2" class="vacio">
                        Sin videojuegos
                    </td>
                </tr>
            `;

    } catch (error) {

        console.error(error);

        tbody.innerHTML = `
            <tr>
                <td colspan="2" class="vacio">
                    Error al cargar videojuegos
                </td>
            </tr>
        `;
    }
}


async function registrarVideojuego() {

    const nombre = $("v-nombre").value.trim();
    const genero = $("v-genero").value.trim();

    if (!nombre || !genero) {

        mensaje(
            "Nombre y género son obligatorios",
            "err"
        );

        return;
    }

    try {

        await apiPost("/videojuegos", {
            nombre,
            genero
        });

        $("v-nombre").value = "";
        $("v-genero").value = "";

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
    }
}


export function inicializarVideojuegos() {

    $("v-guardar").addEventListener(
        "click",
        registrarVideojuego
    );
}