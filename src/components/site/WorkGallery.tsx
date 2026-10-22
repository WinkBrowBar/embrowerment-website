import { useCallback, useEffect, useMemo, useState, type PointerEvent as RPE } from "react";
import { LINKS, PMU_REELS, PMU_WORK, PMU_WORK_CATS, type PmuCat } from "./data";
import { SmartLink } from "./ui";

const FIRST = 12;
type Filter = "all" | PmuCat;
const FILTERS: [Filter, string][] = [["all", "All work"], ...(Object.entries(PMU_WORK_CATS) as [PmuCat, string][])];
const count = (f: Filter) => (f === "all" ? PMU_WORK.length : PMU_WORK.filter((p) => p.cat === f).length);

/** Permanent makeup portfolio: reels, filterable uncropped photo wall, lightbox. */
export function WorkGallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  const list = useMemo(() => (filter === "all" ? PMU_WORK : PMU_WORK.filter((p) => p.cat === filter)), [filter]);
  const shown = expanded ? list : list.slice(0, FIRST);
  const cur = open === null ? null : list[open];

  const tilt = (e: RPE<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--rx", `${((e.clientY - r.top) / r.height - 0.5) * -8}deg`);
    e.currentTarget.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 8}deg`);
  };
  const untilt = (e: RPE<HTMLElement>) => { e.currentTarget.style.removeProperty("--rx"); e.currentTarget.style.removeProperty("--ry"); };
  const pick = (f: Filter) => { setFilter(f); setExpanded(false); };
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + list.length) % list.length)), [list.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, step]);

  return <section className="work" aria-labelledby="work-title">
    <header className="work-top reveal">
      <div className="work-title">
        <span className="eyebrow">The Portfolio <i>Nº 01 — {PMU_WORK.length}</i></span>
        <h2 id="work-title" className="h-display">Every skin tone.<br /><em>Every brow</em> story.</h2>
      </div>
      <div className="work-intro">
        <p>Real clients from our studio. Every brow is mapped to the face and bone structure and colour-matched to the skin, and you can see it fresh, healed, and side by side.</p>
        <dl className="work-stats">
          <div><dt>{PMU_WORK.length}</dt><dd>Client results</dd></div>
          <div><dt>{PMU_REELS.length}</dt><dd>Video reels</dd></div>
          <div><dt>1–3<small>yrs</small></dt><dd>Lasting results</dd></div>
        </dl>
      </div>
    </header>

    <div className="work-ticker" aria-hidden="true"><div>
      {[0, 1].map((k) => <span key={k}>{["Before", "After", "Healed", "All skin tones", "Ombré", "Nanoblading", "Microshading", "Eyeliner"].map((w) => <b key={w}>{w}<i>✦</i></b>)}</span>)}
    </div></div>

    <div className="work-reels">
      {PMU_REELS.map((r, i) => (
        <figure key={r.src} className="work-reel">
          <video src={r.src} poster={r.poster} autoPlay muted loop playsInline preload="metadata" aria-label={r.title} />
          <figcaption>
            <span className="work-no">{String(i + 1).padStart(2, "0")}</span>
            <b>{r.title}</b>
          </figcaption>
          <span className="work-chip">{r.note}</span>
        </figure>
      ))}
    </div>

    <div className="work-bar">
      <div className="work-filters" role="tablist" aria-label="Filter results">
        {FILTERS.map(([f, label]) => (
          <button key={f} type="button" role="tab" aria-selected={filter === f} className={filter === f ? "on" : ""} onClick={() => pick(f)}>
            {label}<sup>{count(f)}</sup>
          </button>
        ))}
      </div>
      <SmartLink href={LINKS.lookbook} className="more">View the Lookbook <span aria-hidden="true">→</span></SmartLink>
    </div>

    <div className="work-wall" key={filter}>
      {shown.map((p, i) => (
        <button key={p.src} type="button" className="work-item" style={{ ["--d" as string]: `${(i % FIRST) * 45}ms` }} onClick={() => setOpen(i)} onPointerMove={tilt} onPointerLeave={untilt} aria-label={`Open ${PMU_WORK_CATS[p.cat]} photo Nº ${p.n}`}>
          <img src={p.thumb} width={p.w} height={p.h} loading="lazy" decoding="async" alt={`Embrowerment® permanent makeup — ${PMU_WORK_CATS[p.cat]} Nº ${p.n}`} />
          <span className="work-cap"><span className="work-no">Nº {p.n}</span><span>{PMU_WORK_CATS[p.cat]}</span></span>
          <span className="work-zoom" aria-hidden="true">+</span>
        </button>
      ))}
    </div>

    {list.length > FIRST && (
      <div className="work-more">
        <span className="work-progress"><i style={{ width: `${(shown.length / list.length) * 100}%` }} /></span>
        <span className="work-count">Showing {shown.length} of {list.length}</span>
        <button type="button" className="btn-mono" onClick={() => setExpanded((v) => !v)}>{expanded ? "Show less" : `View all ${list.length}`}</button>
      </div>
    )}

    {cur && open !== null && (
      <div className="work-lb" role="dialog" aria-modal="true" aria-label="Result photo viewer" onClick={() => setOpen(null)}>
        <figure onClick={(e) => e.stopPropagation()}>
          <img key={cur.src} src={cur.src} alt={`Embrowerment® permanent makeup — ${PMU_WORK_CATS[cur.cat]} Nº ${cur.n}`} />
          <figcaption><span className="work-no">Nº {cur.n}</span><span>{PMU_WORK_CATS[cur.cat]}</span><span className="work-lb-i">{open + 1} / {list.length}</span></figcaption>
        </figure>
        <button type="button" className="work-lb-x" onClick={() => setOpen(null)} aria-label="Close">×</button>
        <button type="button" className="work-lb-nav prev" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous photo">←</button>
        <button type="button" className="work-lb-nav next" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next photo">→</button>
      </div>
    )}
  </section>;
}
