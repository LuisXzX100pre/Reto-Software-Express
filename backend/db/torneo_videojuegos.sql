CREATE DATABASE IF NOT EXISTS torneo_videojuegos;

USE torneo_videojuegos;

-- ==========================================
-- TABLA: jugadores
-- ==========================================
CREATE TABLE jugadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    gamertag VARCHAR(50) NOT NULL UNIQUE,
    correo VARCHAR(150) NOT NULL,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- TABLA: videojuegos
-- ==========================================
CREATE TABLE videojuegos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    genero VARCHAR(50) NOT NULL
);

-- ==========================================
-- TABLA: puntuaciones
-- ==========================================
CREATE TABLE puntuaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    jugador_id INT NOT NULL,
    videojuego_id INT NOT NULL,
    puntuacion DECIMAL(10,2) NOT NULL,
    fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_puntuacion_jugador
        FOREIGN KEY (jugador_id)
        REFERENCES jugadores(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_puntuacion_videojuego
        FOREIGN KEY (videojuego_id)
        REFERENCES videojuegos(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT chk_puntuacion_no_negativa
        CHECK (puntuacion >= 0)
);