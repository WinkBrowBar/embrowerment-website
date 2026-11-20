import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CONCIERGE } from "@/components/site";
import { LEADS_API, savePmuEmail, savedPmuEmail, track } from "@/lib/leads";

/** PMU Pre-Consult Eligibility Form — replaces the JotForm. Submissions go to the umbreen backend (pmu_consult_requests). */
export const Route = createFileRoute("/pmu-consultation")({
  head: () => ({ meta: [
    { title: "PMU Pre-Consult Eligibility Form — Embrowerment®" },
    { name: "description", content: "Request your complimentary Embrowerment® PMU consultation." },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: PmuConsultation,
});

type Outcome = "eligible" | "under-18" | "accutane";
type Field = "firstName" | "lastName" | "phone" | "email" | "accutane" | "over18" | "heardFrom" | "heardFromDetail" | "heardFromOther";
type Errors = Partial<Record<Field | "form", string>>;
const FIELDS: Field[] = ["firstName", "lastName", "phone", "email", "accutane", "over18", "heardFrom", "heardFromDetail", "heardFromOther"];
/** Shown when "Somewhere else" is picked. */
const ELSEWHERE = [["google", "Google"], ["instagram", "Instagram"], ["tiktok", "TikTok"], ["youtube", "YouTube"], ["facebook", "Facebook"], ["other", "Other"]] as const;

/** GHL booking calendar — "Embrowerment® PMU Virtual Consultation". Eligible visitors are sent here. */
const GHL_BOOKING_URL = "https://api.leadconnectorhq.com/widget/booking/8urN9bqPMv8DmdgmODgV?backgroundColor=%23ffffff&primaryColor=%23040404FF&buttonText=Schedule+an+Embrowerment%C2%AE+PMU+Virtual+Consultation&showCalendarTitle=true&showCalendarDescription=true&showCalendarDetails=true&default=false";
const REDIRECT_SECONDS = 3;
const REQUEST_TIMEOUT_MS = 20_000;
/** Optional marketing opt-in (unchecked by default). The exact wording is stored with each submission. */
const CONSENT_TEXT = "Yes, I'd like to receive news, offers and promotions from Embrowerment® by email and text message. Message frequency varies; message and data rates may apply. Reply STOP to opt out of texts or unsubscribe from emails at any time. Consent is not a condition of any purchase or service.";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function PmuConsultation() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [heard, setHeard] = useState("");
  const [heardDetail, setHeardDetail] = useState("");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const top = useRef<HTMLDivElement>(null);

  // Prefill the email from the welcome box (?email=) or an earlier visit.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("email") || "";
    setEmail(fromUrl || savedPmuEmail());
  }, []);

  const validate = (fd: FormData): Errors => {
    const v = (k: string) => String(fd.get(k) ?? "").trim();
    const errs: Errors = {};
    if (!v("firstName")) errs.firstName = "Please enter your first name.";
    if (!v("lastName")) errs.lastName = "Please enter your last name.";
    const digits = v("phone").replace(/\D/g, "");
    if (!digits) errs.phone = "Please enter your phone number.";
    else if (digits.length < 10 || digits.length > 15) errs.phone = "Please enter a valid phone number, e.g. (646) 798-2723.";
    if (!v("email")) errs.email = "Please enter your email address.";
    else if (!EMAIL_RE.test(v("email"))) errs.email = "Please enter a valid email address, e.g. name@example.com.";
    if (!v("accutane")) errs.accutane = "Please answer this question.";
    if (!v("over18")) errs.over18 = "Please answer this question.";
    if (!v("heardFrom")) errs.heardFrom = "Please choose one option.";
    else if (v("heardFrom") === "somewhere-else") {
      if (!v("heardFromDetail")) errs.heardFromDetail = "Please tell us where you heard about us.";
      else if (v("heardFromDetail") === "other" && !v("heardFromOther")) errs.heardFromOther = "Please tell us where.";
    }
    return errs;
  };

  const focusFirstError = (form: HTMLFormElement) =>
    requestAnimationFrame(() => {
      const el = form.querySelector<HTMLElement>("[aria-invalid='true']");
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      el?.focus({ preventScroll: true });
    });

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget;
    const fd = new FormData(form);

    const errs = validate(fd);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setErrors({ ...errs, form: `Please fix ${Object.keys(errs).length === 1 ? "the highlighted field" : `the ${Object.keys(errs).length} highlighted fields`} above.` });
      focusFirstError(form);
      return;
    }

    fd.set("page", window.location.pathname);
    if (fd.get("marketingConsent")) fd.set("consentText", CONSENT_TEXT);
    setSending(true);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(`${LEADS_API}/api/leads/pmu-consult`, { method: "POST", body: fd, signal: ctrl.signal });
      const data = (await res.json().catch(() => ({}))) as { outcome?: Outcome; error?: string; details?: Record<string, string[]> };

      if (!res.ok) {
        if (res.status === 400 && data.details) {
          const fieldErrs: Errors = {};
          for (const [k, msgs] of Object.entries(data.details)) if (msgs?.[0] && FIELDS.includes(k as Field)) fieldErrs[k as Field] = msgs[0];
          setErrors({ ...fieldErrs, form: "Please fix the highlighted fields above." });
          focusFirstError(form);
        } else if (res.status === 429) {
          setErrors({ form: "Too many attempts in a short time. Please wait a few minutes and try again." });
        } else if (res.status === 400 && data.error) {
          setErrors({ form: data.error });
        } else {
          setErrors({ form: "Something went wrong on our side and your form wasn't sent. Please try again in a moment." });
        }
        return;
      }
      if (!data.outcome) {
        setErrors({ form: "Something went wrong on our side and your form wasn't sent. Please try again in a moment." });
        return;
      }

      savePmuEmail(String(fd.get("email") ?? "").trim().toLowerCase());
      track("pmu_consult_form_submitted", { outcome: data.outcome });
      setOutcome(data.outcome);
      requestAnimationFrame(() => top.current?.scrollIntoView({ block: "start" }));
    } catch (err) {
      setErrors({ form: (err as Error)?.name === "AbortError"
        ? "This is taking longer than expected. Please check your connection and try again."
        : "We couldn't reach our server. Please check your internet connection and try again." });
    } finally {
      clearTimeout(timer);
      setSending(false);
    }
  };

  /** Clear a field's error as soon as the visitor fixes it. */
  const onChange = (e: FormEvent<HTMLFormElement>) => {
    const name = (e.target as HTMLInputElement).name as Field;
    if (errors[name]) setErrors(({ [name]: _gone, ...rest }) => (Object.keys(rest).length === 1 && rest.form ? {} : rest));
  };

  const err = (k: keyof Errors) => errors[k] ? <p className="pcf-err" id={`pcf-${k}-err`} role="alert">{errors[k]}</p> : null;
  const inv = (k: keyof Errors) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `pcf-${k}-err` : undefined });

  return <section className="pcf" ref={top}>
    {outcome ? <Result outcome={outcome} /> : <form className="pcf-card" onSubmit={submit} onChange={onChange} noValidate aria-busy={sending}>
      <header className="pcf-head">
        <h1>PMU Pre- Consult Eligibility Form</h1>
        <p>Thank you for your interest in Embrowerment® PMU Services. A complimentary consultation is required to assess candidacy. All consultations are personally conducted by Umbreen at no- charge. If you are booked following consultation and approval, the service is performed by certified and vetted artists who are certified in the Embrowerment® Method.</p>
      </header>

      <fieldset className="pcf-field">
        <legend>Name <i>*</i></legend>
        <div className="pcf-two">
          <label><input name="firstName" autoComplete="given-name" {...inv("firstName")} /><span>First Name</span>{err("firstName")}</label>
          <label><input name="lastName" autoComplete="family-name" {...inv("lastName")} /><span>Last Name</span>{err("lastName")}</label>
        </div>
      </fieldset>

      <label className="pcf-field">
        <b>Phone Number <i>*</i></b>
        <input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="(000) 000-0000" {...inv("phone")} />
        <span>Please enter a valid phone number.</span>{err("phone")}
      </label>

      <label className="pcf-field">
        <b>Email <i>*</i></b>
        <input name="email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} {...inv("email")} />
        <span>example@example.com</span>{err("email")}
      </label>

      <fieldset className="pcf-field" {...inv("accutane")} tabIndex={-1}>
        <legend>Have you taken Accutane in the last 6 months? <i>*</i></legend>
        <label className="pcf-radio"><input type="radio" name="accutane" value="yes" /> Yes</label>
        <label className="pcf-radio"><input type="radio" name="accutane" value="no" /> No</label>
        {err("accutane")}
      </fieldset>

      <fieldset className="pcf-field" {...inv("over18")} tabIndex={-1}>
        <legend>Can you confirm you are 18 or over. <i>*</i></legend>
        <label className="pcf-radio"><input type="radio" name="over18" value="yes" /> Yes</label>
        <label className="pcf-radio"><input type="radio" name="over18" value="no" /> No</label>
        {err("over18")}
      </fieldset>

      <fieldset className="pcf-field" {...inv("heardFrom")} tabIndex={-1}>
        <legend>how did you hear of this service? <i>*</i></legend>
        {([["wink-studio", "In a Wink Brow Bar Studio"], ["online-search", "Online search"], ["somewhere-else", "Somewhere else"]] as const).map(([val, label]) =>
          <label className="pcf-radio" key={val}><input type="radio" name="heardFrom" value={val} checked={heard === val} onChange={() => setHeard(val)} /> {label}</label>)}
        {err("heardFrom")}
        {heard === "somewhere-else" && <fieldset className="pcf-sub" {...inv("heardFromDetail")} tabIndex={-1}>
          <legend>Where did you hear about us? <i>*</i></legend>
          <div className="pcf-chips">
            {ELSEWHERE.map(([val, label]) =>
              <label className="pcf-chip" key={val}><input type="radio" name="heardFromDetail" value={val} checked={heardDetail === val} onChange={() => setHeardDetail(val)} /><span>{label}</span></label>)}
          </div>
          {err("heardFromDetail")}
          {heardDetail === "other" && <label className="pcf-other">
            <input name="heardFromOther" maxLength={120} placeholder="Please tell us where" autoFocus {...inv("heardFromOther")} />
            {err("heardFromOther")}
          </label>}
        </fieldset>}
      </fieldset>

      <label className="pcf-consent">
        <input type="checkbox" name="marketingConsent" value="yes" />
        <span>{CONSENT_TEXT}</span>
      </label>

      <input type="text" name="hp_x7" tabIndex={-1} autoComplete="new-password" data-lpignore="true" data-1p-ignore className="pcf-hp" aria-hidden="true" />

      <div className="pcf-submit">
        {errors.form && <div className="pcf-alert" role="alert">
          <p>{errors.form}</p>
          <p className="pcf-alert-help">Need help? Contact our concierge at <a href={`tel:${CONCIERGE.tel}`}>{CONCIERGE.phone}</a> or <a href={`mailto:${CONCIERGE.email}`}>{CONCIERGE.email}</a>.</p>
        </div>}
        <button type="submit" className="btn-solid" disabled={sending}>{sending ? <><span className="pcf-spin" aria-hidden="true" /> Sending…</> : "Submit"}</button>
      </div>
    </form>}
  </section>;
}

