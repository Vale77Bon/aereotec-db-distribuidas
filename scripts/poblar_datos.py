import random
import json
from datetime import datetime, timedelta
from faker import Faker
import mysql.connector
import pyodbc
import psycopg2

# Inicializamos Faker para generar nombres y datos de México/Latinoamérica
fake = Faker('es_MX')

def generar_datos():
    print("Conectando a las bases de datos...")
    # 1. Conexiones
    conn_mysql = mysql.connector.connect(host="127.0.0.1", port=3306, user="root", password="Password123!", database="reservaciones_db")
    cursor_mysql = conn_mysql.cursor()

    conn_sqlserver = pyodbc.connect("DRIVER={ODBC Driver 17 for SQL Server};SERVER=127.0.0.1,1434;DATABASE=operaciones_db;UID=sa;PWD=Password123!;TrustServerCertificate=yes;")
    cursor_sqlserver = conn_sqlserver.cursor()

    conn_pg = psycopg2.connect(host="127.0.0.1", port=5432, user="postgres", password="Password123!", dbname="finanzas_auditoria_db")
    cursor_pg = conn_pg.cursor()

    print("Generando datos masivos (Esto puede tomar unos segundos)...")

    # ==========================================
    # FASE A: MySQL (Reservaciones)
    # ==========================================
    # 1. Pasajeros (250 registros)
    pasajeros_data = []
    pasaportes = []
    
    # Inyectamos un par de VIPs para que siempre estén en la base
    pasajeros_data.append(('MX00000001', 'Omar', 'Hernandez', 'Mexicana', '2004-05-10', '2026-01-10'))
    pasajeros_data.append(('MX00000002', 'Sofia', 'Ceja', 'Mexicana', '2004-08-22', '2026-01-12'))
    pasaportes.extend(['MX00000001', 'MX00000002'])

    for _ in range(248):
        pasaporte = fake.unique.bothify(text='??########', letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ')
        pasaportes.append(pasaporte)
        nacionalidad = random.choice(['Mexicana', 'Mexicana', 'Colombiana', 'Española', 'Estadounidense', 'Argentina'])
        fecha_nac = fake.date_of_birth(minimum_age=2, maximum_age=80).strftime('%Y-%m-%d')
        fecha_reg = fake.date_between(start_date='-2y', end_date='today').strftime('%Y-%m-%d')
        pasajeros_data.append((pasaporte, fake.first_name(), fake.last_name(), nacionalidad, fecha_nac, fecha_reg))
    
    cursor_mysql.executemany("INSERT INTO pasajeros (pasaporte, nombre, apellido, nacionalidad, fecha_nacimiento, fecha_registro) VALUES (%s, %s, %s, %s, %s, %s)", pasajeros_data)

    # 2. Aeropuertos (15 registros, forzando los requeridos por el profesor)
    aeropuertos_data = [
        ('MEX', 'Aeropuerto Internacional Benito Juárez', 'CDMX', 'México'),
        ('MAD', 'Aeropuerto Adolfo Suárez Madrid-Barajas', 'Madrid', 'España'),
        ('BOG', 'Aeropuerto Internacional El Dorado', 'Bogotá', 'Colombia'),
        ('JFK', 'Aeropuerto Internacional John F. Kennedy', 'Nueva York', 'Estados Unidos'),
        ('PBC', 'Aeropuerto Internacional Hermanos Serdán', 'Puebla', 'México'),
        ('CUN', 'Aeropuerto Internacional de Cancún', 'Cancún', 'México')
    ]
    for _ in range(9):
        aeropuertos_data.append((fake.unique.lexify(text='???', letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ'), f"Aeropuerto {fake.company()}", fake.city(), fake.country()))
    cursor_mysql.executemany("INSERT INTO aeropuertos (codigo_iata, nombre, ciudad, pais) VALUES (%s, %s, %s, %s)", aeropuertos_data)

    # 3. Vuelos (100 registros)
    vuelos_data = []
    estados_vuelo = ['Programado', 'Programado', 'En Vuelo', 'Aterrizado', 'Cancelado']
    for _ in range(100):
        origen = random.randint(1, 15)
        destino = random.randint(1, 15)
        while destino == origen: destino = random.randint(1, 15)
        # Generar fechas mezclando día y noche
        hora = random.randint(0, 23)
        minuto = random.choice([0, 15, 30, 45])
        fecha_base = fake.date_this_year(after_today=True)
        fecha_salida = datetime.combine(fecha_base, datetime.min.time()).replace(hour=hora, minute=minuto).strftime('%Y-%m-%d %H:%M:%S')
        
        vuelos_data.append((origen, destino, fecha_salida, random.choice(estados_vuelo), random.choice([100, 150, 200, 300]), round(random.uniform(200, 2000), 2)))
    cursor_mysql.executemany("INSERT INTO vuelos (id_aeropuerto_origen, id_aeropuerto_destino, fecha_salida, estado, capacidad_maxima, precio_base) VALUES (%s, %s, %s, %s, %s, %s)", vuelos_data)

    # 4. Boletos (350 registros)
    boletos_data = []
    for _ in range(350):
        vuelo = random.randint(1, 100)
        pasajero = random.randint(1, 250)
        asiento = f"{random.randint(1,30)}{random.choice(['A','B','C','D','E','F'])}"
        precio = round(random.uniform(50, 2500), 2)
        boletos_data.append((vuelo, pasajero, asiento, precio))
    cursor_mysql.executemany("INSERT INTO boletos (id_vuelo, id_pasajero, numero_asiento, precio_final) VALUES (%s, %s, %s, %s)", boletos_data)

    # ==========================================
    # FASE B: SQL Server (Operaciones)
    # ==========================================
    # 1. Modelos (8 registros)
    modelos_data = [('737 MAX', 'Boeing', 200), ('747', 'Boeing', 416), ('A320', 'Airbus', 150), ('A380', 'Airbus', 853), ('777', 'Boeing', 396), ('A350', 'Airbus', 410)]
    cursor_sqlserver.executemany("INSERT INTO modelos_avion (nombre_modelo, fabricante, capacidad_maxima) VALUES (?, ?, ?)", modelos_data)

    # 2. Flotilla (30 registros)
    for _ in range(30):
        matricula = f"XA-{random.randint(100, 999)}"
        anio = random.randint(2010, 2024)
        horas = random.randint(0, 15000)
        cursor_sqlserver.execute("INSERT INTO flotilla (matricula, id_modelo, anio_fabricacion, horas_vuelo) VALUES (?, ?, ?, ?)", (matricula, random.randint(1, 6), anio, horas))

    # 3. Tripulación (60 registros)
    puestos = ['Capitán', 'Capitán', 'Primer Oficial', 'Sobrecargo', 'Sobrecargo', 'Sobrecargo']
    for _ in range(60):
        cursor_sqlserver.execute("INSERT INTO tripulacion (nombre, apellido, puesto, anos_antiguedad, horas_vuelo, sueldo_base) VALUES (?, ?, ?, ?, ?, ?)", 
                                 (fake.first_name(), fake.last_name(), random.choice(puestos), random.randint(1, 25), random.randint(100, 8000), round(random.uniform(1500, 8000), 2)))

    # 4. Mantenimiento (100 registros)
    tipos_mant = ['preventivo', 'correctivo']
    for _ in range(100):
        costo = round(random.uniform(1000, 60000), 2)
        cursor_sqlserver.execute("INSERT INTO bitacora_mantenimiento (id_avion, fecha_mantenimiento, tipo_mantenimiento, costo, detalles) VALUES (?, ?, ?, ?, ?)", 
                                 (random.randint(1, 30), fake.date_this_year().strftime('%Y-%m-%d'), random.choice(tipos_mant), costo, fake.sentence()))

    # ==========================================
    # FASE C: PostgreSQL (Finanzas y Auditoría)
    # ==========================================
    # 1. Tarifas de Equipaje (4 registros)
    tarifas_data = [('Sin Equipaje Extra', 0.00), ('Equipaje Mano 10kg', 30.00), ('Documentado 15kg', 50.00), ('Extra Pesado 25kg', 100.00)]
    cursor_pg.executemany("INSERT INTO tarifas_equipaje (nombre_tarifa, costo) VALUES (%s, %s)", tarifas_data)

    # 2. Historial Viajero Frecuente (150 registros)
    niveles = ['Básico', 'Básico', 'Platino', 'Diamante']
    viajeros_data = []
    # Seleccionamos una muestra aleatoria de los pasaportes generados en MySQL
    for pasaporte in random.sample(pasaportes, 150):
        viajeros_data.append((pasaporte, random.randint(0, 150000), random.choice(niveles)))
    cursor_pg.executemany("INSERT INTO historial_viajero_frecuente (pasaporte, millas_acumuladas, nivel) VALUES (%s, %s, %s)", viajeros_data)

    # 3. Pagos (400 registros)
    pagos_data = []
    metodos = ['tarjeta de crédito', 'efectivo', 'transferencia', 'tarjeta de débito']
    for _ in range(400):
        # El 20% no paga tarifa extra (id_tarifa = None en Python, se traduce a NULL en SQL)
        tarifa_id = None if random.random() < 0.2 else random.randint(2, 4)
        pagos_data.append((random.choice(pasaportes), tarifa_id, round(random.uniform(100, 3500), 2), random.choice(metodos)))
    cursor_pg.executemany("INSERT INTO pagos (pasaporte_pasajero, id_tarifa, monto_total, metodo_pago) VALUES (%s, %s, %s, %s)", pagos_data)

    # 4. Logs Seguridad (150 registros)
    logs_data = []
    niveles_alerta = ['INFO', 'ADVERTENCIA', 'CRITICO']
    acciones = ['LOGIN', 'COMPRA', 'REEMBOLSO', 'CAMBIO_CONTRASEÑA', 'INTENTO_ACCESO']
    for _ in range(150):
        accion = random.choice(acciones)
        estado = 'exitoso' if random.random() > 0.1 else 'fallido'
        # Construimos el JSON dinámicamente
        detalles_json = json.dumps({
            "ip_origen": fake.ipv4(),
            "usuario_accion": fake.user_name(),
            "navegador": fake.user_agent()[:50],
            "status": estado
        })
        logs_data.append((random.choice(niveles_alerta), accion, detalles_json))
    cursor_pg.executemany("INSERT INTO log_seguridad (nivel_alerta, accion, detalles) VALUES (%s, %s, %s)", logs_data)

    # Confirmar todas las transacciones (COMMIT)
    conn_mysql.commit()
    conn_sqlserver.commit()
    conn_pg.commit()

    print("\n✅ ¡ÉXITO! Base de datos poblada masivamente.")
    print("Total estimado: +1500 registros lógicos distribuidos en los 3 motores.")

    # Cerrar conexiones
    cursor_mysql.close(); conn_mysql.close()
    cursor_sqlserver.close(); conn_sqlserver.close()
    cursor_pg.close(); conn_pg.close()

if __name__ == "__main__":
    generar_datos()