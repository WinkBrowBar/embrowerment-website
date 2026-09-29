import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Ph, Accordion, Concierge, SmartLink, IMG, LINKS } from "@/components/site";

export const Route = createFileRoute("/permanent-makeup")({
  head: () => ({ meta: [
    { title: "Permanent Makeup — Embrowerment®" },
    { name: "description", content: "Embrowerment® Advanced Semi-Permanent Makeup: nanoblading, microshading, ombre and hybrid brows, and eyeliner. Consultations personally conducted by Umbreen." },
  ] }),
  component: PMU,
});

type Row = [name: string, desc: string, price: string];
const FOLLOW: Row = ["FOLLOW UP", "Included for free with any of the initial brow services when booked six (6) weeks after initial appointment", "$350"];
const BROWS: Row[] = [
  ["Nanoblading", "Cutting-edge technique. Precision hair-like strokes", "$950"],
  ["Microshading / Combo Brows", "Combines hair-like strokes with powder-like shading", "$950"],
  ["Ombre / Powder Brows", "Gives the effect of makeup colored in brows", "$950"],
  ["Hybrid Brows", "Custom technique mixing any of the other brow services", "$1000"],
  ["Microblading", "Hair-like strokes", "$900"],
  FOLLOW,
];
const EYES: Row[] = [
  ["Classic Eyeliner Winged", "Replaces the need to wear eyeliner every day", "$900"],
  ["Lash Line Enhancement No Wing", "Make your lashes appear fuller and fill in gaps", "$900"],
  FOLLOW,
];
const POST: Row[] = [
  ["Annual", "9-15 months after your follow-up appointment", "$600"],
  ["AFTER 15 MONTHS", "Any appointment made after the 15 month time frame is considered a new service.", ""],
];

const FAQ = [
  { q: "What is it?", a: <><p>{"A non-invasive specialized hyper-realistic cosmetic tattooing technique to perfect Brows and Eyes that lasts 1-3 years."}</p></> },
  { q: "What are the types?", a: <><p><b>Microblading</b>{" \u2014 A semi-permanent pigment deposited onto the skin with fine hair-like strokes, using a handheld tool. A touch up is required in 4-5 weeks and is included in the overall fee."}</p><p><b>Microshading</b>{" \u2014 Combines hair-like strokes with powder brow shading to create brows that are both natural, fluffy, and defined."}</p><p><b>NanoBlading</b>{" \u2014 The most innovative procedure in the Microblading family. Similar to Microblading, Nanoblading utilizes a much smaller needle than Microblading which improves precision to produce even more natural looking hair like stroke results."}</p><p><b>Ombre / Powder Brows</b>{" \u2014 Also known as ombre brows, powder brows give the effect of make up \u201ccolored in\u201d brows. This advanced technique is done by applying custom color into the brow area with a tattoo machine. Results are waterproof and smudge-proof, ideal for oily skin types."}</p><p><b>Classic Eyeliner</b>{" \u2014 Classic Eyeliner is a semi permanent treatment you can receive that replaces the need to wear eyeliner each day. Semi Permanent eyeliner involves using a tattooing technique to apply ink along the lash line to create the appearance of fuller lashes."}</p><p><b>Lash Line Enhancement</b>{" \u2014 Lash line enhancement is the shaded liner alongside the lash line which make your lashes appear fuller, fill in the gaps and help the eyes pop up more."}</p></> },
  { q: "Is everyone a candidate?", a: <><p>{"No, unfortunately not. We pride ourselves on your safety and will only take clients we believe it is safe to perform these services on."}</p></> },
  { q: "What to expect", a: <><p>{"The first session is estimated to last 2.5hrs. Touch-up sessions are 2 hrs."}</p><p>{"Your brows are mapped with a temporary marker and before photos are taken. After the procedure you receive detailed aftercare instructions and a follow-up is scheduled."}</p></> },
  { q: "Is it like a tattoo?", a: <><p>{"This is a common misconception. It is a tattoo but it is a cutting edge hyperrealistic one, with 3D effects, so not one in the traditional sense."}</p><p>{"Semi Permanent Makeup cannot be washed off. It is a non-invasive technique, where color is applied into the upper dermal layer of the skin superficially which means over time the ink will fade away."}</p></> },
  { q: "Is it good for people with thin or no brows?", a: <><p>{"Yes - these techniques are a great choice for people with thin sparse brows who have tried everything else when it comes to achieving the perfect brows for them."}</p></> },
  { q: "How long does it last?", a: <><p>{"It can last anywhere from one to three years depending upon your skin type. Oily skin may fade faster, though typically not before one year. Touch-ups every 18-24 months are recommended for maintenance."}</p></> },
  { q: "Do you still have to shape and groom your eyebrows after the service?", a: <><p>{"Yes, you will still have to shape your brows after. If you had hair growth before the service you will still have hair growth after the service- this will not be affected by the technique."}</p></> },
  { q: "Should I take time off work and how long does it take to heal?", a: <><p>{"No. There's no downtime associated with the treatment. Care must be taken for the first 7-10 days and the redness will disappear in a day or two. Brows will initially appear darker, but this won't stop you from going about your day."}</p></> },
  { q: "Are the tools sanitized?", a: <><p>{"Absolutely. All tools and supplies used in the procedure are thoroughly cleaned and sterilized."}</p></> },
  { q: "Is it painful?", a: <><p>{"Everyone has a different level of sensitivity, but a topical anesthetic is applied before and during the treatment to alleviate any sensation or discomfort. You may feel slightly more sensitive during your menstrual cycle."}</p></> },
  { q: "How long after chemotherapy can I do this?", a: <><p>{"About 2-3 months. It may be sooner if you can provide a letter from your doctor to say it's OK to proceed. Some clients also choose to schedule their appointment before starting chemotherapy."}</p></> },
  { q: "Your prices seem high, why am I finding cheaper options elsewhere?", a: <><p>{"Semi-Permanent Makeup is a meticulous procedure and results can vary from artist to artist. Remember this is your face, so it does matter who you go to, and this is not a service to skimp on! Our artists are licensed and experienced, and many are trainers."}</p></> },
  { q: "If I want to do Sculptra, Botox or fillers, when should I have my service?", a: <><p>{"It's better to have the service before Sculptra or Botox even by a couple of days, so the brow area doesn't need to be rubbed while the injectable settles."}</p></> },
  { q: "Can I schedule a consultation before the appointment?", a: <><p>{"Yes, all sessions start with a free consultation. This helps us to assess your needs so that we can customize the service uniquely for you."}</p></> },
  { q: "Will you draw on my eyebrows and eyelids first so I can see what they will look like?", a: <><p>{"Yes, all sessions start with a free consultation. This helps us to assess your needs so that we can customize the service uniquely for you."}</p></> },
  { q: "Do you do brow tattoo removals?", a: <><p>{"Not currently."}</p></> },
  { q: "How long after the semi-permanent makeup service can I shape my brows?", a: <><p>{"About 10 days."}</p></> },
  { q: "How long should I wait to get semi-permanent brows after a brow lamination?", a: <><p>{"Anything after 14 days is ok."}</p></> },
  { q: "If I want to do both the lash liner and brow, can it be done on the same day and how long does it take?", a: <><p>{"Yes! The appointment would take 4.5 hours (2 hours for the lash line and 2.5 hours for your brows)."}</p></> },
  { q: "I work out almost every day and sweat. Do I need to be careful after the appointment?", a: <><p>{"Yes, the first 3 days it's better not to do heavy cardio or hot yoga. Exercising with weights is okay. No sauna for the first 7 days."}</p></> },
];

