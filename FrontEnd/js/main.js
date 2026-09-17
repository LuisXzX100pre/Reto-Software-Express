import { inicializarTabs } from "./tabs.js";

import {
    inicializarJugadores,
    cargarJugadores
} from "./features/jugadores.js";

import {
    inicializarVideojuegos
} from "./features/videojuegos.js";

import {
    inicializarPuntuaciones
} from "./features/puntuaciones.js";


function iniciarAplicacion() {

    inicializarTabs();

    inicializarJugadores();

    inicializarVideojuegos();

    inicializarPuntuaciones();

    cargarJugadores();
}


iniciarAplicacion();