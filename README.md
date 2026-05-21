# ✈️ AereoTec - Dashboard de Bases de Datos Distribuidas

Este proyecto es una simulación empresarial de una aerolínea que conecta un frontend en React con una API en Node.js, la cual extrae información en tiempo real de tres bases de datos independientes (MySQL, SQL Server y PostgreSQL).

## 🛠️ Requisitos previos para ejecutar este proyecto

Para que este proyecto funcione en tu computadora, necesitas tener instalado lo siguiente:
1. **[Docker Desktop](https://www.docker.com/products/docker-desktop/):** Para levantar los contenedores de las 3 bases de datos sin instalar los motores manualmente.
2. **[Node.js (LTS)](https://nodejs.org/):** Para poder correr el servidor Backend y la interfaz Frontend.
3. **[Python 3](https://www.python.org/):** Para ejecutar el script de inyección de datos masivos.

## 🚀 Guía de Instalación Rápida

**Paso 1: Levantar las bases de datos**
Abre Docker Desktop. Luego, en la terminal, ejecuta:
`docker compose up -d`

**Paso 2: Inyectar los datos**
Entra a la carpeta de scripts, instala las librerías y corre Python:
`cd scripts`
`pip install faker mysql-connector-python pyodbc psycopg2`
`python poblar_datos.py`

**Paso 3: Levantar la API (Backend)**
Entra a la carpeta backend, renombra `.env.example` a `.env` con tus contraseñas de Docker y ejecuta:
`cd backend`
`npm install`
`node server.js`

**Paso 4: Levantar el Panel Visual (Frontend)**
Abre otra terminal, entra al frontend y ejecuta:
`cd frontend`
`npm install`
`npm run dev`