function PriceList({ title, rows }: { title: string; rows: Row[] }) {
  return <div className="plist reveal">
    <h3>{title}</h3>
    <ul>{rows.map(([n, d, p]) => <li key={n + d}><div><b>{n}</b><span>{d}</span></div>{p && <em>{p}</em>}</li>)}</ul>
  </div>;
}

function PMU() {
  const book = <SmartLink href={LINKS.consult} className="btn-solid">Book a Consultation</SmartLink>;
  const lookbook = <SmartLink href={LINKS.lookbook} className="btn-mono">View the Lookbook</SmartLink>;
  return <>
    <PageHero title="permanent makeup" image={IMG.products1} alt="Woman with a glowing natural makeup look">
      <div className="row">{book}{lookbook}</div>
      <p>Consultations are personally conducted by Umbreen at no- charge and are designed solely to assess candidacy, suitability, and long-term outcomes. If you are booked following consultation and approval, the service is performed by certified and vetted artists who are certified in the Embrowerment® Method.</p>
    </PageHero>

    <section className="method">
      <Ph src={IMG.method} alt="Model portrait in natural light" />
      <div className="method-body reveal">
        <h3 className="eyebrow">LOVED BY 100'S OF CLIENTS</h3>
        <h3 className="h-display">NEXT GEN: YOUR BEST BROWS</h3>
        <div className="feat-copy">
          <p><b>Our Embrowerment® Advanced Semi-Permanent Makeup Method is the next generation in creating perfectly balanced, full &amp; natural looking brows that last years.</b></p>
          {book}
        </div>
      </div>
    </section>

    <section className="feat">
      <div className="feat-head wide reveal"><h2 className="h-display">Pricing</h2></div>
      <div className="plist-grid">
        <PriceList title="BROWS" rows={BROWS} />
        <PriceList title="Eyes" rows={EYES} />
      </div>
    </section>

    <section className="feat split dark">
      <div className="faq-col"><h2 className="h-display reveal">FAQ</h2><Accordion items={FAQ.slice(0, Math.ceil(FAQ.length / 2))} /></div>
      <div className="faq-col"><Accordion items={FAQ.slice(Math.ceil(FAQ.length / 2))} defaultOpen={null} /></div>
    </section>

    <section className="feat">
      <div className="feat-head wide reveal"><h2 className="h-display">PRICING</h2></div>
      <div className="plist-grid"><PriceList title="Post Follow-Up" rows={POST} /></div>
    </section>

    <Concierge title="Embrowerment® Concierge" quoteTitle="Contact us" quote={{ text: "My brows were custom mapped to align with my face and bone structure, the brow color was matched to my liking. The results were impeccable and I was on a zoom call later the same day.", by: "PMU Client" }} />

    <section className="feat">
      <div className="feat-head reveal"><h3 className="h-display">We have years of experience in all skin tones and types</h3>
        <div className="feat-copy"><p>See healed results across skin tones, types and techniques.</p><SmartLink href={LINKS.lookbook} className="more">View the Lookbook <span aria-hidden="true">→</span></SmartLink></div></div>
      <div className="grid-3">
        <Ph src={IMG.pmu[0]} alt="Black and white silhouette behind sheer mesh" />
        <Ph src={IMG.pmu[1]} alt="Black and white motion-blurred portrait" />
        <Ph src={IMG.pmu[2]} alt="Black and white side profile portrait of a woman" />
      </div>
    </section>
  </>;
}