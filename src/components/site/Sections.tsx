import { IMG, LINKS } from "./data";
import { ACADEMY_COURSES } from "./academy";
import { More, Ph, SmartLink } from "./ui";
import { ProductCollage } from "./ProductCollage";
import type { Product } from "@/lib/api";

export function Method() {
  return <section className="method" id="method">
    <Ph src={IMG.method} alt="Model framing her face with raised arms in soft sunlight" />
    <div className="method-body reveal">
      <span className="work-no">01 — The Method</span>
      <h2 className="h-display method-title">One Method. <em className="acad-hl">One Standard.</em> Wherever You Go.</h2>
      <div className="feat-copy">
        <p>The Embrowerment® Method is our proprietary, science-led approach to permanent makeup artistry. Every Embrowerment-certified artist is trained in the same principles of facial anatomy, precision, technique and aesthetic balance.</p>
        <p>Through standardized education, protocols and ongoing professional development, we create consistency across our network - so wherever you choose an Embrowerment-certified artist, you can expect the same commitment to quality, safety and artistry.</p>
        <p className="method-tagline">One methodology. A network of artists. A standard you can trust.</p>
        <More href={LINKS.method}>Discover the Method</More>
      </div>
    </div>
  </section>;
}

export function PermanentMakeup() {
  return <section className="feat" id="permanent-makeup">
    <div className="feat-head reveal">
      <div><span className="work-no">02 — Permanent makeup</span><h2 className="h-display">Permanent <em className="acad-hl">makeup.</em></h2></div>
      <div className="feat-copy">
        <p>Semi-permanent brow work designed with the same precision as the method: measured, conservative, and built to age well with your face rather than follow a trend.</p>
        <More href={LINKS.pmu}>Learn more</More>
      </div>
    </div>
    <div className="grid-3">
      <Ph src={IMG.pmu[0]} alt="Black and white silhouette behind sheer mesh" />
      <Ph src={IMG.pmu[1]} alt="Black and white motion-blurred portrait" />
      <Ph src={IMG.pmu[2]} alt="Black and white side profile portrait of a woman" />
    </div>
  </section>;
}

export function Products({ products = [] }: { products?: Product[] }) {
  return <section className="feat" id="products">
    <div className="feat-head reveal">
      <div><span className="work-no">03 — Products</span><h2 className="h-display">The <em className="acad-hl">Products.</em></h2></div>
      <div className="feat-copy">
        <p>Professional-grade tools and formulas developed around the eye zone — sculpting pencils, precision instruments, serums and care, made to extend the method beyond the chair.</p>
        <More href="https://shop.embrowerment.com/collections/all">Shop all</More>
      </div>
    </div>
    <div className="collection"><img src={IMG.collection} alt="Embrowerment® product collection" loading="lazy" /></div>
    {products.length ? <ProductCollage products={products} /> : <div className="shop-row">
      <Ph src={IMG.products1} alt="Woman with a glowing natural makeup look against a blue sky" />
      <div className="card">
        <Ph src={IMG.kit} alt="Embrowerment® Pro Precision kit: tweezers, scissors, brow tool and spoolie" />
        <div className="card-meta">
          <div><h3>The Essential Embrowerment® Kit</h3><p>For professionals who desire precision artistry</p></div>
          <span className="card-price">$80</span>
        </div>
        <SmartLink href="/shop/pro-essentials-kit" className="btn-mono">Buy</SmartLink>
      </div>
      <Ph src={IMG.products3} alt="Man in a coffee shop photographed through glass" />
    </div>}
  </section>;
}

export function Academy() {
  return <section className="feat" id="academy">
    <div className="feat-head reveal">
      <div><span className="work-no">04 — Academy</span><h2 className="h-display">The <em className="acad-hl">Academy.</em></h2></div>
      <div className="feat-copy">
        <p>Education for beauty professionals who want the science behind the shape. Courses translate anatomy and growth behavior into technique you can use from your next client onward.</p>
        <More href="/academy">See courses</More>
      </div>
    </div>
    <ul className="home-courses reveal">
      {ACADEMY_COURSES.map((c, i) => <li key={c.slug}><a href="/academy#courses"><span className="work-no">{String(i + 1).padStart(2, "0")}</span>{c.title}<span aria-hidden="true">→</span></a></li>)}
    </ul>
    <div className="grid-3 home-academy-photos">
      <Ph src={IMG.academy} alt="Close-up of an eye and a defined brow" />
      <Ph src={IMG.studio[1]} alt="Globe lamp and swatches on a dark console" />
      <Ph src={IMG.studio[0]} alt="Hands working with material samples on a wooden table" />
    </div>
  </section>;
}

export function AboutUmbreen() {
  return <section className="about" id="about-umbreen">
    <div className="about-copy reveal">
      <span className="work-no">05 — Founder</span>
      <h2 className="h-display">About <em className="acad-hl light">Umbreen.</em></h2>
      <p>Embrowerment® was created by Umbreen Sheikh, a biomedical scientist, entrepreneur, and the creator of The Embrowerment® Method. Guided by the belief that confidence begins in the eye zone, she combines science, artistry, and education to help people look and feel more like themselves. Through Embrowerment®, her mission is to transform not only brows, but confidence itself.</p>
      <More href={LINKS.umbreen}>Meet Umbreen</More>
    </div>
    <div className="about-imgs">
      <Ph className="main" src={IMG.umbreen} alt="Umbreen Sheikh in a black suit, black and white portrait" />
    </div>
  </section>;
}