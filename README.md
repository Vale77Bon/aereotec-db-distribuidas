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


---

# ✈️ AereoTec - Distributed Databases Dashboard (English Version)

This project is an enterprise simulation of a commercial airline that connects a React frontend with a Node.js API, extracting real-time information from three independent and isolated database engines (MySQL, SQL Server, and PostgreSQL).

## 🏗️ Tech Stack
* **Infrastructure:** Docker & Docker Compose
* **Backend:** Node.js, Express.js (REST API)
* **Frontend:** React.js, Vite, Tailwind CSS
* **Database Engines:**
  * **MySQL 8.0 (OLTP):** Transactional management of flights and reservations.
  * **SQL Server 2019 (ERP):** Logistics control for fleet and maintenance.
  * **PostgreSQL 15 (OLAP):** Financial auditing and security logs using native JSONB.

## 🛠️ Prerequisites

To run this project locally, you will need:
1. **[Docker Desktop](https://www.docker.com/products/docker-desktop/):** To spin up the database containers without manually installing the engines.
2. **[Node.js (LTS)](https://nodejs.org/):** To run the backend server and the frontend interface.
3. **[Python 3](https://www.python.org/):** To execute the synthetic data injection script.

## 🚀 Quick Start Guide

**Step 1: Spin up the databases**
Open Docker Desktop. Then, in your terminal, run:
`docker compose up -d`

**Step 2: Inject synthetic data**
Navigate to the scripts folder, install the dependencies, and run the Python script:
`cd scripts`
`pip install faker mysql-connector-python pyodbc psycopg2`
`python poblar_datos.py`

**Step 3: Start the API (Backend)**
Navigate to the backend folder, rename `.env.example` to `.env` with your Docker credentials, and run:
`cd backend`
`npm install`
`node server.js`

**Step 4: Start the Visual Dashboard (Frontend)**
Open a new terminal, navigate to the frontend folder, and run:
`cd frontend`
`npm install`
`npm run dev`

