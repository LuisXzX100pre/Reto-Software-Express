USE torneo_videojuegos;

-- Consultar jugadores
SELECT 
    gamertag,
    correo,
    fecha_registro
FROM jugadores;

-- Buscar jugador por nombre o gamertag
SELECT *
FROM jugadores
WHERE nombre LIKE '%Shadow%'
   OR gamertag LIKE '%Shadow%';

-- Ranking
SELECT
    ROW_NUMBER() OVER (ORDER BY puntuacion DESC) AS posicion,
    j.gamertag AS jugador,
    v.nombre AS videojuego,
    p.puntuacion
FROM puntuaciones p
INNER JOIN jugadores j 
    ON p.jugador_id = j.id
INNER JOIN videojuegos v 
    ON p.videojuego_id = v.id
ORDER BY p.puntuacion DESC;

-- Número total de jugadores
SELECT COUNT(*) AS total_jugadores
FROM jugadores;

-- Número total de videojuegos
SELECT COUNT(*) AS total_videojuegos
FROM videojuegos;

-- Número total de puntuaciones
SELECT COUNT(*) AS total_puntuaciones
FROM puntuaciones;

-- Puntuación promedio
SELECT AVG(puntuacion) AS puntuacion_promedio
FROM puntuaciones;