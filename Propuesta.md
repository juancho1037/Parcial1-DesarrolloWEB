# Proyecto final del curso de Desarrollo de Aplicaciones Web 2024-1

## Acerca del proyecto

En este proyecto se desarrollará una aplicación web llamada **Planificador de Viajes**, que permitirá a los usuarios explorar destinos, crear y gestionar itinerarios personalizados para sus viajes. El objetivo es poner en práctica los conceptos aprendidos a lo largo del curso, incluyendo el desarrollo frontend y backend, la implementación de una API REST y el despliegue de la aplicación utilizando Docker.

## Funcionalidades principales

<ul>
  <li><strong>Explorar destinos:</strong> Disponible para usuarios no registrados e incluirá:
    <ul>
      <li>Una barra de búsqueda para que los usuarios puedan encontrar destinos específicos.</li>
      <li>Una sección de destinos populares.</li>
      <li>Exploración por categorías: Playa, Montaña, Ciudad, Aventura.</li>
      <li>Experiencias destacadas, donde se resaltarán actividades interesantes en los destinos.</li>
      <li>Favoritos temporales: Los usuarios pueden marcar destinos como favoritos durante la sesión.</li>
      <li>Ofertas especiales: Promociones limitadas en ciertos destinos o actividades.</li>
      <li>Previsualización de itinerarios: Ofrecer una vista previa de itinerarios generados automáticamente.</li>
      <li>Reseñas y valoraciones: Mostrar reseñas y valoraciones de otros usuarios sobre los destinos.</li>
    </ul>
  </li>
  <li><strong>Usuarios registrados:</strong> Los usuarios registrados tendrán acceso a las siguientes funcionalidades:
    <ul>
      <li>Creación de viajes: Los usuarios podrán crear nuevos viajes especificando el destino, fechas y número de días.</li>
      <li>Añadir actividades: Cada viaje puede incluir actividades o lugares a visitar, organizadas por categorías (turismo, gastronomía, etc.).</li>
      <li>Generación de itinerario: El sistema generará automáticamente un itinerario basado en las actividades asignadas a cada día del viaje.</li>
      <li>Gestión de usuarios: Los usuarios podrán registrarse e iniciar sesión para crear, editar y eliminar sus viajes y actividades.</li>
      <li>Visualización del itinerario: Los usuarios podrán ver su itinerario completo, con las actividades planificadas para cada día del viaje.</li>
    </ul>
  </li>
</ul>

## Estructura del proyecto

<ul>
  <li><strong>Frontend:</strong> El frontend se implementará usando **Vue**, junto con **Vuetify**, **Bootstrap** y/o **MUI**, para permitir a los usuarios interactuar con el sistema y gestionar sus viajes.</li>
  <li><strong>Backend (Node.js):</strong> Proveerá las rutas de la API REST para la gestión de viajes, actividades y exploración de destinos. Las rutas principales serán:
    <ul>
      <li><code>GET /explore</code>: Obtener los destinos populares, categorías y experiencias destacadas.</li>
      <li><code>GET /trips</code>: Obtener la lista de viajes del usuario registrado.</li>
      <li><code>POST /trips</code>: Crear un nuevo viaje.</li>
      <li><code>GET /trips/{id}</code>: Obtener detalles de un viaje específico.</li>
      <li><code>PUT /trips/{id}</code>: Actualizar un viaje existente.</li>
      <li><code>DELETE /trips/{id}</code>: Eliminar un viaje.</li>
      <li><code>GET /trips/{id}/activities</code>: Obtener actividades de un viaje.</li>
      <li><code>POST /trips/{id}/activities</code>: Añadir una actividad a un viaje.</li>
      <li><code>DELETE /trips/{id}/activities/{activityId}</code>: Eliminar una actividad de un viaje.</li>
    </ul>
  </li>
  <li><strong>Base de Datos (SQL):</strong> La aplicación utilizará una base de datos SQL con las siguientes tablas:
    <ul>
      <li><strong>Usuarios:</strong> Información de los usuarios (id, nombre, correo, contraseña).</li>
      <li><strong>Viajes:</strong> Datos de los viajes creados por los usuarios (id, usuario_id, destino, fechas).</li>
      <li><strong>Actividades:</strong> Actividades asignadas a cada viaje (id, viaje_id, nombre, categoría, día del itinerario).</li>
      <li><strong>Destinos:</strong> Información de los destinos, categorías y experiencias para la funcionalidad de explorar.</li>
      <li><strong>Reseñas:</strong> Opiniones y valoraciones sobre los destinos y actividades.</li>
    </ul>
  </li>
</ul>

## Despliegue en Docker

El proyecto se desplegará utilizando contenedores Docker. Se crearán los siguientes contenedores:
<ul>
  <li>Contenedor para el <strong>backend</strong> en Node.js.</li>
  <li>Contenedor para la <strong>base de datos</strong> SQL.</li>
  <li>Contenedor para el <strong>frontend</strong> (servidor web).</li>
</ul>
Se utilizará <strong>Docker Compose</strong> para gestionar los servicios y la comunicación entre los contenedores.

## Mejoras futuras

<ul>
  <li>Integración de APIs externas como Google Maps o Yelp para enriquecer la información de los destinos y actividades.</li>
  <li>Implementación de recordatorios y notificaciones para actividades próximas.</li>
  <li>Funcionalidad para compartir itinerarios con otros usuarios.</li>
</ul>

