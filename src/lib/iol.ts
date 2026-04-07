import { getValidAccessToken, refreshAccessToken, getTokens, saveTokens } from './tokens';

const BASE = process.env.IOL_API_BASE_URL ?? 'https://api.invertironline.com';

async function iolFetch<T>(path: string, retry = true): Promise<T> {
  const token = await getValidAccessToken();
  if (!token) throw new Error('NO_AUTH');

  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 0 },
  });

  if (res.status === 401 && retry) {
    const tokens = await getTokens();
    if (!tokens) throw new Error('NO_AUTH');

    const refreshed = await refreshAccessToken(tokens.refreshToken);
    if (!refreshed) throw new Error('NO_AUTH');

    await saveTokens(refreshed);
    return iolFetch<T>(path, false);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json();
}

export const iolApi = {
  estadoCuenta: () => iolFetch('/api/v2/estadocuenta'),
  portafolio: (pais: string) => iolFetch(`/api/v2/portafolio/${pais}`),
  operaciones: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return iolFetch(`/api/v2/operaciones${qs}`);
  },
  operacion: (numero: number) => iolFetch(`/api/v2/operaciones/${numero}`),
  perfil: () => iolFetch('/api/v2/datos-perfil'),
  cotizacionDetalle: (mercado: string, simbolo: string) =>
    iolFetch(`/api/v2/${mercado}/Titulos/${simbolo}/CotizacionDetalle`),
  serieHistorica: (mercado: string, simbolo: string, desde: string, hasta: string) =>
    iolFetch(
      `/api/v2/${mercado}/Titulos/${simbolo}/Cotizacion/seriehistorica/${desde}/${hasta}/ajustada`
    ),
  mepCotizacion: (simbolo: string) => iolFetch(`/api/v2/Cotizaciones/MEP/${simbolo}`),
};
