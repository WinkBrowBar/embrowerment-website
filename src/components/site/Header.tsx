import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { IMG, LINKS } from "./data";

const SHOP_URL = "https://shop.embrowerment.com/collections/all";

const nav = [
  ["Permanent makeup", LINKS.pmu],
  ["Shop", SHOP_URL],
  ["Academy", "/academy"],
] as const;

const ico = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
const SOCIAL = [
  { label: "Instagram", href: LINKS.instagram, icon: <svg {...ico}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></svg> },
  { label: "TikTok", href: LINKS.tiktok, icon: <svg {...ico}><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" /><path d="M14 3c.4 2.6 2.2 4.4 5 4.6" /></svg> },
  { label: "Facebook", href: LINKS.facebook, icon: <svg {...ico}><path d="M14.5 8H17V4.5h-2.5A3.5 3.5 0 0 0 11 8v2.5H8.5V14H11v6.5h3.5V14H17l.5-3.5h-3V8.5a.5.5 0 0 1 .5-.5Z" /></svg> },
];

const NavLink = ({ label, href }: { label: string; href: string }) =>
  href.startsWith("http")
    ? <a href={href} target="_blank" rel="noopener noreferrer">{label}</a>
    : <Link to={href as "/"} activeProps={{ className: "active" }}>{label}</Link>;

export function Header() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: s => s.location.pathname });
  useEffect(() => setOpen(false), [path]);
  return <>
    <header className="hdr">
      <Link to="/" className="hdr-logo" aria-label="Embrowerment® home"><img src={IMG.logo} alt="Embrowerment®" /><span className="hdr-reg" aria-hidden="true">®</span></Link>
      <nav className="hdr-nav">{nav.map(([l, h]) => <NavLink key={l} label={l} href={h} />)}</nav>
      <div className="hdr-util">
        <div className="hdr-social hide-sm">{SOCIAL.map(s => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Embrowerment® on ${s.label}`}>{s.icon}</a>)}</div>
        <button className="hdr-burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">{open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M3 8h18M3 16h18" />}</svg>
        </button>
      </div>
    </header>
    <div className={`hdr-drawer${open ? " open" : ""}`}>
      {nav.map(([l, h]) => <NavLink key={l} label={l} href={h} />)}
      <div className="hdr-drawer-social">{SOCIAL.map(s => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>)}</div>
    </div>
  </>;
}
