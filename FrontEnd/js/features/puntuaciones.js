import { apiGet, apiPost, apiPut } from "../api/api.js";
import { $, mensaje, esc, escAttr } from "../utils/ui.js";
import { abrirFormularioModal, mostrarExitoModal } from "../utils/modal.js";

let puntuacionesActuales = [];

function formatearFecha(fecha) {
    if (!fecha) return "—";
    const objeto = new Date(fecha);
    if (Number.isNaN(objeto.getTime())) return fecha;
    return new Intl.DateTimeFormat("es-MX", { dateStyle: "short", timeStyle: "short" }).format(objeto);
}

export async function cargarSelects() {
    const selectJugador = $("p-jugador");
    const selectVideojuego = $("p-videojuego");

    try {
        const [jugadores, videojuegos] = await Promise.all([
            apiGet("/jugadores/opciones"),
            apiGet("/videojuegos")
        ]);

        const jugadorSeleccionado = selectJugador.value;
        const videojuegoSeleccionado = selectVideojuego.value;

        selectJugador.innerHTML = `
            <option value="" disabled>Selecciona un jugador</option>
            ${jugadores.map((j) => `<option value="${j.id}">${esc(j.gamertag)}</option>`).join("")}
        `;
        selectVideojuego.innerHTML = `
            <option value="" disabled>Selecciona un videojuego</option>
            ${videojuegos.map((v) => `<option value="${v.id}">${esc(v.nombre)}</option>`).join("")}
        `;

        selectJugador.value = jugadorSeleccionado || "";
        selectVideojuego.value = videojuegoSeleccionado || "";
    } catch (error) {
        console.error("Error al cargar selects:", error);
        mensaje("No se pudieron cargar jugadores y videojuegos", "err");
    }
}

export async function cargarPuntuaciones() {
    const tbody = $("p-tabla");
    try {
        puntuacionesActuales = await apiGet("/puntuaciones");

        if (!puntuacionesActuales.length) {
            tbody.innerHTML = `<tr><td colspan="5" class="vacio">Sin puntuaciones</td></tr>`;
            return;
        }

        tbody.innerHTML = puntuacionesActuales.map((item) => `
            <tr>
                <td>${esc(item.gamertag)}</td>
                <td>${esc(item.videojuego)}</td>
                <td class="der">${esc(item.puntuacion)}</td>
                <td>${esc(formatearFecha(item.fecha))}</td>
                <td class="acciones">
                    <button type="button" class="btn-accion btn-editar" data-editar-puntuacion="${item.id}">Editar</button>
                </td>
            </tr>
        `).join("");
    } catch (error) {
        console.error("Error al cargar puntuaciones:", error);
        tbody.innerHTML = `<tr><td colspan="5" class="vacio">Error al cargar puntuaciones</td></tr>`;
    }
}

async function guardarPuntuacion(event) {
    event.preventDefault();
    const jugadorId = $("p-jugador").value;
    const videojuegoId = $("p-videojuego").value;
    const valor = $("p-puntuacion").value;
    const boton = $("p-guardar");

    if (!jugadorId || !videojuegoId) {
        mensaje("Selecciona un jugador y un videojuego", "err");
        return;
    }
    if (valor === "") {
        mensaje("Introduce una puntuación", "err");
        return;
    }

    const puntuacion = Number(valor);
    if (!Number.isFinite(puntuacion) || puntuacion < 0) {
        mensaje("La puntuación debe ser un número igual o mayor a 0", "err");
        return;
    }

    try {
        boton.disabled = true;
        await apiPost("/puntuaciones", {
            jugador_id: Number(jugadorId),
            videojuego_id: Number(videojuegoId),
            puntuacion
        });
        $("form-puntuacion").reset();
        mensaje("Puntuación registrada correctamente", "ok");
        await Promise.all([cargarSelects(), cargarPuntuaciones()]);
    } catch (error) {
        mensaje(error.message, "err");
    } finally {
        boton.disabled = false;
    }
}

async function editarPuntuacion(item) {
    try {
        const [jugadores, videojuegos] = await Promise.all([
            apiGet("/jugadores/opciones"),
            apiGet("/videojuegos")
        ]);

        const opcionesJugadores = jugadores.map((jugador) => `
            <option value="${jugador.id}" ${Number(jugador.id) === Number(item.jugador_id) ? "selected" : ""}>${esc(jugador.gamertag)}</option>
        `).join("");
        const opcionesVideojuegos = videojuegos.map((videojuego) => `
            <option value="${videojuego.id}" ${Number(videojuego.id) === Number(item.videojuego_id) ? "selected" : ""}>${esc(videojuego.nombre)}</option>
        `).join("");

        abrirFormularioModal({
            titulo: "Editar puntuación",
            descripcion: "Actualiza el participante, videojuego o puntaje.",
            textoGuardar: "Guardar cambios",
            camposHTML: `
                <label for="modal-p-jugador">Jugador</label>
                <select id="modal-p-jugador" name="jugador_id" required>${opcionesJugadores}</select>
                <label for="modal-p-videojuego">Videojuego</label>
                <select id="modal-p-videojuego" name="videojuego_id" required>${opcionesVideojuegos}</select>
                <label for="modal-p-puntuacion">Puntuación</label>
                <input id="modal-p-puntuacion" name="puntuacion" type="number" min="0" step="0.01" value="${escAttr(item.puntuacion)}" required />
            `,
            alGuardar: async (datos) => {
                const jugadorId = Number(datos.get("jugador_id"));
                const videojuegoId = Number(datos.get("videojuego_id"));
                const puntuacion = Number(datos.get("puntuacion"));

                if (!jugadorId || !videojuegoId) throw new Error("Selecciona jugador y videojuego");
                if (!Number.isFinite(puntuacion) || puntuacion < 0) throw new Error("La puntuación debe ser igual o mayor a 0");

                await apiPut(`/puntuaciones/${item.id}`, {
                    jugador_id: jugadorId,
                    videojuego_id: videojuegoId,
                    puntuacion
                });
                await cargarPuntuaciones();
                mostrarExitoModal("Puntuación actualizada", "Los cambios se guardaron correctamente.");
            }
        });
    } catch (error) {
        mensaje(error.message, "err");
    }
}

export function inicializarPuntuaciones() {
    $("form-puntuacion").addEventListener("submit", guardarPuntuacion);
    $("p-tabla").addEventListener("click", (event) => {
        const editar = event.target.closest("[data-editar-puntuacion]");
        if (!editar) return;
        const id = Number(editar.dataset.editarPuntuacion);
        const item = puntuacionesActuales.find((p) => p.id === id);
        if (item) editarPuntuacion(item);
    });
}
