import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, money, type Course } from "@/lib/api";
import { useStore, WishButton, SafeImg, Accordion, FeaturedIn, ACADEMY, ACADEMY_IMG, ACADEMY_COURSES, ACADEMY_TESTIMONIALS, FORMAT_LABEL, type AcademyFormat } from "@/components/site";

export const Route = createFileRoute("/academy/")({
  head: () => ({
    meta: [
      { title: "Embrowerment® Academy — Brow & Lash Training in NYC" },
      { name: "description", content: "Learn threading, waxing, brow and lash extensions, lamination, tinting, lash lifting and semi-permanent makeup with Wink Brow Bar. Online, hybrid or in our Brooklyn studio." },
      { property: "og:title", content: "Embrowerment® Academy" },
      { property: "og:image", content: "https://www.embrowerment.com/images/academy.webp" },
    ],
  }),
  component: Academy,
});

/** Re-fetch on the client so "owned" reflects the signed-in user. */
export function useOwnedCourses(initial: Course[]) {
  const { user } = useStore();
  const [list, setList] = useState(initial);
  useEffect(() => { if (user) api<{ courses: Course[] }>("/courses").then(d => setList(d.courses)).catch(() => {}); else setList(initial); }, [user, initial]);
  return list;
}

export function CourseCard({ c }: { c: Course }) {
  const { add } = useStore();
  return <article className="course reveal">
    <div className="pcard-img">
      <Link to="/academy/$slug" params={{ slug: c.slug }}><SafeImg src={c.image} alt={c.title} loading="lazy" /></Link>
      <div className="pcard-wish"><WishButton kind="course" id={c.id} label={false} /></div>
      {c.comingSoon && <span className="tag">Coming soon</span>}
    </div>
    <div className="card-meta"><Link to="/academy/$slug" params={{ slug: c.slug }}><h3>{c.title}</h3></Link><span className="card-price">{money(c.price)}</span></div>
    {c.points.length > 0 && <ul>{c.points.map(p => <li key={p}>{p}</li>)}</ul>}
    {c.owned ? <Link to="/learn/$slug" params={{ slug: c.slug }} className="btn-solid">Start course</Link>
      : c.comingSoon ? <button className="btn-mono" disabled>Coming soon</button>
      : c.purchaseUrl ? <a className="btn-mono" href={c.purchaseUrl} target="_blank" rel="noopener noreferrer">Purchase course</a>
      : <button className="btn-mono" onClick={() => add({ kind: "course", ref: c.id, qty: 1 })}>Purchase course</button>}
  </article>;
}

const FILTERS: { id: AcademyFormat | "all"; label: string }[] = [
  { id: "all", label: "All" }, { id: "online", label: "Online" }, { id: "hybrid", label: "Hybrid" }, { id: "inperson", label: "In person" },
];

const FORMATS = [
  { n: "01", title: "Online", text: "On-demand lessons. Learn anywhere, at your pace, and come back to them whenever you need." },
  { n: "02", title: "Hybrid", text: "Theory online, then a hands-on practical day in our Brooklyn studio." },
  { n: "03", title: "In person", text: "Small-group training in the studio with live models and an educator beside you." },
];

const STEPS = [
  { title: "Learn", text: "Anatomy, mapping and technique in the Embrowerment® Method." },
  { title: "Practice", text: "Hands-on work with an educator, on mannequins and live models." },
  { title: "Get assessed", text: "Submit your work for review by the Wink education team." },
  { title: "Certified", text: "Receive your Embrowerment® Academy certificate and your pro kit." },
];

