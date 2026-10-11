export const STOCK_CRITICO = 2;

export function resumirPedidos(pedidos) {
  const aprobados = pedidos.filter(p => p.estado !== "Rechazado");
  return {
    cantidad: pedidos.length,
    aprobados: aprobados.length,
    rechazados: pedidos.filter(p => p.estado === "Rechazado").length,
    pendientes: pedidos.filter(p => p.estado === "Pendiente").length,
    ingresos: aprobados.reduce((total, p) => total + p.total, 0),
    unidades: aprobados.reduce((total, p) => total + p.lineas.reduce((n, l) => n + l.cantidad, 0), 0)
  };
}
