# MundialScore

MundialScore es una aplicación web completa para la gestión de pronósticos deportivos para el mundial o torneos de fútbol. Permite a los usuarios registrarse, realizar predicciones sobre los resultados de los partidos y competir en una tabla de clasificación basada en los puntos obtenidos por sus aciertos.

## Admin

La aplicacion cuenta con un admin por defecto con las credenciales: Email: "admin@gmail.com" Contraseña: 1234 

## 🚀 Características Principales

- **Autenticación y Seguridad:** Registro e inicio de sesión seguro mediante JWT (JSON Web Tokens). Manejo de roles (Usuario y Administrador).
- **Gestión de Partidos (Admin):** Los administradores pueden crear partidos y actualizar los marcadores finales.
- **Sistema de Predicciones:** Los usuarios pueden ingresar sus pronósticos (goles local vs goles visitante) para los partidos pendientes.
- **Cálculo Automático de Puntos:**
  - **5 Puntos:** Resultado exacto (ej. Predicción 2-1, Resultado 2-1).
  - **3 Puntos:** Acertar al ganador o empate, pero no el resultado exacto (ej. Predicción 2-0, Resultado 3-1).
  - **1 Punto:** Acertar la cantidad de goles de al menos un equipo (ej. Predicción 1-1, Resultado 1-3).
  - **0 Puntos:** No acertar nada.
- **Tabla de Clasificación (Leaderboard):** Ranking en tiempo real de todos los usuarios ordenados por sus puntos totales.
- **Interfaz Moderna:** Diseño responsivo y atractivo utilizando React y Tailwind CSS.

## 🛠️ Stack Tecnológico

### Backend

- **Java 17**
- **Spring Boot 3.2.0**
  - Spring Web (REST API)
  - Spring Data JPA (Persistencia)
  - Spring Security (Autenticación/Autorización)
- **PostgreSQL** (Base de Datos)
- **JWT** (jjwt 0.11.5) para manejo de sesiones stateless.
- **Swagger/OpenAPI** (springdoc 2.3.0) para documentación de API.

### Frontend

- **React 19**
- **Vite**
- **TypeScript**
- **Tailwind CSS**
- **Lucide React**
- **React Router**

## 💾 Esquema de Base de Datos

La aplicación utiliza las siguientes entidades principales:

### `Usuario` (users)

- `id`: Identificador único.
- `nombre`: Nombre completo del usuario.
- `email`: Correo electrónico (único).
- `password`: Contraseña encriptada.
- `rol`: Rol del usuario (`USER`, `ADMIN`).
- `puntosTotales`: Acumulado de puntos.

### `Partido` (matches)

- `id`: Identificador único.
- `equipoLocal`: Nombre del equipo local.
- `equipoVisitante`: Nombre del equipo visitante.
- `fechaHora`: Fecha y hora del encuentro.
- `estadio`: Lugar del partido.
- `golesLocal`: Goles del equipo local (puede ser nulo si no se ha jugado).
- `golesVisitante`: Goles del equipo visitante (puede ser nulo).

### `Pronostico` (predictions)

- `id`: Identificador único.
- `usuario`: Relación con el usuario que hace la predicción.
- `partido`: Relación con el partido a predecir.
- `golesLocalPronosticados`: Predicción de goles local.
- `golesVisitantePronosticados`: Predicción de goles visitante.
- `puntosObtenidos`: Puntos ganados con esta predicción.

## ⚙️ Configuración e Instalación

### Prerrequisitos

- Java JDK 17+
- Node.js 18+
- PostgreSQL
- Maven

### 1. Configuración de Base de Datos

Crea una base de datos PostgreSQL llamada `mundialscore` (o el nombre que prefieras) y actualiza el archivo `src/main/resources/application.properties` con tus credenciales:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/mundialscore
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
```

### 2. Ejecutar el Backend

Desde la raíz del proyecto:

```bash
mvn spring-boot:run
```

El servidor iniciará en `http://localhost:8082`.
La documentación Swagger estará disponible en `http://localhost:8082/swagger-ui.html` (si está habilitado).

### 3. Ejecutar el Frontend

Navega a la carpeta del frontend e instala las dependencias:

```bash
cd frontend
npm install
npm run dev
```

La aplicación frontend estará disponible en `http://localhost:3000`.

## 📡 API Endpoints Principales

### Auth

- `POST /api/auth/register`: Registrar nuevo usuario.
- `POST /api/auth/login`: Iniciar sesión.

### Partidos

- `GET /api/partidos`: Listar todos los partidos.
- `GET /api/partidos/{id}`: Obtener detalles de un partido.
- `POST /api/partidos` (Admin): Crear partido.
- `PUT /api/partidos/{id}/resultado` (Admin): Actualizar el marcador de un partido.

### Pronósticos

- `POST /api/pronosticos`: Crear o actualizar un pronóstico.
- `GET /api/pronosticos/mis`: Obtener los pronósticos del usuario actual.

### Leaderboard

- `GET /api/leaderboard`: Obtener el ranking de usuarios.


