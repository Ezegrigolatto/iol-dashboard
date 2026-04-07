export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  userName: string
  ".issued": string
  ".expires": string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
  userName: string
}

export interface Saldo {
  liquidacion: "inmediato" | "t1" | "t2" | "t3"
  saldo: number
  comprometido: number
  disponible: number
  disponibleOperar: number
}

export interface Cuenta {
  numero: string
  tipo: string
  moneda: "peso_Argentino" | "dolar_Estadounidense"
  disponible: number
  comprometido: number
  saldo: number
  titulosValorizados: number
  total: number
  margenDescubierto: number
  saldos: Saldo[]
  estado: string
}

export interface EstadoCuenta {
  cuentas: Cuenta[]
  estadisticas: {
    descripcion: string
    cantidad: number
    volumen: number
  }[]
  totalEnPesos: number
}

export interface Titulo {
  simbolo: string
  descripcion: string
  pais: string
  mercado: string
  tipo: string
  plazo: string
  moneda: string
}

export interface Parking {
  disponibleInmediato: number
}

export interface Activo {
  cantidad: number
  comprometido: number
  puntosVariacion: number
  variacionDiaria: number
  ultimoPrecio: number
  ppc: number
  gananciaPorcentaje: number
  gananciaDinero: number
  valorizado: number
  titulo: Titulo
  parking: Parking
}

export interface Portafolio {
  pais: string
  activos: Activo[]
}

export interface Operacion {
  numero: number
  fechaOrden: string
  tipo: string
  estado: string
  mercado: string
  simbolo: string
  cantidad: number
  monto: number
  modalidad: string
  precio: number
  fechaOperada: string
  cantidadOperada: number
  precioOperado: number
  montoOperado: number
  plazo: string
}

export interface PerfilUsuario {
  nombre: string
  apellido: string
  numeroCuenta: string
  dni: string
  cuitCuil: string
  sexo: string
  perfilInversor: string
  actualizarDDJJ: boolean
  actualizarTestInversor: boolean
  esBajaArrepentimiento: boolean
  email: string
  cuentaAbierta: boolean
  actualizarTyC: boolean
  actualizarTyCApp: boolean
}

export interface CotizacionDetalle {
  ultimoPrecio: number
  variacion: number
  apertura: number
  maximo: number
  minimo: number
  fechaHora: string
  tendencia: string
  cierreAnterior: number
  montoOperado: number
  volumenNominal: number
  precioPromedio: number
  moneda: string
  cantidadOperaciones: number
  descripcionTitulo: string
  plazo: string
}

export interface ApiError {
  message: string
  status: number
}
