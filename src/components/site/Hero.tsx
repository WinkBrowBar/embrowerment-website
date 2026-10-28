import { IMG, LINKS } from "./data";
import { SmartLink } from "./ui";

/* Full-screen hero: rotated photo collage in the background, copy bottom-left (same pattern as the Academy kit section). */
const TILES = [IMG.academy, IMG.products1, IMG.hero, IMG.kit, IMG.method, IMG.umbreen, IMG.pmu[2], IMG.products2, IMG.collection, IMG.products3, IMG.pmu[0], IMG.studio[0]];
const FACTS = ["Since 2014", "Personal consultations with Umbreen", "Certified Embrowerment® artists", "New York City"];

export function Hero() {
  return <section className="home-hero">
    <div className="home-hero-tiles" aria-hidden="true">{TILES.map((src, i) => <img key={i} src={src} alt="" {...(i < 4 ? { fetchPriority: "high" as const } : {})} />)}</div>
    <div className="home-hero-inner">
      <div className="home-hero-text reveal">
        <span className="eyebrow">Embrowerment® · by Umbreen Sheikh</span>
        <h1 className="h-display">Confidence begins in the <em className="acad-hl light">eye zone.</em></h1>
        <p className="home-lede">A method for brows, a mindset for life. Mapped to your bone structure, matched to your skin, built to stay yours.</p>
        <div className="row">
          <SmartLink href={LINKS.consult} className="btn-solid light">Book a consultation</SmartLink>
          <SmartLink href={LINKS.method} className="btn-mono light">Discover the Method</SmartLink>
        </div>
      </div>
      <ul className="home-hero-facts">{FACTS.map(f => <li key={f}>{f}</li>)}</ul>
    </div>
  </section>;
}