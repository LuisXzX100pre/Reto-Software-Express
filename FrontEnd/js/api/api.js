const API_URL = "http://localhost:3000/api";


export async function apiGet(ruta) {
    const res = await fetch(API_URL + ruta);

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(
            data.mensaje ||
            data.error ||
            "Error al realizar la consulta"
        );
    }

    return data;
}


export async function apiPost(ruta, cuerpo) {
    const res = await fetch(API_URL + ruta, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(cuerpo)
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(
            data.mensaje ||
            data.error ||
            "No se pudo completar la operación"
        );
    }

    return data;
}