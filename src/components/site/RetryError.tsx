import { useEffect, useRef, useState } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";

const retried = new Set<string>();

/**
 * Default error screen for route loaders. If data failed to load during server rendering
 * (e.g. the web server couldn't reach the API), the browser silently retries once —
 * no manual refresh needed. Shows a message only if the retry also fails.
 */
export function RetryError({ error }: { error: unknown }) {
  const router = useRouter();
  const path = useRouterState({ select: s => s.location.href });
  const [failed, setFailed] = useState(false);
  const busy = useRef(false);
  useEffect(() => {
    if (busy.current) return;
    if (retried.has(path)) { setFailed(true); return; }
    retried.add(path); busy.current = true;
    router.invalidate().finally(() => { busy.current = false; setTimeout(() => retried.delete(path), 5000); });
  }, [path, router]);
  if (!failed) return <section className="feat"><p className="muted">Loading…</p></section>;
  return <section className="phero phero--text"><div className="phero-text">
    <h1 className="h-display">Something went wrong.</h1>
    <div className="phero-body"><p>{error instanceof Error ? error.message : "This page couldn't load."} Please try again.</p>
      <button className="btn-solid" onClick={() => { retried.delete(path); setFailed(false); router.invalidate(); }}>Try again</button></div>
  </div></section>;
}