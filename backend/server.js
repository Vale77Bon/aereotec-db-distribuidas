require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const mssql = require('mssql');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. CONFIGURACIÓN DE POOLS DE CONEXIÓN
// ==========================================

// Pool de MySQL
const mysqlPool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});

// Pool de PostgreSQL
const pgPool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB
});

// Configuración de SQL Server
const mssqlConfig = {
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASSWORD,
    server: process.env.MSSQL_HOST,
    port: parseInt(process.env.MSSQL_PORT),
    database: process.env.MSSQL_DB,
    options: {
        encrypt: false, // Desactivado para entorno local Docker
        trustServerCertificate: true
    }
};

// ==========================================
// 2. ENDPOINTS DE LA API REST
// ==========================================

// Endpoint MySQL: Vuelos y Disponibilidad
app.get('/api/vuelos', async (req, res) => {
    try {
        const query = `
            SELECT v.id_vuelo, ao.ciudad AS origen, ad.ciudad AS destino, v.fecha_salida, v.estado, v.precio_base
            FROM vuelos v
            INNER JOIN aeropuertos ao ON v.id_aeropuerto_origen = ao.id_aeropuerto
            INNER JOIN aeropuertos ad ON v.id_aeropuerto_destino = ad.id_aeropuerto
            ORDER BY v.fecha_salida ASC LIMIT 10;
        `;
        const [rows] = await mysqlPool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar MySQL', details: error.message });
    }
});

// Endpoint SQL Server: Estado de la Flotilla
app.get('/api/flotilla', async (req, res) => {
    try {
        let pool = await mssql.connect(mssqlConfig);
        const query = `
            SELECT f.matricula, m.nombre_modelo, m.fabricante, f.horas_vuelo, f.gasto_total_mantenimiento
            FROM flotilla f
            INNER JOIN modelos_avion m ON f.id_modelo = m.id_modelo
            ORDER BY f.horas_vuelo DESC;
        `;
        let result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar SQL Server', details: error.message });
    }
});

// Endpoint PostgreSQL: Métricas Financieras y Logs Recientes
app.get('/api/finanzas', async (req, res) => {
    try {
        // Ejecutamos consultas paralelas para optimizar tiempos
        const ingresosPromise = pgPool.query('SELECT metodo_pago, SUM(monto_total) as total FROM pagos GROUP BY metodo_pago;');
        const logsPromise = pgPool.query('SELECT fecha_evento, nivel_alerta, accion, detalles->>\'ip_origen\' as ip FROM log_seguridad ORDER BY fecha_evento DESC LIMIT 5;');
        
        const [ingresosRes, logsRes] = await Promise.all([ingresosPromise, logsPromise]);
        
        res.json({
            ingresos_por_metodo: ingresosRes.rows,
            logs_recientes: logsRes.rows
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar PostgreSQL', details: error.message });
    }
});

// Inicialización del Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});