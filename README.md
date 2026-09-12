# Reto-Software-Express

Proyecto backend para la gestión de un torneo de videojuegos. La API permite registrar jugadores, videojuegos, puntuaciones, consultar rankings y visualizar estadísticas generales del sistema.

## Descripción

Este repositorio contiene la estructura base de una API REST desarrollada con Node.js y Express, conectada a una base de datos MySQL. Está orientada a la administración de competiciones de videojuegos donde cada jugador puede registrar su participación, asignar puntuaciones por videojuego y consultar el estado del torneo.

## Tecnologías

- Node.js
- Express
- MySQL
- mysql2
- dotenv
- cors
- express-validator

## Funcionalidades

- Registro y consulta de jugadores
- Búsqueda por gamertag
- Registro y consulta de videojuegos
- Registro de puntuaciones por jugador y videojuego
- Ranking general del torneo
- Estadísticas del sistema

## Estructura del proyecto

```text
Reto-Software-Express/
├── backend/
│   ├── db/
│   │   ├── consultas_prueba.sql
│   │   └── torneo_videojuegos.sql
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app,js
│   │   ├── server.js
│   │   └── ...
│   ├── .env
│   ├── README.md
│   └── package.json
└── README.md
```

## Requisitos

- Node.js v18 o superior
- MySQL 8.0+
- npm

## Configuración

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd Reto-Software-Express
```

2. Accede al backend:

```bash
cd backend
```

3. Instala las dependencias:

```bash
npm install
```

4. Crea un archivo `.env` con la siguiente estructura:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=torneo_videojuegos
DB_PORT=3306
PORT=3000
```

5. Crea la base de datos ejecutando el script SQL de la carpeta `db`:

```bash
mysql -u root -p < db/torneo_videojuegos.sql
```

6. Inicia el servidor:

```bash
npm run dev
```

La API quedará disponible en:

```text
http://localhost:3000/api
```

## Endpoints principales

### Jugadores

- `GET /api/jugadores`
- `POST /api/jugadores`
- `GET /api/jugadores/buscar?q=Ghost`

### Videojuegos

- `GET /api/videojuegos`
- `POST /api/videojuegos`

### Puntuaciones

- `GET /api/puntuaciones`
- `POST /api/puntuaciones`

### Ranking

- `GET /api/ranking`

### Estadísticas

- `GET /api/estadisticas`

## Ejemplos de uso

### Registrar jugador

```http
POST /api/jugadores
Content-Type: application/json

{
  "nombre": "Gael",
  "gamertag": "Ghost",
  "correo": "gael@email.com"
}
```

### Registrar videojuego

```http
POST /api/videojuegos
Content-Type: application/json

{
  "nombre": "Tekken 8",
  "genero": "Lucha"
}
```

### Registrar puntuación

```http
POST /api/puntuaciones
Content-Type: application/json

{
  "jugador_id": 1,
  "videojuego_id": 2,
  "puntuacion": 950
}
```