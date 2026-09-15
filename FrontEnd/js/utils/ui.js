export const $ = (id) => {
    return document.getElementById(id);
};


export function mensaje(texto, tipo) {

    const box = $("mensaje");

    box.textContent = texto;

    box.className = "mensaje " + tipo;


    clearTimeout(box._t);


    box._t = setTimeout(() => {

        box.className = "mensaje";

    }, 3000);
}


export function esc(valor) {

    const div = document.createElement("div");

    div.textContent =
        valor == null ? "" : valor;

    return div.innerHTML;
}