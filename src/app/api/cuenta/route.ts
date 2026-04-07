import { NextResponse } from 'next/server';
import { iolApi } from '@/lib/iol';

export async function GET() {
  try {
    const data = await iolApi.estadoCuenta();
    return NextResponse.json(data);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === 'NO_AUTH') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Error al obtener estado de cuenta' },
      { status: 500 }
    );
  }
}
