import { NextResponse } from 'next/server';

/** Liveness probe for uptime monitors / load balancers. Reveals nothing about configuration. */
export function GET() {
  return NextResponse.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } });
}
