import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { IMG, LINKS } from "./data";

const SHOP_URL = "https://shop.embrowerment.com/collections/all";

const nav = [
  ["Permanent makeup", LINKS.pmu],
  ["Shop", SHOP_URL],
  ["Academy", "/academy"],
] as const;

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
      <Link to="/" className="hdr-logo" aria-label="Embrowerment home"><img src={IMG.logo} alt="Embrowerment" /></Link>
      <nav className="hdr-nav">{nav.map(([l, h]) => <NavLink key={l} label={l} href={h} />)}</nav>
      <div className="hdr-util">
        <button className="hdr-burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">{open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M3 8h18M3 16h18" />}</svg>
        </button>
      </div>
    </header>
    <div className={`hdr-drawer${open ? " open" : ""}`}>
      {nav.map(([l, h]) => <NavLink key={l} label={l} href={h} />)}
    </div>
  </>;
}
