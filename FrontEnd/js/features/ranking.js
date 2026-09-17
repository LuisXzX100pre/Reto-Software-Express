import { apiGet } from "../api/api.js";
import { $, esc } from "../utils/ui.js";

let selectorPreparado = false;

async function prepararSelectorRanking() {
    const select = $("r-videojuego");
    if (!select) return;

    try {
        const videojuegos = await apiGet("/videojuegos");
        const valorActual = select.value;

        select.innerHTML = `
            <option value="">Todos los videojuegos</option>
            ${videojuegos.map((videojuego) => `
                <option value="${videojuego.id}">${esc(videojuego.nombre)}</option>
            `).join("")}
        `;

        if ([...select.options].some((opcion) => opcion.value === valorActual)) {
            select.value = valorActual;
        }

        if (!selectorPreparado) {
            select.addEventListener("change", cargarRanking);
            selectorPreparado = true;
        }
    } catch (error) {
        console.error("No se pudo cargar el filtro de ranking:", error);
    }
}

export async function cargarRanking() {
    const tbody = $("r-tabla");
    const select = $("r-videojuego");

    if (!tbody) return;

    await prepararSelectorRanking();

    try {
        const videojuegoId = select?.value || "";
        const ruta = videojuegoId
            ? `/ranking?videojuego_id=${encodeURIComponent(videojuegoId)}`
            : "/ranking";

        const ranking = await apiGet(ruta);

        tbody.innerHTML = ranking.length
            ? ranking.map((registro, index) => `
                <tr>
                    <td>${registro.posicion ?? index + 1}</td>
                    <td>${esc(registro.jugador)}</td>
                    <td>${esc(registro.videojuego)}</td>
                    <td class="der">${registro.puntuacion}</td>
                </tr>
            `).join("")
            : `
                <tr>
                    <td colspan="4" class="vacio">
                        No hay puntuaciones para este videojuego
                    </td>
                </tr>
            `;
    } catch (error) {
        console.error(error);
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="vacio">Error al cargar ranking</td>
            </tr>
        `;
    }
}
