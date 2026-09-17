const ROOT_ID = "modal-root";
let cerrarActual = null;
let ultimoFoco = null;

function root() {
    let nodo = document.getElementById(ROOT_ID);
    if (!nodo) {
        nodo = document.createElement("div");
        nodo.id = ROOT_ID;
        document.body.appendChild(nodo);
    }
    return nodo;
}

function bloquearPagina(bloquear) {
    document.body.classList.toggle("modal-abierto", bloquear);
}

function cerrarModal() {
    const nodo = root();
    nodo.innerHTML = "";
    nodo.className = "";
    document.removeEventListener("keydown", manejarEscape);
    bloquearPagina(false);
    cerrarActual = null;
    if (ultimoFoco && typeof ultimoFoco.focus === "function") ultimoFoco.focus();
    ultimoFoco = null;
}

function manejarEscape(event) {
    if (event.key === "Escape" && cerrarActual) cerrarActual();
}

function baseModal({ titulo, descripcion = "", contenido = "", clase = "" }) {
    const nodo = root();
    ultimoFoco = document.activeElement;
    nodo.className = "modal-root activo";
    nodo.innerHTML = `
        <div class="modal-backdrop" data-cerrar-modal></div>
        <section class="modal ${clase}" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
            <div class="modal-cabecera">
                <div>
                    <h2 id="modal-titulo">${titulo}</h2>
                    ${descripcion ? `<p>${descripcion}</p>` : ""}
                </div>
                <button type="button" class="modal-cerrar" data-cerrar-modal aria-label="Cerrar ventana">×</button>
            </div>
            <div class="modal-cuerpo">${contenido}</div>
        </section>
    `;

    cerrarActual = cerrarModal;
    bloquearPagina(true);
    document.addEventListener("keydown", manejarEscape);
    nodo.querySelectorAll("[data-cerrar-modal]").forEach((elemento) => {
        elemento.addEventListener("click", cerrarModal);
    });

    requestAnimationFrame(() => nodo.querySelector("input, select, button")?.focus());
    return nodo.querySelector(".modal");
}

export function abrirFormularioModal({ titulo, descripcion = "", camposHTML, textoGuardar = "Guardar", alGuardar }) {
    const modal = baseModal({
        titulo,
        descripcion,
        contenido: `
            <form class="modal-form" novalidate>
                <div class="modal-campos">${camposHTML}</div>
                <div class="modal-error" role="alert" aria-live="polite"></div>
                <div class="modal-acciones">
                    <button type="button" class="btn-modal btn-modal-secundario" data-cancelar>Cancelar</button>
                    <button type="submit" class="btn-modal btn-modal-primario">${textoGuardar}</button>
                </div>
            </form>
        `
    });

    const formulario = modal.querySelector(".modal-form");
    const errorBox = modal.querySelector(".modal-error");
    const guardar = modal.querySelector('[type="submit"]');
    modal.querySelector("[data-cancelar]").addEventListener("click", cerrarModal);

    formulario.addEventListener("submit", async (event) => {
        event.preventDefault();
        errorBox.textContent = "";
        errorBox.classList.remove("visible");

        try {
            guardar.disabled = true;
            guardar.textContent = "Guardando…";
            await alGuardar(new FormData(formulario), formulario);
        } catch (error) {
            errorBox.textContent = error.message || "No se pudo completar la operación";
            errorBox.classList.add("visible");
            guardar.disabled = false;
            guardar.textContent = textoGuardar;
        }
    });
}

export function mostrarExitoModal(titulo, texto) {
    const modal = baseModal({
        titulo: "",
        clase: "modal-exito",
        contenido: `
            <div class="estado-exito" aria-live="polite">
                <div class="check-exito" aria-hidden="true">
                    <svg viewBox="0 0 52 52" focusable="false">
                        <path d="M15 27.5 22.5 35 38 18.5" />
                    </svg>
                </div>
                <h2>${titulo}</h2>
                <p>${texto}</p>
                <button type="button" class="btn-modal btn-modal-primario" data-listo>Listo</button>
            </div>
        `
    });

    modal.querySelector(".modal-cabecera").remove();
    modal.querySelector("[data-listo]").addEventListener("click", cerrarModal);
    requestAnimationFrame(() => modal.querySelector("[data-listo]")?.focus());
}

export function confirmarModal({ titulo, texto, detalle = "", textoConfirmar = "Eliminar" }) {
    return new Promise((resolve) => {
        const modal = baseModal({
            titulo,
            descripcion: texto,
            clase: "modal-confirmacion",
            contenido: `
                ${detalle ? `<div class="modal-aviso">${detalle}</div>` : ""}
                <div class="modal-acciones">
                    <button type="button" class="btn-modal btn-modal-secundario" data-no>Cancelar</button>
                    <button type="button" class="btn-modal btn-modal-peligro" data-si>${textoConfirmar}</button>
                </div>
            `
        });

        const resolver = (valor) => {
            cerrarModal();
            resolve(valor);
        };

        modal.querySelector("[data-no]").addEventListener("click", () => resolver(false));
        modal.querySelector("[data-si]").addEventListener("click", () => resolver(true));

        // Si se cierra con X, backdrop o Escape, se considera cancelado.
        const cierreOriginal = cerrarActual;
        cerrarActual = () => {
            cierreOriginal();
            resolve(false);
        };
        root().querySelectorAll("[data-cerrar-modal]").forEach((elemento) => {
            elemento.replaceWith(elemento.cloneNode(true));
        });
        root().querySelectorAll("[data-cerrar-modal]").forEach((elemento) => {
            elemento.addEventListener("click", () => cerrarActual());
        });
    });
}