/**
 * Shown under the "not right now" messages (under 18 / Accutane).
 * Services link to winkbrowbar.com; the shop block links to the Embrowerment shop.
 * TODO: set each service's exact page URL and image (image: "" shows a text tile).
 */
const ALTERNATIVES = [
  { kind: "Service", title: "Brow Lamination", text: "Lifts and sets your natural brows for a fuller, groomed look that lasts 6–8 weeks.", cta: "Book at Wink Brow Bar", url: "https://www.winkbrowbar.com/", image: "" },
  { kind: "Service", title: "Premium Tinting", text: "Longer-lasting colour with a soft shadow effect on the skin, lasting 14–21 days.", cta: "Book at Wink Brow Bar", url: "https://www.winkbrowbar.com/", image: "" },
  { kind: "Service", title: "Brow Extensions", text: "Instantly fuller-looking brows, with no commitment.", cta: "Book at Wink Brow Bar", url: "https://www.winkbrowbar.com/", image: "" },
  { kind: "Shop", title: "Shop Embrowerment®", text: "Brow pencils, styling wax and skincare from the Embrowerment® collection.", cta: "Shop now", url: "https://shop.embrowerment.com/collections/embrowerment", image: "https://shop.embrowerment.com/cdn/shop/files/03-Mechanical-Sculpting-Pencil.png?v=1793712418&width=800" },
];

