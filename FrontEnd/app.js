
const API = "http://localhost:3000";



const $ = (id) => document.getElementById(id);


function mensaje(texto, tipo) {        
  const box = $("mensaje");
  box.textContent = texto;
  box.className = "mensaje " + tipo;
  clearTimeout(box._t);
  box._t = setTimeout(() => (box.className = "mensaje"), 3000);
}


function esc(s) {
  const d = document.createElement("div");
  d.textContent = s == null ? "" : s;
  return d.innerHTML;
}

// GET genérico al backend
async function apiGet(ruta) {
  const res = await fetch(API + ruta);
  if (!res.ok) throw new Error("Error al consultar " + ruta);
  return res.json();
}

// POST genérico al backend
async function apiPost(ruta, cuerpo) {
  const res = await fetch(API + ruta, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cuerpo),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "No se pudo completar la operación");
  return data;
}



document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.tab;
    document.querySelectorAll(".tab").forEach((b) => b.classList.remove("activo"));
    btn.classList.add("activo");
    document.querySelectorAll(".panel").forEach((p) => p.classList.remove("activo"));
    $(id).classList.add("activo");

    if (id === "jugadores") cargarJugadores();
    if (id === "videojuegos") cargarVideojuegos();
    if (id === "puntuaciones") cargarSelects();
    if (id === "ranking") cargarRanking();
    if (id === "estadisticas") cargarEstadisticas();
  });
});




// RF04 — Consultar jugadores

async function cargarJugadores(filtro = "") {
  const tbody = $("j-tabla");
  try {
    const ruta = filtro
      ? "/jugadores/buscar?q=" + encodeURIComponent(filtro)
      : "/jugadores";
    const jugadores = await apiGet(ruta);

    if (!jugadores.length) {
      tbody.innerHTML = '<tr><td colspan="3" class="vacio">Sin jugadores</td></tr>';
      return;
    }

    tbody.innerHTML = jugadores
      .map(
        (j) =>
          `<tr><td>${esc(j.gamertag)}</td><td>${esc(j.correo)}</td><td>${esc(j.fecha_registro)}</td></tr>`
      )
      .join("");
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="3" class="vacio">Error al cargar</td></tr>';
  }
}


$("j-guardar").addEventListener("click", async () => {
  const nombre = $("j-nombre").value.trim();
  const gamertag = $("j-gamertag").value.trim();
  const correo = $("j-correo").value.trim();


  if (!nombre || !gamertag || !correo) {
    mensaje("Nombre, gamertag y correo son obligatorios", "err");
    return;
  }
  try {
    await apiPost("/jugadores", { nombre, gamertag, correo });
    $("j-nombre").value = "";
    $("j-gamertag").value = "";
    $("j-correo").value = "";
    mensaje("Jugador registrado", "ok");
    cargarJugadores();                 
  } catch (e) {
    mensaje(e.message, "err");         // ej. "Ese gamertag ya está registrado"
  }
});

let buscarTimer;
$("j-buscar").addEventListener("input", (e) => {
  clearTimeout(buscarTimer);
  const q = e.target.value.trim();
  buscarTimer = setTimeout(() => cargarJugadores(q), 250);
});



async function cargarVideojuegos() {
  const tbody = $("v-tabla");
  try {
    const juegos = await apiGet("/videojuegos");
    tbody.innerHTML = juegos.length
      ? juegos
          .map((v) => `<tr><td>${esc(v.nombre)}</td><td>${esc(v.genero)}</td></tr>`)
          .join("")
      : '<tr><td colspan="2" class="vacio">Sin videojuegos</td></tr>';
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="2" class="vacio">Error al cargar</td></tr>';
  }
}

// RF02 — Registrar videojuego

$("v-guardar").addEventListener("click", async () => {
  const nombre = $("v-nombre").value.trim();
  const genero = $("v-genero").value.trim();

  if (!nombre || !genero) {
    mensaje("Nombre y género son obligatorios", "err");
    return;
  }
  try {
    await apiPost("/videojuegos", { nombre, genero });
    $("v-nombre").value = "";
    $("v-genero").value = "";
    mensaje("Videojuego registrado", "ok");
    cargarVideojuegos();
  } catch (e) {
    mensaje(e.message, "err");         
  }
});





async function cargarSelects() {
  try {
    const [jugadores, juegos] = await Promise.all([
      apiGet("/jugadores"),
      apiGet("/videojuegos"),
    ]);
    $("p-jugador").innerHTML = jugadores
      .map((j) => `<option value="${j.id}">${esc(j.gamertag)}</option>`)
      .join("");
    $("p-videojuego").innerHTML = juegos
      .map((v) => `<option value="${v.id}">${esc(v.nombre)}</option>`)
      .join("");
  } catch (e) {
    mensaje("No se pudieron cargar jugadores/videojuegos", "err");
  }
}

// RF05 — Registrar puntuación

$("p-guardar").addEventListener("click", async () => {
  const jugador_id = $("p-jugador").value;
  const videojuego_id = $("p-videojuego").value;
  const valor = $("p-puntuacion").value;

  if (!jugador_id || !videojuego_id) {
    mensaje("Selecciona jugador y videojuego", "err");
    return;
  }
  if (valor === "") {
    mensaje("Introduce una puntuación", "err");
    return;
  }
  if (Number(valor) < 0) {
    mensaje("La puntuación no puede ser negativa", "err");
    return;
  }
  try {
    await apiPost("/puntuaciones", {
      jugador_id: Number(jugador_id),
      videojuego_id: Number(videojuego_id),
      puntuacion: Number(valor),
    });
    $("p-puntuacion").value = "";
    mensaje("Puntuación registrada", "ok");
  } catch (e) {
    mensaje(e.message, "err");
  }
});




// RF06 — Mostrar clasificación

async function cargarRanking() {
  const tbody = $("r-tabla");
  try {
    const filas = await apiGet("/ranking");
    tbody.innerHTML = filas.length
      ? filas
          .map(
            (r, i) =>
              `<tr><td>${i + 1}</td><td>${esc(r.jugador)}</td><td>${esc(r.videojuego)}</td><td class="der">${r.puntuacion}</td></tr>`
          )
          .join("")
      : '<tr><td colspan="4" class="vacio">Sin puntuaciones</td></tr>';
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="4" class="vacio">Error al cargar</td></tr>';
  }
}




// RF08 — Estadísticas


async function cargarEstadisticas() {
  try {
    const e = await apiGet("/estadisticas");
    $("e-jugadores").textContent = e.total_jugadores;
    $("e-videojuegos").textContent = e.total_videojuegos;
    $("e-puntuaciones").textContent = e.total_puntuaciones;
    $("e-promedio").textContent = Math.round(e.promedio || 0);
  } catch (err) {
    mensaje("No se pudieron cargar las estadísticas", "err");
  }
}



cargarJugadores();
