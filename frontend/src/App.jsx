import React, { useState, useEffect } from 'react';

function App() {
  const [vuelos, setVuelos] = useState([]);
  const [flotilla, setFlotilla] = useState([]);
  const [finanzas, setFinanzas] = useState({ ingresos_por_metodo: [], logs_recientes: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Consumir las 3 bases de datos distribuidas en paralelo
    Promise.all([
      fetch('http://localhost:5000/api/vuelos').then(res => res.json()),
      fetch('http://localhost:5000/api/flotilla').then(res => res.json()),
      fetch('http://localhost:5000/api/finanzas').then(res => res.json())
    ])
      .then(([vuelosData, flotillaData, finanzasData]) => {
        setVuelos(vuelosData);
        setFlotilla(flotillaData);
        setFinanzas(finanzasData);
        setLoading(false);
      })
      .catch(err => console.error("Error al cargar páneles:", err));
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white font-mono">
        <p className="text-xl animate-pulse">Consultando motores distribuidos en tiempo real...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6 font-sans text-slate-100">
      <header className="mb-8 border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-bold text-sky-400">AereoTec - Monitoreo de Arquitectura Distribuida</h1>
        <p className="text-sm text-slate-400">Infraestructura multi-motor interactuando simultáneamente mediante Node.js API</p>
      </header>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Módulo 1: MySQL - Reservaciones */}
        <div className="rounded-xl bg-slate-800 p-6 shadow-lg border border-teal-500/30">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-teal-400">Módulo de Vuelos activos (MySQL OLTP)</h2>
            <span className="px-2 py-1 bg-teal-500/10 text-teal-400 rounded text-xs border border-teal-500/20">Puerto 3306</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="pb-2">Vuelo</th>
                  <th className="pb-2">Ruta</th>
                  <th className="pb-2">Salida</th>
                  <th className="pb-2">Estatus</th>
                </tr>
              </thead>
              <tbody>
                {vuelos.map((v) => (
                  <tr key={v.id_vuelo} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="py-2 font-mono font-bold">#{v.id_vuelo}</td>
                    <td className="py-2">{v.origen} ➔ {v.destino}</td>
                    <td className="py-2 text-xs">{new Date(v.fecha_salida).toLocaleDateString()}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${v.estado === 'Programado' ? 'bg-sky-500/10 text-sky-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {v.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Módulo 2: SQL Server - Logística */}
        <div className="rounded-xl bg-slate-800 p-6 shadow-lg border border-red-500/30">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-red-400">Control de Flotilla (SQL Server ERP)</h2>
            <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs border border-red-500/20">Puerto 1434</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="pb-2">Matrícula</th>
                  <th className="pb-2">Modelo</th>
                  <th className="pb-2">Horas de Vuelo</th>
                  <th className="pb-2">Inversión Mant.</th>
                </tr>
              </thead>
              <tbody>
                {flotilla.slice(0, 5).map((f, i) => (
                  <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="py-2 font-mono text-amber-400">{f.matricula}</td>
                    <td className="py-2">{f.fabricante} {f.nombre_modelo}</td>
                    <td className="py-2">{f.horas_vuelo.toLocaleString()} hrs</td>
                    <td className="py-2 text-emerald-400">${parseFloat(f.gasto_total_mantenimiento).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Módulo 3: PostgreSQL - Finanzas y Auditoría */}
        <div className="rounded-xl bg-slate-800 p-6 shadow-lg border border-indigo-500/30 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-indigo-400">Auditoría Global y Flujos Financieros (PostgreSQL OLAP)</h2>
            <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded text-xs border border-indigo-500/20">Puerto 5432</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tarjetas de Métricas Rápidas */}
            <div className="space-y-4 md:col-span-1">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Ingresos por Método</h3>
              {finanzas.ingresos_por_metodo.map((m, i) => (
                <div key={i} className="bg-slate-700/40 p-3 rounded-lg border border-slate-700 flex justify-between items-center">
                  <span className="text-sm capitalize">{m.metodo_pago}</span>
                  <span className="font-mono text-emerald-400 font-bold">${Math.round(m.total).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Logs del Campo No Relacional JSONB */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">Logs de Seguridad Recientes (Parseo de JSONB Nativo)</h3>
              <div className="space-y-2">
                {finanzas.logs_recientes.map((log, i) => (
                  <div key={i} className="text-xs bg-slate-900/60 p-2.5 rounded border border-slate-700/60 font-mono flex items-start gap-3">
                    <span className="text-red-400 font-bold">[{log.nivel_alerta}]</span>
                    <div className="flex-1">
                      <p className="text-slate-200 font-bold">{log.accion}</p>
                      <p className="text-slate-400 text-[11px]">Origen IP: {log.ip} | Transacción sincronizada</p>
                    </div>
                    <span className="text-slate-500">{new Date(log.fecha_evento).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default App;