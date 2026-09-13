Reporte de pruebas QA



CP-BE-001: Arranque del backend



\- Responsable: Luis Fernando Núñez Chan.

\- Rama evaluada: feature/backend.

\- Commit evaluado: 8d103b7.

\- Entorno: Windows, Node.js v24.13.1 y npm 11.8.0.

\- Objetivo: comprobar que el servidor inicia correctamente.



Procedimiento:

1\. Abrir una terminal en la carpeta backend.

2\. Ejecutar npm ci.

3\. Ejecutar npm start.



Resultado esperado:

El servidor inicia y permanece escuchando en el puerto configurado.



Resultado obtenido:

La instalación de dependencias terminó correctamente.

El servidor no inició y mostró:

Error: Cannot find module './app'

Código: MODULE\_NOT\_FOUND.



Estado :

FALLIDO.



Error BUG-001

1\. Causa identificada: el archivo backend/src/app,js tiene una coma

&#x20; en lugar de un punto; server.js intenta cargar ./app.

\-Severidad: bloqueante para las pruebas de la API.

\- Corrección propuesta: renombrar app,js a app.js.

\- Estado de corrección: pendiente.

\- Reprueba: pendiente.



Evidencia del fallo:



!\[Error al iniciar el backend: Cannot find module './app'](evidencias/CP-BE-001-error-arranque.png)





Las pruebas funcionales de la API quedan bloqueadas hasta

resolver el arranque. Todavía no se ha verificado MySQL.

