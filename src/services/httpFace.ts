// src/services/httpFace.ts
import { Platform } from 'react-native';

/**
 * MUITO IMPORTANTE:
 * - Se você abre o app no navegador do MESMO PC do Flask, use 127.0.0.1.
 * - Se você abre no celular pelo Expo Go, use o IP da sua máquina (o mesmo que aparece no QR do Expo).
 */
const LAN_IP = '192.168.15.183'; // <-- troque caso o seu seja outro
const BASE =
  Platform.OS === 'web'
    ? 'http://127.0.0.1:5001'
    : `http://${LAN_IP}:5001`;

type StatusResponse = { status: 'idle' | 'pending' | 'approved' | 'rejected' };

export async function startFaceSession() {
  const r = await fetch(`${BASE}/start`, { method: 'POST' });
  if (!r.ok) throw new Error('Falha ao iniciar sessão facial');
  return true;
}

export async function getFaceStatus(): Promise<StatusResponse['status']> {
  const r = await fetch(`${BASE}/status`);
  if (!r.ok) throw new Error('Falha ao consultar status');
  const data: StatusResponse = await r.json();
  return data.status;
}

export async function cancelFaceSession() {
  try {
    await fetch(`${BASE}/cancel`, { method: 'POST' });
  } catch {}
}
