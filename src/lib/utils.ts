import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string = 'ARS'): string {
  const locale = 'es-AR';
  const symbol = currency === 'peso_Argentino' || currency === 'ARS' ? 'ARS' : 'USD';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: symbol,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'always',
  }).format(value / 100);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(dateString: string): string {
  try {
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}

export function formatDateShort(dateString: string): string {
  try {
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}

export function tipoToLabel(tipo: string): string {
  const map: Record<string, string> = {
    oPCIONES: 'Opciones',
    acciones: 'Acciones',
    bono: 'Bonos',
    cedear: 'CEDEARs',
    CEDEARS: 'CEDEARs',
    CAUCIONESPESOS: 'Cauciones en pesos',
    TitulosPublicos: 'Títulos Públicos',
    fci: 'FCI',
    FondoComundeInversion: 'FCI',
    letras: 'Letras',
    futuros: 'Futuros',
    on: 'Obligaciones Negociables',
  };
  return map[tipo] ?? tipo;
}

export function estadoToLabel(estado: string): string {
  const map: Record<string, string> = {
    iniciada: 'Iniciada',
    pendiente: 'Pendiente',
    ejecutada: 'Ejecutada',
    cancelada: 'Cancelada',
    rechazada: 'Rechazada',
    vencida: 'Vencida',
  };
  return map[estado] ?? estado;
}

export function paisToLabel(pais: string): string {
  const map: Record<string, string> = {
    argentina: 'Argentina',
    estados_Unidos: 'Estados Unidos',
  };
  return map[pais] ?? pais;
}

export function tipoActivoToLabel(tipo: string): string {
  const map: Record<string, string> = {
    CEDEARS: 'CEDEARs',
    ACCIONES: 'Acciones',
    BONOS: 'Bonos',
    OPCIONES: 'Opciones',
    FCI: 'FCI',
    LETRAS: 'Letras',
    FUTUROS: 'Futuros',
    ON: 'Obligaciones Negociables',
  };
  return map[tipo] ?? tipo;
}