function Alternatives() {
  return <section className="pcf-alt" aria-labelledby="pcf-alt-title">
    <h2 id="pcf-alt-title" className="pcf-alt-title">In the meantime, you may enjoy</h2>
    <div className="pcf-alt-grid">
      {ALTERNATIVES.map((a) => <a key={a.title} className="pcf-alt-card" href={a.url} target="_blank" rel="noopener noreferrer" onClick={() => track("pmu_alternative_click", { item: a.title })}>
        <span className="pcf-alt-img">{a.image ? <img src={a.image} alt="" loading="lazy" /> : <b>{a.title}</b>}</span>
        <span className="pcf-alt-body">
          <small>{a.kind}</small>
          <strong>{a.title}</strong>
          <span>{a.text}</span>
          <em>{a.cta} <span aria-hidden="true">→</span></em>
        </span>
      </a>)}
    </div>
  </section>;
}

function Result({ outcome }: { outcome: Outcome }) {
  if (outcome === "eligible") return <Eligible />;
  return <><div className="pcf-card pcf-result">
    <p><b>Thank you for your interest in the Embrowerment® Method PMU Service.</b></p>
    <p>This approach is a standardised procedure ensuring safety and quality results.</p>
    {outcome === "under-18" ? <>
      <p>At this time, PMU services are not recommended under the age of 18.</p>
      <p>Please revisit after then. We look forward to seeing you then.</p>
    </> : <>
      <p>At this time, PMU services are not recommended for while you are on Accutane treatment.</p>
      <p>Please revisit six months after you finish treatment. We look forward to seeing you then.</p>
    </>}
  </div>
  <Alternatives /></>;
}

/** Eligible: show the message, then send them to the GHL booking calendar after a short countdown. */
function Eligible() {
  const [left, setLeft] = useState(REDIRECT_SECONDS);
  useEffect(() => {
    if (left <= 0) { window.location.assign(GHL_BOOKING_URL); return; }
    const t = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  return <div className="pcf-card pcf-result pcf-result--big">
    <p><b>Thank You. Good News!</b></p>
    <p><b>You are eligible to move to the next Step.</b></p>
    <p><b>Please schedule Your Embrowerment® Virtual PMU Consultation <a href={GHL_BOOKING_URL}>HERE</a></b></p>
    <div className="pcf-redirect" aria-live="polite">
      <span className="pcf-redirect-num">{Math.max(left, 0)}</span>
      <span>{left > 0 ? `Taking you to booking in ${left} second${left === 1 ? "" : "s"}…` : "Opening booking…"}</span>
      <span className="pcf-redirect-bar"><i style={{ animationDuration: `${REDIRECT_SECONDS}s` }} /></span>
    </div>
  </div>;
}
