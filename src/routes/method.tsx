import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Ph, SmartLink, IMG } from "@/components/site";

export const Route = createFileRoute("/method")({
  head: () => ({ meta: [
    { title: "The Method — Embrowerment®" },
    { name: "description", content: "Discover the Embrowerment® Method: certification, the Embrowerment PMU artist network and careers." },
  ] }),
  component: MethodPage,
});

const CARDS = [
  { title: "Get Certified", text: "Master the Embrowerment® Method through our professional training and certification program.", cta: "Get Certified", href: "/academy", img: IMG.studio[0] },
  { title: "Become an Embrowerment PMU Artist", text: "Join a growing network of artists united by one methodology, shared standards and a commitment to exceptional artistry.", cta: "Join the Network", href: "/semi-permanent-makeup", img: IMG.studio[1] },
  { title: "Careers", text: "Begin your career with Embrowerment® through hands-on training, mentorship and a clear path to certification.", cta: "Apply for the Embrowerment Apprenticeship Program", href: "#inquire", img: IMG.studio[2] },
];

function MethodPage() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: FormEvent) => { e.preventDefault(); setSent(true); };
  return <>
    <section className="mhero">
      <div className="mhero-text">
        <span className="eyebrow">The Embrowerment® Method</span>
        <h1 className="h-display">One Method.<br /><em className="acad-hl">One Standard.</em></h1>
        <p className="mhero-lede">Our proprietary, science-led approach to permanent makeup artistry. Every Embrowerment-certified artist is trained in the same principles of facial anatomy, precision, technique and aesthetic balance.</p>
        <div className="row">
          <SmartLink href="/academy" className="btn-solid">Get Certified</SmartLink>
          <SmartLink href="#inquire" className="btn-mono">Get in touch</SmartLink>
        </div>
      </div>
      <figure className="mhero-img"><img src={IMG.pmu[2]} alt="Black and white side profile portrait" fetchPriority="high" /></figure>
    </section>

    <section className="feat">
      <div className="feat-head wide mpaths-head"><span className="eyebrow">Your path</span><h2 className="h-display">Discover the Method</h2></div>
      <div className="tiers">
        {CARDS.map(c => <article className="tier path" key={c.title}>
          <Ph src={c.img} alt="" />
          <div className="tier-body">
            <h3 className="path-title">{c.title}</h3>
            {c.text && <p className="path-text">{c.text}</p>}
            <SmartLink href={c.href} className="more">{c.cta} <span aria-hidden="true">→</span></SmartLink>
          </div>
        </article>)}
      </div>
    </section>

    <section className="acad-final method-quote">
      <blockquote>
        <p className="h-display">“Their attention to detail and <em className="acad-hl">commitment to quality</em> truly stood out. We've already recommended them to others.”</p>
        <cite>— Former customer</cite>
      </blockquote>
    </section>

    <section className="feat split" id="inquire">
      <div><h3 className="h-display">Get in touch</h3><p className="lede">If you're interested in working with us, complete the form with a few details about your project. We'll review your message and get back to you within 48 hours.</p></div>
      {sent ? <p className="form-done">Thank you!</p> :
        <form className="form" onSubmit={onSubmit}>
          <label>Name<input required name="name" autoComplete="name" /></label>
          <label>Email<input required type="email" name="email" autoComplete="email" /></label>
          <label>Message<textarea name="message" rows={5} /></label>
          <button className="btn-solid" type="submit">Submit</button>
        </form>}
    </section>
  </>;
}