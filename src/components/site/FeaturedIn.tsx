import { useEffect, useRef, useState } from "react";
import { PRESS } from "./data";

function PressLogo({ name, logo, hidden }: { name: string; logo: string; hidden?: boolean }) {
  const [ok, setOk] = useState(true);
  const ref = useRef<HTMLImageElement>(null);
  // catches images that failed before hydration attached onError
  useEffect(() => { const i = ref.current; if (i && i.complete && i.naturalWidth === 0) setOk(false); }, []);
  return <li aria-hidden={hidden || undefined}>{ok ? <img ref={ref} src={logo} alt={hidden ? "" : name} loading="lazy" onError={() => setOk(false)} /> : <span>{name}</span>}</li>;
}

export function FeaturedIn() {
  return <section className="press" aria-label="As featured in">
    <h2 className="eyebrow">As featured in</h2>
    <div className="press-track">
      {/* list rendered twice so the loop is seamless */}
      <ul>{PRESS.map((p) => <PressLogo key={p.name} {...p} />)}{PRESS.map((p) => <PressLogo key={`${p.name}-2`} {...p} hidden />)}</ul>
    </div>
  </section>;
}