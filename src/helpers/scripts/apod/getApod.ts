import { APODPicture } from "../../types/APODPicture";

export type ApodErrorReason = 'timeout' | 'network' | 'http' | 'parse' | 'unknown';
export type ApodResult =
  | { ok: true; data: APODPicture }
  | { ok: false; reason: ApodErrorReason; status?: number; message?: string };

export const fetchApod = async (opts?: { timeoutMs?: number }): Promise<ApodResult> => {
  const URL = `${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/apod`;
  const timeoutMs = opts?.timeoutMs ?? 5000;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
    });
    clearTimeout(id);

    if (!response.ok) {
      return { ok: false, reason: 'http', status: response.status, message: response.statusText };
    }

    let json: any;
    try {
      json = await response.json();
    } catch {
      return { ok: false, reason: 'parse', message: 'Invalid JSON' };
    }

    const apod: APODPicture = json?.data ?? json;
    if (!apod) return { ok: false, reason: 'parse', message: 'Missing payload' };

    return { ok: true, data: apod };
  } catch (e: any) {
    clearTimeout(id);
    // Dans RN, un abort lève name === 'AbortError'
    if (e?.name === 'AbortError') {
      return { ok: false, reason: 'timeout', message: 'Request timed out' };
    }
    // Heuristique fréquente d’erreur réseau RN
    if (typeof e?.message === 'string' && e.message.toLowerCase().includes('network')) {
      return { ok: false, reason: 'network', message: e.message };
    }
    return { ok: false, reason: 'unknown', message: e?.message ?? String(e) };
  }
};