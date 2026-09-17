import { apiGet, apiPost, apiPut, apiDelete } from "../api/api.js";
import { $, mensaje, esc, escAttr } from "../utils/ui.js";
import { abrirFormularioModal, confirmarModal, mostrarExitoModal } from "../utils/modal.js";

const LIMITE = 10;
let paginaActual = 1;
let totalPaginas = 1;
let filtroActual = "";
let jugadoresPagina = [];

function formatearFecha(fecha) {
    if (!fecha) return "—";
    const objeto = new Date(fecha);
    if (Number.isNaN(objeto.getTime())) return fecha;
    return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" }).format(objeto);
}

function actualizarPaginacion(paginacion) {
    paginaActual = paginacion.pagina;
    totalPaginas = paginacion.totalPaginas || 1;
    $("j-pagina-info").textContent = `Página ${paginaActual} de ${totalPaginas}`;
    $("j-anterior").disabled = paginaActual <= 1;
    $("j-siguiente").disabled = paginaActual >= totalPaginas;
}

export async function cargarJugadores(filtro = filtroActual, pagina = paginaActual) {
    const tbody = $("j-tabla");
    filtroActual = filtro;

    try {
        const ruta = filtroActual
            ? "/jugadores/buscar?q=" + encodeURIComponent(filtroActual) + `&pagina=${pagina}&limite=${LIMITE}`
            : `/jugadores?pagina=${pagina}&limite=${LIMITE}`;

        const respuesta = await apiGet(ruta);

        if (pagina > respuesta.paginacion.totalPaginas && respuesta.paginacion.total > 0) {
            return cargarJugadores(filtroActual, respuesta.paginacion.totalPaginas);
        }

        jugadoresPagina = respuesta.datos;
        actualizarPaginacion(respuesta.paginacion);

        if (!jugadoresPagina.length) {
            tbody.innerHTML = `<tr><td colspan="5" class="vacio">Sin jugadores</td></tr>`;
            return;
        }

        tbody.innerHTML = jugadoresPagina.map((jugador) => `
            <tr>
                <td>${esc(jugador.nombre)}</td>
                <td>${esc(jugador.gamertag)}</td>
                <td>${esc(jugador.correo)}</td>
                <td>${esc(formatearFecha(jugador.fecha_registro))}</td>
                <td class="acciones">
                    <button type="button" class="btn-accion btn-editar" data-editar-jugador="${jugador.id}">Editar</button>
                    <button type="button" class="btn-accion btn-eliminar" data-eliminar-jugador="${jugador.id}">Eliminar</button>
                </td>
            </tr>
        `).join("");
    } catch (error) {
        console.error("Error al cargar jugadores:", error);
        tbody.innerHTML = `<tr><td colspan="5" class="vacio">Error al cargar jugadores</td></tr>`;
    }
}

async function guardarJugador(event) {
    event.preventDefault();
    const nombre = $("j-nombre").value.trim();
    const gamertag = $("j-gamertag").value.trim();
    const correo = $("j-correo").value.trim();
    const boton = $("j-guardar");

    if (!nombre || !gamertag || !correo) {
        mensaje("Nombre, gamertag y correo son obligatorios", "err");
        return;
    }

    try {
        boton.disabled = true;
        await apiPost("/jugadores", { nombre, gamertag, correo });
        $("form-jugador").reset();
        mensaje("Jugador registrado correctamente", "ok");
        paginaActual = 1;
        filtroActual = "";
        $("j-buscar").value = "";
        await cargarJugadores("", 1);
    } catch (error) {
        mensaje(error.message, "err");
    } finally {
        boton.disabled = false;
    }
}

function editarJugador(jugador) {
    abrirFormularioModal({
        titulo: "Editar jugador",
        descripcion: `Actualiza la información de ${esc(jugador.gamertag)}.`,
        textoGuardar: "Guardar cambios",
        camposHTML: `
            <label for="modal-j-nombre">Nombre</label>
            <input id="modal-j-nombre" name="nombre" type="text" maxlength="100" value="${escAttr(jugador.nombre)}" required />
            <label for="modal-j-gamertag">Gamertag</label>
            <input id="modal-j-gamertag" name="gamertag" type="text" maxlength="50" value="${escAttr(jugador.gamertag)}" required />
            <label for="modal-j-correo">Correo electrónico</label>
            <input id="modal-j-correo" name="correo" type="email" maxlength="150" value="${escAttr(jugador.correo)}" required />
        `,
        alGuardar: async (datos) => {
            const nombre = String(datos.get("nombre") || "").trim();
            const gamertag = String(datos.get("gamertag") || "").trim();
            const correo = String(datos.get("correo") || "").trim();
            if (!nombre || !gamertag || !correo) throw new Error("Completa todos los campos");

            await apiPut(`/jugadores/${jugador.id}`, { nombre, gamertag, correo });
            await cargarJugadores(filtroActual, paginaActual);
            mostrarExitoModal("Cambios guardados", "El jugador se actualizó correctamente.");
        }
    });
}

async function eliminarJugador(id) {
    const jugador = jugadoresPagina.find((item) => item.id === id);
    const etiqueta = jugador ? jugador.gamertag : `#${id}`;

    const confirmado = await confirmarModal({
        titulo: "Eliminar jugador",
        texto: `¿Seguro que quieres eliminar a ${esc(etiqueta)}?`,
        detalle: "Sus puntuaciones asociadas también serán eliminadas.",
        textoConfirmar: "Sí, eliminar"
    });
    if (!confirmado) return;

    try {
        await apiDelete(`/jugadores/${id}`);
        await cargarJugadores(filtroActual, paginaActual);
        mostrarExitoModal("Jugador eliminado", "El registro se eliminó correctamente.");
    } catch (error) {
        mensaje(error.message, "err");
    }
}

export function inicializarJugadores() {
    $("form-jugador").addEventListener("submit", guardarJugador);

    $("j-tabla").addEventListener("click", (event) => {
        const editar = event.target.closest("[data-editar-jugador]");
        const eliminar = event.target.closest("[data-eliminar-jugador]");

        if (editar) {
            const id = Number(editar.dataset.editarJugador);
            const jugador = jugadoresPagina.find((item) => item.id === id);
            if (jugador) editarJugador(jugador);
        }
        if (eliminar) eliminarJugador(Number(eliminar.dataset.eliminarJugador));
    });

    let buscarTimer;
    $("j-buscar").addEventListener("input", (event) => {
        clearTimeout(buscarTimer);
        const termino = event.target.value.trim();
        buscarTimer = setTimeout(() => {
            paginaActual = 1;
            cargarJugadores(termino, 1);
        }, 250);
    });

    $("form-buscar-jugador").addEventListener("submit", (event) => event.preventDefault());
    $("j-anterior").addEventListener("click", () => {
        if (paginaActual > 1) cargarJugadores(filtroActual, paginaActual - 1);
    });
    $("j-siguiente").addEventListener("click", () => {
        if (paginaActual < totalPaginas) cargarJugadores(filtroActual, paginaActual + 1);
    });
}
