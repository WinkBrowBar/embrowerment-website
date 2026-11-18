/** umbreen backend (api.umbreen.com): PMU email leads + PMU Pre-Consult Eligibility Form. */
export const LEADS_API = ((import.meta.env["VITE_LEADS_API_URL"] as string | undefined) || "https://api.umbreen.com").replace(/\/$/, "");

const STORE_KEY = "emb_pmu_email";
export const savedPmuEmail = () => { try { return localStorage.getItem(STORE_KEY) || ""; } catch { return ""; } };
export const savePmuEmail = (email: string) => { try { localStorage.setItem(STORE_KEY, email); } catch { /* private mode */ } };

export function track(event: string, data: Record<string, unknown> = {}) {
  const w = window as unknown as { dataLayer?: unknown[] };
  (w.dataLayer = w.dataLayer || []).push({ event, ...data });
}
