# API de Torneo de Videojuegos

Backend desarrollado con Node.js + Express para gestionar un torneo de videojuegos.

## Base URL

```text
http://localhost:3000/api
```

## Descripción

La API permite:

- Registrar y consultar jugadores
- Registrar videojuegos
- Registrar puntuaciones
- Consultar rankings
- Consultar estadísticas generales del torneo

## Requisitos

- Node.js 18+
- MySQL 8+
- npm

## Instalación

```bash
cd backend
npm install
```

Crea un archivo `.env` con la siguiente configuración:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=torneo_videojuegos
DB_PORT=3306
PORT=3000
```

Luego inicia el servidor:

```bash
npm run dev
```

## Endpoints

### 1. Jugadores

#### GET /api/jugadores
Obtiene todos los jugadores registrados.

#### POST /api/jugadores
Registra un nuevo jugador.

Ejemplo de cuerpo:

```json
{
  "nombre": "Gael",
  "gamertag": "Ghost",
  "correo": "gael@email.com"
}
```

#### GET /api/jugadores/buscar?q=Ghost
Busca jugadores por término en el gamertag o nombre.

---

### 2. Videojuegos

#### GET /api/videojuegos
Obtiene todos los videojuegos registrados.

#### POST /api/videojuegos
Registra un nuevo videojuego.

Ejemplo de cuerpo:

```json
{
  "nombre": "Tekken 8",
  "genero": "Lucha"
}
```

---

### 3. Puntuaciones

#### GET /api/puntuaciones
Obtiene el historial de puntuaciones.

#### POST /api/puntuaciones
Registra una nueva puntuación.

Ejemplo de cuerpo:

```json
{
  "jugador_id": 1,
  "videojuego_id": 2,
  "puntuacion": 950
}
```

---

### 4. Ranking

#### GET /api/ranking
Consulta el ranking general basado en las puntuaciones registradas.

---

### 5. Estadísticas

#### GET /api/estadisticas
Consulta estadísticas del sistema o del torneo.

---

## Respuestas comunes

### 201 Created
Respuesta exitosa en creación de registros.

### 400 Bad Request
Datos faltantes o inválidos.

### 404 Not Found
Jugador o videojuego inexistente.

### 409 Conflict
Registro duplicado, por ejemplo un gamertag o videojuego ya existente.

### 500 Internal Server Error
Error interno del servidor.

## Estructura del backend

```text
backend/
├── db/
│   ├── consultas_prueba.sql
│   └── torneo_videojuegos.sql
├── src/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── app,js
│   ├── server.js
│   └── ...
├── package.json
├── README.md
└── .env
```