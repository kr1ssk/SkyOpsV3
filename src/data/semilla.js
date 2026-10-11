export const productosIniciales = [
  {
    id: 1,
    nombre: "Actuador de Superficie de Control",
    pn: "PN-27-6612",
    categoria: "ATA 27",
    descripcion:
      "Actuador para el sistema de control de vuelo de una aeronave.",
    ubicacion: "Bodega ANF-A03",
    stock: 4,
    precio: 850000,
    descuento: 10,
    certificado: true,
    imagen: "actuador-superficie.svg",
  },
  {
    id: 2,
    nombre: "Actuador de Tren Principal",
    pn: "PN-32-4471",
    categoria: "ATA 32",
    descripcion:
      "Componente del sistema de accionamiento del tren de aterrizaje.",
    ubicacion: "Bodega SCL-A17",
    stock: 1,
    precio: 1250000,
    descuento: 0,
    certificado: true,
    imagen: "actuador-tren.svg",
  },
  {
    id: 3,
    nombre: "Álabe de Turbina",
    pn: "PN-72-7754",
    categoria: "ATA 72",
    descripcion:
      "Repuesto de turbina. Su certificación debe revisarse antes de instalarlo.",
    ubicacion: "Bodega ANF-D11",
    stock: 2,
    precio: 420000,
    descuento: 5,
    certificado: false,
    imagen: "alabe-turbina.svg",
  },
];

export const flotaInicial = [
  {
    matricula: "CC-BFA",
    modelo: "A320neo",
    aerolinea: "LATAM",
    ubicacion: "SCL · Puerta 14",
    estado: "AOG",
  },
  {
    matricula: "CC-AVE",
    modelo: "A321",
    aerolinea: "LATAM",
    ubicacion: "SCL · Plataforma Remota 3",
    estado: "Operativa",
  },
  {
    matricula: "CC-AZS",
    modelo: "B737-800",
    aerolinea: "Sky",
    ubicacion: "ANF · Hangar 2",
    estado: "AOG",
  },
  {
    matricula: "CC-DBC",
    modelo: "A320",
    aerolinea: "JetSMART",
    ubicacion: "SCL · Puerta 22",
    estado: "Operativa",
  },
];

export function crearDatosIniciales() {
  return {
    productos: productosIniciales.map((producto) => ({ ...producto })),
    flota: flotaInicial.map((avion) => ({ ...avion })),
    carrito: [],
    pedidos: [],
    contactos: [],
    categorias: ["ATA 27", "ATA 32", "ATA 72"].map(nombre => ({ id: nombre, nombre })),
    usuarios: [{ id: "admin-demo", nombre: "Administrador SkyOps", correo: "admin@skyops.cl", clave: "Skyops123", rol: "admin", direccion: "", licencia: "" }],
    sesionId: null,
  };
}