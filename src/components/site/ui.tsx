import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { CONCIERGE } from "./data";

export function SmartLink({ href, className, children, onClick }: { href: string; className?: string; children: ReactNode; onClick?: () => void }) {
  if (href.startsWith("/")) return <Link to={href as "/"} className={className} onClick={onClick}>{children}</Link>;
  const ext = href.startsWith("http");
  return <a href={href} className={className} onClick={onClick} {...(ext ? { target: "_blank", rel: "noreferrer" } : {})}>{children}</a>;
}

export function More({ href, children }: { href: string; children: ReactNode }) {
  return <SmartLink href={href} className="more">{children} <span aria-hidden="true">→</span></SmartLink>;
}

export function Ph({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return <figure className={`ph${className ? ` ${className}` : ""}`}><img src={src} alt={alt} loading="lazy" /></figure>;
}

export function PageHero({ title, kicker, children, image, alt }: { title: ReactNode; kicker?: string; children?: ReactNode; image?: string; alt?: string }) {
  return <section className={`phero${image ? "" : " phero--text"}`}>
    <div className="phero-text reveal">
      {kicker && <span className="eyebrow">{kicker}</span>}
      <h1 className="h-display">{title}</h1>
      {children && <div className="phero-body">{children}</div>}
    </div>
    {image && <div className="phero-img"><img src={image} alt={alt ?? ""} fetchPriority="high" /></div>}
  </section>;
}

export function Accordion({ items, defaultOpen = 0 }: { items: { q: string; a: ReactNode }[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  return <div className="acc">
    {items.map((it, i) => <div className={`acc-item${open === i ? " open" : ""}`} key={it.q}>
      <button className="acc-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
        <span>{it.q}</span><span className="acc-icon" aria-hidden="true" />
      </button>
      <div className="acc-a"><div>{it.a}</div></div>
    </div>)}
  </div>;
}

export function Concierge({ title = "Embrowerment® Concierge", eyebrow, quote, quoteTitle }: { title?: string; eyebrow?: string; quote?: { text: string; by: string }; quoteTitle?: string }) {
  const lines = <>
    <div className="concierge-lines">
      <a href={`tel:${CONCIERGE.tel}`}>{CONCIERGE.phone}</a>
      <a href={`mailto:${CONCIERGE.email}`}>{CONCIERGE.email}</a>
    </div>
    <p className="concierge-note"><b>Concierge availability</b>: {CONCIERGE.hours}.</p>
    <p className="concierge-note"><em>Messages received outside these hours will be responded to promptly during concierge hours.</em></p>
  </>;
  if (!quote) return <section className="concierge-light">
    <div className="cl-head reveal">
      {eyebrow && <h3 className="eyebrow">{eyebrow}</h3>}
      <h3 className="h-display">{title}</h3>
      <p className="cl-sub">Messages received outside these hours will be responded to promptly during concierge hours.</p>
    </div>
    <div className="cl-cards reveal">
      <a className="cl-card" href={`tel:${CONCIERGE.tel}`}><span className="cl-label">Call</span><b>{CONCIERGE.phone}</b><span className="cl-go" aria-hidden="true">→</span></a>
      <a className="cl-card" href={`mailto:${CONCIERGE.email}`}><span className="cl-label">Email</span><b>{CONCIERGE.email}</b><span className="cl-go" aria-hidden="true">→</span></a>
      <div className="cl-card cl-card--static"><span className="cl-label">Concierge availability</span><b>{CONCIERGE.hours}</b></div>
    </div>
  </section>;
  return <section className="concierge">
    <div className="reveal">
      {eyebrow && <h3 className="eyebrow">{eyebrow}</h3>}
      <h3 className="h-display">{title}</h3>
      {lines}
    </div>
    <div className="reveal concierge-quote">{quoteTitle && <h3 className="eyebrow">{quoteTitle}</h3>}<blockquote><p>“{quote.text}”</p><cite>— {quote.by}</cite></blockquote></div>
  </section>;
}