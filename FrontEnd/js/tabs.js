import { cargarJugadores } from "./features/jugadores.js";
import { cargarVideojuegos } from "./features/videojuegos.js";
import { cargarSelects } from "./features/puntuaciones.js";
import { cargarRanking } from "./features/ranking.js";
import { cargarEstadisticas } from "./features/estadisticas.js";


export function inicializarTabs() {

    document.querySelectorAll(".tab").forEach((btn) => {

        btn.addEventListener("click", () => {

            const id = btn.dataset.tab;

            document.querySelectorAll(".tab").forEach((boton) => {
                boton.classList.remove("activo");
            });

            btn.classList.add("activo");


            document.querySelectorAll(".panel").forEach((panel) => {
                panel.classList.remove("activo");
            });

            document
                .getElementById(id)
                .classList.add("activo");


            if (id === "jugadores") {
                cargarJugadores();
            }

            if (id === "videojuegos") {
                cargarVideojuegos();
            }

            if (id === "puntuaciones") {
                cargarSelects();
            }

            if (id === "ranking") {
                cargarRanking();
            }

            if (id === "estadisticas") {
                cargarEstadisticas();
            }
        });
    });
}