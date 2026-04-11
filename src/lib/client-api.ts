import { EstadoCuenta, Portafolio, Operacion, PerfilUsuario } from '@/types';

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: 'include' });
  if (res.status === 401) {
    await fetch('/api/auth/logout', { method: 'POST' });
    throw new Error('NO_AUTH');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export const clientApi = {
  getEstadoCuenta: (): Promise<EstadoCuenta> => apiFetch('/api/cuenta'),

  getPortafolio: (pais: string = 'argentina'): Promise<Portafolio> =>
    apiFetch(`/api/portafolio?pais=${pais}`),

  getOperaciones: (params?: {
    estado?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    pais?: string;
  }): Promise<Operacion[]> => {
    const qs = new URLSearchParams(
      Object.entries(params ?? {}).filter(([, v]) => Boolean(v)) as [string, string][]
    ).toString();
    return apiFetch(`/api/operaciones${qs ? '?' + qs : ''}`);
  },

  getPerfil: (): Promise<PerfilUsuario> => apiFetch('/api/perfil'),

  getCotizaciónMEP: (currency: string): Promise<number> =>
    apiFetch(`/api/mep/?simbolo=${currency}`),

  login: async (
    username: string,
    password: string
  ): Promise<{ ok: boolean; userName: string }> => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? 'Error al iniciar sesión');
    }
    return res.json();
  },

  logout: async (): Promise<void> => {
    await fetch('/api/auth/logout', { method: 'POST' });
  },

  getMe: (): Promise<{ authenticated: boolean; userName: string }> =>
    apiFetch('/api/auth/me'),
};
