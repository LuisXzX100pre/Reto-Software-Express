const API_URL = "http://localhost:3000/api";

async function procesarRespuesta(response, mensajeDefault) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.mensaje ||
            data.error ||
            mensajeDefault
        );
    }

    return data;
}

export async function apiGet(ruta) {
    const response = await fetch(API_URL + ruta);
    return procesarRespuesta(response, "Error al realizar la consulta");
}

export async function apiPost(ruta, cuerpo) {
    const response = await fetch(API_URL + ruta, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpo)
    });

    return procesarRespuesta(response, "No se pudo completar la operación");
}

export async function apiPut(ruta, cuerpo) {
    const response = await fetch(API_URL + ruta, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpo)
    });

    return procesarRespuesta(response, "No se pudo actualizar la información");
}

export async function apiDelete(ruta) {
    const response = await fetch(API_URL + ruta, {
        method: "DELETE"
    });

    return procesarRespuesta(response, "No se pudo eliminar el registro");
}
