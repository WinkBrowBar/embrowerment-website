import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { LINKS } from "./data";
import { LEADS_API, savedPmuEmail as savedEmail, savePmuEmail, track } from "@/lib/leads";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const formUrl = (email: string) => (email ? `${LINKS.consult}?email=${encodeURIComponent(email)}` : LINKS.consult);

/**
 * "Book a consultation" with a welcome email step in between:
 * click → email box → email saved to the backend → consultation form opens.
 * Visitors who already gave their email go straight to the form.
 */
export function ConsultButton({ className = "btn-solid", children = "Book a consultation" }: { className?: string; children?: string }) {
  const [open, setOpen] = useState(false);

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const known = savedEmail();
    if (known) { e.currentTarget.href = formUrl(known); return; } // already welcomed: open the form directly
    e.preventDefault();
    setOpen(true);
  };

  return <>
    <a href={LINKS.consult} className={className} onClick={onClick}>{children}</a>
    {open && <ConsultGate onClose={() => setOpen(false)} />}
  </>;
}

function ConsultGate({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!EMAIL_RE.test(value)) { setError("Please enter a valid email address."); return; }
    const honeypot = (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value || "";

    // Save in the background (keepalive survives the new tab) so the form opens instantly.
    fetch(`${LEADS_API}/api/leads/pmu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: value, source: "embrowerment.com", page: location.pathname, website: honeypot }),
      keepalive: true,
    }).catch(() => { /* never block the visitor from booking */ });

    savePmuEmail(value);
    track("pmu_email_submitted");
    onClose();
    window.location.assign(formUrl(value));
  };

  return <div className="cgate" role="dialog" aria-modal="true" aria-labelledby="cgate-title" onClick={onClose}>
    <form className="cgate-card" onClick={(e) => e.stopPropagation()} onSubmit={submit} noValidate>
      <button type="button" className="cgate-x" onClick={onClose} aria-label="Close">×</button>
      <span className="eyebrow">Welcome to Embrowerment®</span>
      <h2 id="cgate-title" className="h-display">Let's begin your <em className="acad-hl">brow journey.</em></h2>
      <p>Your consultation is personally conducted by Umbreen and is complimentary. Share your email and we'll take you to your consultation form and stay in touch about your appointment.</p>
      <label className="cgate-field">
        <span>Email address</span>
        <input ref={input} type="email" name="email" autoComplete="email" inputMode="email" placeholder="you@example.com"
          value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} aria-invalid={!!error} aria-describedby={error ? "cgate-err" : undefined} />
      </label>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="cgate-hp" aria-hidden="true" />
      {error && <p id="cgate-err" className="cgate-err" role="alert">{error}</p>}
      <button type="submit" className="btn-solid cgate-go">Continue to consultation <span aria-hidden="true">→</span></button>
      <small>We respect your privacy and never share your email.</small>
    </form>
  </div>;
}
