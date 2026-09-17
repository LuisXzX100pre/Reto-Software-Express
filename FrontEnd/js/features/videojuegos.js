import { apiGet, apiPost, apiPut, apiDelete } from "../api/api.js";
import { $, mensaje, esc, escAttr } from "../utils/ui.js";
import { abrirFormularioModal, confirmarModal, mostrarExitoModal } from "../utils/modal.js";

let videojuegosActuales = [];

export async function cargarVideojuegos() {
    const tbody = $("v-tabla");
    try {
        videojuegosActuales = await apiGet("/videojuegos");

        if (!videojuegosActuales.length) {
            tbody.innerHTML = `<tr><td colspan="3" class="vacio">Sin videojuegos</td></tr>`;
            return;
        }

        tbody.innerHTML = videojuegosActuales.map((videojuego) => `
            <tr>
                <td>${esc(videojuego.nombre)}</td>
                <td>${esc(videojuego.genero)}</td>
                <td class="acciones">
                    <button type="button" class="btn-accion btn-editar" data-editar-videojuego="${videojuego.id}">Editar</button>
                    <button type="button" class="btn-accion btn-eliminar" data-eliminar-videojuego="${videojuego.id}">Eliminar</button>
                </td>
            </tr>
        `).join("");
    } catch (error) {
        console.error("Error al cargar videojuegos:", error);
        tbody.innerHTML = `<tr><td colspan="3" class="vacio">Error al cargar videojuegos</td></tr>`;
    }
}

async function guardarVideojuego(event) {
    event.preventDefault();
    const nombre = $("v-nombre").value.trim();
    const genero = $("v-genero").value.trim();
    const boton = $("v-guardar");

    if (!nombre || !genero) {
        mensaje("Nombre y género son obligatorios", "err");
        return;
    }

    try {
        boton.disabled = true;
        await apiPost("/videojuegos", { nombre, genero });
        $("form-videojuego").reset();
        mensaje("Videojuego registrado correctamente", "ok");
        await cargarVideojuegos();
    } catch (error) {
        mensaje(error.message, "err");
    } finally {
        boton.disabled = false;
    }
}

function editarVideojuego(videojuego) {
    abrirFormularioModal({
        titulo: "Editar videojuego",
        descripcion: "Modifica el nombre o el género del videojuego.",
        textoGuardar: "Guardar cambios",
        camposHTML: `
            <label for="modal-v-nombre">Nombre</label>
            <input id="modal-v-nombre" name="nombre" type="text" maxlength="100" value="${escAttr(videojuego.nombre)}" required />
            <label for="modal-v-genero">Género</label>
            <input id="modal-v-genero" name="genero" type="text" maxlength="50" value="${escAttr(videojuego.genero)}" required />
        `,
        alGuardar: async (datos) => {
            const nombre = String(datos.get("nombre") || "").trim();
            const genero = String(datos.get("genero") || "").trim();
            if (!nombre || !genero) throw new Error("Completa todos los campos");

            await apiPut(`/videojuegos/${videojuego.id}`, { nombre, genero });
            await cargarVideojuegos();
            mostrarExitoModal("Cambios guardados", "El videojuego se actualizó correctamente.");
        }
    });
}

async function eliminarVideojuego(id) {
    const videojuego = videojuegosActuales.find((item) => item.id === id);
    const etiqueta = videojuego ? videojuego.nombre : `#${id}`;

    const confirmado = await confirmarModal({
        titulo: "Eliminar videojuego",
        texto: `¿Seguro que quieres eliminar ${esc(etiqueta)}?`,
        detalle: "Las puntuaciones asociadas a este videojuego también serán eliminadas.",
        textoConfirmar: "Sí, eliminar"
    });
    if (!confirmado) return;

    try {
        await apiDelete(`/videojuegos/${id}`);
        await cargarVideojuegos();
        mostrarExitoModal("Videojuego eliminado", "El registro se eliminó correctamente.");
    } catch (error) {
        mensaje(error.message, "err");
    }
}

export function inicializarVideojuegos() {
    $("form-videojuego").addEventListener("submit", guardarVideojuego);

    $("v-tabla").addEventListener("click", (event) => {
        const editar = event.target.closest("[data-editar-videojuego]");
        const eliminar = event.target.closest("[data-eliminar-videojuego]");

        if (editar) {
            const id = Number(editar.dataset.editarVideojuego);
            const videojuego = videojuegosActuales.find((item) => item.id === id);
            if (videojuego) editarVideojuego(videojuego);
        }
        if (eliminar) eliminarVideojuego(Number(eliminar.dataset.eliminarVideojuego));
    });
}
