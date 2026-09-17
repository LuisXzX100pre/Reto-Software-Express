import { apiGet } from "../api/api.js";
import { $, mensaje, esc } from "../utils/ui.js";

let estadisticasActuales = null;
let selectorPreparado = false;

function pintarDetalleVideojuego() {
    const select = $("e-videojuego");
    const promedio = $("e-promedio");
    const puntuacionesJuego = $("e-puntuaciones-juego");
    const mejorPuntuacion = $("e-mejor");
    const nombreSeleccionado = $("e-seleccion-nombre");

    if (!estadisticasActuales || !select) return;

    const id = Number(select.value);
    const detalle = estadisticasActuales.por_videojuego.find(
        (item) => Number(item.videojuego_id) === id
    );

    if (!detalle) {
        promedio.textContent = "—";
        puntuacionesJuego.textContent = "—";
        mejorPuntuacion.textContent = "—";
        nombreSeleccionado.textContent = "Selecciona un videojuego para ver sus datos";
        return;
    }

    promedio.textContent = Number(detalle.puntuacion_promedio || 0).toLocaleString("es-MX", {
        maximumFractionDigits: 2
    });
    puntuacionesJuego.textContent = detalle.total_puntuaciones;
    mejorPuntuacion.textContent = Number(detalle.mejor_puntuacion || 0).toLocaleString("es-MX");
    nombreSeleccionado.textContent = `${detalle.videojuego} · ${detalle.genero}`;
}

function pintarTablaPromedios() {
    const tbody = $("e-tabla-juegos");
    if (!tbody || !estadisticasActuales) return;

    const filas = estadisticasActuales.por_videojuego;

    tbody.innerHTML = filas.length
        ? filas.map((item) => `
            <tr>
                <td>${esc(item.videojuego)}</td>
                <td>${esc(item.genero)}</td>
                <td class="der">${item.total_puntuaciones}</td>
                <td class="der">${Number(item.puntuacion_promedio || 0).toLocaleString("es-MX", { maximumFractionDigits: 2 })}</td>
                <td class="der">${Number(item.mejor_puntuacion || 0).toLocaleString("es-MX")}</td>
            </tr>
        `).join("")
        : `<tr><td colspan="5" class="vacio">No hay videojuegos registrados</td></tr>`;
}

function prepararSelector() {
    const select = $("e-videojuego");
    if (!select || !estadisticasActuales) return;

    const valorActual = select.value;

    select.innerHTML = `
        <option value="">Selecciona un videojuego</option>
        ${estadisticasActuales.por_videojuego.map((item) => `
            <option value="${item.videojuego_id}">${esc(item.videojuego)}</option>
        `).join("")}
    `;

    if ([...select.options].some((opcion) => opcion.value === valorActual)) {
        select.value = valorActual;
    }

    if (!selectorPreparado) {
        select.addEventListener("change", pintarDetalleVideojuego);
        selectorPreparado = true;
    }
}

export async function cargarEstadisticas() {
    try {
        estadisticasActuales = await apiGet("/estadisticas");

        $("e-jugadores").textContent = estadisticasActuales.total_jugadores;
        $("e-videojuegos").textContent = estadisticasActuales.total_videojuegos;
        $("e-puntuaciones").textContent = estadisticasActuales.total_puntuaciones;

        prepararSelector();
        pintarDetalleVideojuego();
        pintarTablaPromedios();
    } catch (error) {
        console.error(error);
        mensaje("No se pudieron cargar las estadísticas", "err");
    }
}
