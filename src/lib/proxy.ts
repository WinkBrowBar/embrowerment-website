/**
 * Same-origin proxy: /api/* and /uploads/* on the website are forwarded (server-side) to the backend.
 * Lets an https site use an http-only backend (no mixed content) and keeps cookies first-party.
 * Backend address: API_INTERNAL_URL → VITE_API_URL → fallback.
 */
const FALLBACK = "http://51.21.191.236:4001";
const HOP = ["host", "connection", "keep-alive", "transfer-encoding", "upgrade", "proxy-connection", "te", "trailer", "content-length", "accept-encoding"];

function backend() {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
  const fromBuild = (import.meta.env["VITE_API_URL"] as string | undefined) || "";
  return (env["API_INTERNAL_URL"] || env["VITE_API_URL"] || fromBuild || FALLBACK).replace(/\/$/, "");
}

export async function proxy(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const target = `${backend()}${url.pathname}${url.search}`;
  if (target.startsWith(url.origin)) return new Response("Proxy loop: set API_INTERNAL_URL to the backend address", { status: 508 });

  const headers = new Headers(request.headers);
  for (const h of HOP) headers.delete(h);
  headers.set("x-forwarded-host", url.host);
  headers.set("x-forwarded-proto", url.protocol.replace(":", ""));
  const hasBody = !["GET", "HEAD"].includes(request.method);

  let res: Response;
  try {
    const init: RequestInit = { method: request.method, headers, redirect: "manual", signal: AbortSignal.timeout(30000) };
    if (hasBody) init.body = await request.arrayBuffer();
    res = await fetch(target, init);
  } catch {
    return Response.json({ error: "API is unreachable" }, { status: 502 });
  }
  const out = new Headers(res.headers);
  out.delete("content-encoding"); out.delete("content-length"); out.delete("transfer-encoding");
  // Preserve multiple Set-Cookie headers
  const cookies = (res.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie?.() ?? [];
  if (cookies.length) { out.delete("set-cookie"); for (const c of cookies) out.append("set-cookie", c); }
  return new Response(request.method === "HEAD" ? null : await res.arrayBuffer(), { status: res.status, statusText: res.statusText, headers: out });
}