const FAQ = [
  { q: "Is the certificate a license?", a: <p>No. It certifies that you completed training in The Embrowerment® Method. In the US, beauty licenses are issued by each state, not by a training academy or the federal government.</p> },
  { q: "What license do I need to work on clients in New York?", a: <p>Threading, waxing, tinting, brow lamination, brow extensions, lash extensions and lash lifting are covered by a New York State esthetics license (600 hours) or a cosmetology license, both issued by the NY Department of State. A waxing-only license covers waxing. Semi-permanent makeup in New York City requires a Tattoo Artist License from the NYC Health Department, issued after its infection control course and exam.</p> },
  { q: "I'm outside New York. What do I need?", a: <p>Requirements vary by state. Check with your state's board of cosmetology before you offer these services.</p> },
  { q: "Can I enroll without a license?", a: <p>Yes. Students and licensing candidates are welcome. You'll need the license your state requires before you work on paying clients.</p> },
  { q: "What tint products are allowed in New York?", a: <p>New York allows brow and lash dyeing only with FDA-authorized color additives, used as the manufacturer directs. The Tinting course covers product selection and patch testing.</p> },
  { q: "How do I access my course?", a: <p>After checkout, log in at <a href={ACADEMY.login} target="_blank" rel="noopener noreferrer">academy.winkbrowbar.com</a> to start your lessons and download your certificate.</p> },
];

const TICKER = ACADEMY_COURSES.map(c => c.title);

function Academy() {
  const [format, setFormat] = useState<AcademyFormat | "all">("all");
  const courses = format === "all" ? ACADEMY_COURSES : ACADEMY_COURSES.filter(c => c.formats.includes(format));
  return <div className="acad">
    {/* HERO — dark, text left, photo grid right */}
    <section className="acad-hero">
      <div className="acad-hero-text reveal">
        <span className="eyebrow">Embrowerment® Academy · by Wink Brow Bar</span>
        <h1 className="h-display">Learn the <em className="acad-hl light">Method</em> behind NYC's best brows</h1>
        <p>Professional brow and lash training, taught online, hybrid or in our Brooklyn studio. Every course ends with a certificate and a pro kit.</p>
        <div className="row">
          <a href="#courses" className="btn-solid light">Explore courses</a>
          <a href={ACADEMY.login} className="btn-mono light" target="_blank" rel="noopener noreferrer">Student login</a>
        </div>
      </div>
      <div className="acad-hero-grid">
        <div className="acad-diamond">
          {ACADEMY_IMG.hero.map((src, i) => <figure key={src} className={`g${i + 1}`}><img src={src} alt="" {...(i === 0 ? { fetchPriority: "high" as const } : { loading: "lazy" as const })} /></figure>)}
        </div>
      </div>
    </section>

    <FeaturedIn />

    {/* FORMATS */}
    <section className="feat" id="formats">
      <div className="feat-head reveal">
        <h2 className="h-display">Pick your <em className="acad-hl">format.</em></h2>
        <div className="feat-copy"><p>Three ways to learn the Embrowerment® Method. Every route ends in the same place: certified, with a pro kit in your hands.</p></div>
      </div>
      <div className="acad-formats">
        {FORMATS.map(f => <div className="acad-format reveal" key={f.n}><span className="work-no">{f.n}</span><h3>{f.title}</h3><p>{f.text}</p></div>)}
      </div>
    </section>

    {/* TICKER */}
    <div className="acad-ticker" aria-label="Courses">
      <div className="acad-ticker-track">
        {[0, 1].map(k => <ul key={k} aria-hidden={k === 1 || undefined}>{TICKER.map(t => <li key={t}>{t}</li>)}</ul>)}
      </div>
    </div>

    {/* COURSES */}
    <section className="feat acad-courses" id="courses">
      <div className="acad-courses-head reveal">
        <div>
          <h3 className="eyebrow">Eight skills · One Method</h3>
          <h2 className="h-display">The <em className="acad-hl">courses.</em></h2>
        </div>
        <div className="work-filters" role="group" aria-label="Filter by format">
          {FILTERS.map(f => <button key={f.id} type="button" aria-pressed={format === f.id} className={format === f.id ? "on" : ""} onClick={() => setFormat(f.id)}>{f.label}</button>)}
        </div>
      </div>
      <div className="acad-grid">
        {courses.map(c => {
          const n = String(ACADEMY_COURSES.indexOf(c) + 1).padStart(2, "0");
          return <article className="acad-card" key={c.slug}>
            <div className="acad-card-img">
              <SafeImg src={c.image} alt={c.title} loading="lazy" />
              <span className="work-chip">{c.formats.map(f => FORMAT_LABEL[f]).join(" · ")}</span>
              <span className="acad-card-no">{n}</span>
            </div>
            <div className="acad-card-body">
              <h3>{c.title}</h3>
              <p>{c.blurb}</p>
              <div className="acad-card-foot">
                <span className="card-price">{money(c.price)}</span>
                {c.comingSoon ? <button type="button" className="btn-mono" disabled>Coming soon</button> : <a href={c.purchaseUrl} className="btn-mono" target="_blank" rel="noopener noreferrer">Enroll</a>}
              </div>
            </div>
          </article>;
        })}
      </div>
    </section>

    {/* CERTIFICATION */}
    <section className="feat acad-cert" id="certification">
      <div className="feat-head wide reveal"><h2 className="h-display">From first lesson to <em className="acad-hl">certified.</em></h2></div>
      <ol className="acad-steps">
        {STEPS.map((s, i) => <li key={s.title} className="reveal"><span className="work-no">Step 0{i + 1}</span><h3>{s.title}</h3><p>{s.text}</p></li>)}
      </ol>
    </section>

    {/* PRO KITS — rotated collage */}
    <section className="acad-kit">
      <div className="acad-kit-tiles" aria-hidden="true">{ACADEMY_IMG.kit.map((src, i) => <img key={i} src={src} alt="" loading="lazy" />)}</div>
      <div className="acad-kit-text reveal">
        <h3 className="eyebrow">Pro kits</h3>
        <h2 className="h-display">Tools made for <em className="acad-hl light">the Method.</em></h2>
        <p>Every course ends with a professional kit in your hands. Want to practise from day one? Add a starter kit at checkout.</p>
        <div className="row"><span className="acad-kit-price">Add-on kit · {money(ACADEMY.kitPrice)}</span><a href="#courses" className="btn-solid light">See courses</a></div>
      </div>
    </section>

    {/* STUDIO */}
    <section className="acad-studio" id="studio">
      <div className="acad-studio-imgs">
        <figure className="ph main"><img src={ACADEMY_IMG.studio} alt="Embrowerment® pro tools: tweezers, scissors, brow tool and spoolie" loading="lazy" /></figure>
        <figure className="ph sub"><img src={ACADEMY_IMG.studio2} alt="Beyond beauty at the Embrowerment® Academy" loading="lazy" /></figure>
      </div>
      <div className="method-body reveal">
        <h3 className="eyebrow">Train in our academy</h3>
        <h2 className="h-display">Brooklyn, Court Street.</h2>
        <div className="feat-copy">
          <p>Hybrid and in-person days run at our training academy: a working space with real models and an educator at every chair.</p>
          <p><b><a href={ACADEMY.studio.map} target="_blank" rel="noopener noreferrer">{ACADEMY.studio.line1}<br />{ACADEMY.studio.line2}</a></b></p>
          <a href={`tel:${ACADEMY.tel}`} className="more">{ACADEMY.phone} <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>

    {ACADEMY_TESTIMONIALS.length > 0 && <section className="pmu-quote">
      {ACADEMY_TESTIMONIALS.map(t => <figure className="reveal" key={t.name}>
        <span className="pmu-quote-mark" aria-hidden="true">“</span>
        <blockquote><p>{t.quote}</p></blockquote>
        <figcaption><span aria-hidden="true" />{t.name} · {t.course}</figcaption>
      </figure>)}
    </section>}

    {/* FAQ — same pattern as Permanent Makeup */}
    <section className="feat split dark" id="faq">
      <div className="faq-col"><h2 className="h-display reveal">FAQ</h2><Accordion items={FAQ.slice(0, 3)} defaultOpen={null} /></div>
      <div className="faq-col"><Accordion items={FAQ.slice(3)} defaultOpen={null} /></div>
    </section>

    {/* FINAL CTA */}
    <section className="acad-final">
      <h2 className="h-display reveal">Become an <em className="acad-hl">Embrowerment®</em> artist.</h2>
      <div className="row">
        <a href="#courses" className="btn-solid">Explore courses</a>
        <a href={ACADEMY.login} className="btn-mono" target="_blank" rel="noopener noreferrer">Student login</a>
      </div>
      <p>Salon or beauty school? Ask about group training: <a href={`mailto:${ACADEMY.email}`}>{ACADEMY.email}</a></p>
    </section>

    {/* STICKY BAR */}
    <div className="acad-bar">
      <span>Find a course <i>— in Brooklyn or online</i></span>
      <a href="#courses" className="btn-solid light">Find now</a>
    </div>
  </div>;
}