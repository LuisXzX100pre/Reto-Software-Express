import { apiGet } from "../api/api.js";
import { $, esc } from "../utils/ui.js";


export async function cargarRanking() {

    const tbody = $("r-tabla");

    try {

        const ranking = await apiGet("/ranking");

        tbody.innerHTML = ranking.length
            ? ranking
                .map((registro, index) => `
                    <tr>
                        <td>${registro.posicion ?? index + 1}</td>
                        <td>${esc(registro.jugador)}</td>
                        <td>${esc(registro.videojuego)}</td>
                        <td class="der">
                            ${registro.puntuacion}
                        </td>
                    </tr>
                `)
                .join("")
            : `
                <tr>
                    <td colspan="4" class="vacio">
                        Sin puntuaciones
                    </td>
                </tr>
            `;

    } catch (error) {

        console.error(error);

        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="vacio">
                    Error al cargar ranking
                </td>
            </tr>
        `;
    }
}