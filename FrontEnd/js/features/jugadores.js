import {
    apiGet,
    apiPost
} from "../api/api.js";

import {
    $,
    mensaje,
    esc
} from "../utils/ui.js";


const LIMITE = 10;

let paginaActual = 1;
let totalPaginas = 1;
let filtroActual = "";


// ==========================================
// FORMATEAR FECHA
// ==========================================

function formatearFecha(fecha) {

    if (!fecha) {
        return "—";
    }

    const fechaObjeto = new Date(fecha);

    if (Number.isNaN(fechaObjeto.getTime())) {
        return fecha;
    }

    return new Intl.DateTimeFormat(
        "es-MX",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    ).format(fechaObjeto);
}


// ==========================================
// PAGINACIÓN
// ==========================================

function actualizarPaginacion(paginacion) {

    paginaActual = paginacion.pagina;
    totalPaginas =
        paginacion.totalPaginas || 1;

    $("j-pagina-info").textContent =
        `Página ${paginaActual} de ${totalPaginas}`;

    $("j-anterior").disabled =
        paginaActual <= 1;

    $("j-siguiente").disabled =
        paginaActual >= totalPaginas;
}


// ==========================================
// CARGAR JUGADORES
// ==========================================

export async function cargarJugadores(
    filtro = filtroActual,
    pagina = paginaActual
) {

    const tbody = $("j-tabla");

    filtroActual = filtro;

    try {

        let ruta;

        if (filtroActual) {

            ruta =
                "/jugadores/buscar?q=" +
                encodeURIComponent(filtroActual) +
                `&pagina=${pagina}` +
                `&limite=${LIMITE}`;

        } else {

            ruta =
                `/jugadores?pagina=${pagina}` +
                `&limite=${LIMITE}`;
        }


        const respuesta =
            await apiGet(ruta);

        const jugadores =
            respuesta.datos;

        actualizarPaginacion(
            respuesta.paginacion
        );


        if (!jugadores.length) {

            tbody.innerHTML = `
                <tr>
                    <td
                        colspan="3"
                        class="vacio"
                    >
                        Sin jugadores
                    </td>
                </tr>
            `;

            return;
        }


        tbody.innerHTML = jugadores
            .map((jugador) => `
                <tr>
                    <td>
                        ${esc(jugador.gamertag)}
                    </td>

                    <td>
                        ${esc(jugador.correo)}
                    </td>

                    <td>
                        ${esc(
                formatearFecha(
                    jugador.fecha_registro
                )
            )}
                    </td>
                </tr>
            `)
            .join("");

    } catch (error) {

        console.error(
            "Error al cargar jugadores:",
            error
        );

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="3"
                    class="vacio"
                >
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

    const formulario =
        $("form-jugador");

    const nombre =
        $("j-nombre").value.trim();

    const gamertag =
        $("j-gamertag").value.trim();

    const correo =
        $("j-correo").value.trim();

    const boton =
        formulario.querySelector(
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

        await apiPost(
            "/jugadores",
            {
                nombre,
                gamertag,
                correo
            }
        );

        formulario.reset();

        mensaje(
            "Jugador registrado correctamente",
            "ok"
        );

        paginaActual = 1;
        filtroActual = "";

        $("j-buscar").value = "";

        await cargarJugadores("", 1);

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
// INICIALIZAR
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
                () => {

                    paginaActual = 1;

                    cargarJugadores(
                        termino,
                        1
                    );

                },
                250
            );
        }
    );


    $("form-buscar-jugador")
        .addEventListener(
            "submit",
            (event) => {
                event.preventDefault();
            }
        );


    $("j-anterior").addEventListener(
        "click",
        () => {

            if (paginaActual > 1) {

                cargarJugadores(
                    filtroActual,
                    paginaActual - 1
                );
            }
        }
    );


    $("j-siguiente").addEventListener(
        "click",
        () => {

            if (
                paginaActual <
                totalPaginas
            ) {

                cargarJugadores(
                    filtroActual,
                    paginaActual + 1
                );
            }
        }
    );
}