import { apiGet, apiPost } from "../api/api.js";
import { $, mensaje, esc } from "../utils/ui.js";


// ==========================================
// CARGAR / BUSCAR JUGADORES
// ==========================================

export async function cargarJugadores(filtro = "") {

    const tbody = $("j-tabla");

    try {

        const ruta = filtro
            ? "/jugadores/buscar?q=" +
              encodeURIComponent(filtro)
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

        console.error(error);

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

async function registrarJugador() {

    const nombre = $("j-nombre").value.trim();
    const gamertag = $("j-gamertag").value.trim();
    const correo = $("j-correo").value.trim();


    if (!nombre || !gamertag || !correo) {

        mensaje(
            "Nombre, gamertag y correo son obligatorios",
            "err"
        );

        return;
    }


    try {

        await apiPost("/jugadores", {
            nombre,
            gamertag,
            correo
        });


        $("j-nombre").value = "";
        $("j-gamertag").value = "";
        $("j-correo").value = "";


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
    }
}


// ==========================================
// INICIALIZAR FEATURE
// ==========================================

export function inicializarJugadores() {

    $("j-guardar")
        .addEventListener(
            "click",
            registrarJugador
        );


    let buscarTimer;


    $("j-buscar")
        .addEventListener(
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
}