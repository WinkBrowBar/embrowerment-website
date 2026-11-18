import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { LINKS } from "@/components/site";
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
type Errors = Partial<Record<"firstName" | "lastName" | "phone" | "email" | "accutane" | "heardFrom" | "photo" | "form", string>>;

const MAX_PHOTO_MB = 8;
/** Optional marketing opt-in (unchecked by default). The exact wording is stored with each submission. */
const CONSENT_TEXT = "Yes, I'd like to receive news, offers and promotions from Embrowerment® by email and text message. Message frequency varies; message and data rates may apply. Reply STOP to opt out of texts or unsubscribe from emails at any time. Consent is not a condition of any purchase or service.";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function PmuConsultation() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [photoName, setPhotoName] = useState("");
  const top = useRef<HTMLDivElement>(null);

  // Prefill the email from the welcome box (?email=) or an earlier visit.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("email") || "";
    setEmail(fromUrl || savedPmuEmail());
  }, []);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const v = (k: string) => String(fd.get(k) ?? "").trim();
    const photo = fd.get("photo");
    const hasPhoto = photo instanceof File && photo.size > 0;
    if (!hasPhoto) fd.delete("photo");

    const errs: Errors = {};
    if (!v("firstName")) errs.firstName = "Please enter your first name.";
    if (!v("lastName")) errs.lastName = "Please enter your last name.";
    if (v("phone").replace(/\D/g, "").length < 10) errs.phone = "Please enter a valid phone number.";
    if (!EMAIL_RE.test(v("email"))) errs.email = "Please enter a valid email address.";
    if (!v("accutane")) errs.accutane = "Please choose an answer.";
    if (!v("heardFrom")) errs.heardFrom = "Please choose an answer.";
    if (hasPhoto && (photo as File).size > MAX_PHOTO_MB * 1048576) errs.photo = `Photo must be under ${MAX_PHOTO_MB} MB.`;
    setErrors(errs);
    if (Object.keys(errs).length) {
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    fd.set("page", window.location.pathname);
    if (fd.get("marketingConsent")) fd.set("consentText", CONSENT_TEXT);
    setSending(true);
    try {
      const res = await fetch(`${LEADS_API}/api/leads/pmu-consult`, { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const d = (data as { details?: Record<string, string[]>; error?: string }) ?? {};
        const fieldErrs: Errors = {};
        for (const [k, msgs] of Object.entries(d.details ?? {})) if (msgs[0]) fieldErrs[k as keyof Errors] = msgs[0];
        setErrors({ ...fieldErrs, form: d.error && !d.details ? d.error : "Please check the highlighted fields." });
        return;
      }
      const result = (data as { outcome: Outcome }).outcome;
      savePmuEmail(v("email").toLowerCase());
      track("pmu_consult_form_submitted", { outcome: result });
      setOutcome(result);
      requestAnimationFrame(() => top.current?.scrollIntoView({ block: "start" }));
    } catch {
      setErrors({ form: "We couldn't send your form. Please check your connection and try again." });
    } finally {
      setSending(false);
    }
  };

  const err = (k: keyof Errors) => errors[k] ? <p className="pcf-err" id={`pcf-${k}-err`} role="alert">{errors[k]}</p> : null;
  const inv = (k: keyof Errors) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `pcf-${k}-err` : undefined });

  return <section className="pcf" ref={top}>
    {outcome ? <Result outcome={outcome} /> : <form className="pcf-card" onSubmit={submit} noValidate>
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

      <p className="pcf-note">Please note pregnant clients are not able to do PMU Services.</p>

      <fieldset className="pcf-field">
        <legend>Can you confirm you are 18 or over.</legend>
        <label className="pcf-radio"><input type="radio" name="over18" value="yes" /> Yes</label>
        <label className="pcf-radio"><input type="radio" name="over18" value="no" /> No</label>
      </fieldset>

      <fieldset className="pcf-field" {...inv("heardFrom")} tabIndex={-1}>
        <legend>how did you hear of this service? <i>*</i></legend>
        <label className="pcf-radio"><input type="radio" name="heardFrom" value="wink-studio" /> In a Wink Brow Bar Studio</label>
        <label className="pcf-radio"><input type="radio" name="heardFrom" value="online-search" /> Online search</label>
        <label className="pcf-radio"><input type="radio" name="heardFrom" value="somewhere-else" /> Somewhere else</label>
        {err("heardFrom")}
      </fieldset>

      <div className="pcf-field">
        <b>Want to get advice sooner? Upload a photo of your full face with no makeup on your brows for review</b>
        <label className={`pcf-drop${photoName ? " has-file" : ""}`} {...inv("photo")}>
          <input type="file" name="photo" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? "")} />
          <svg width="44" height="30" viewBox="0 0 44 30" aria-hidden="true"><path d="M35 12.5A12 12 0 0 0 12.3 9 9 9 0 0 0 11 27h23a8 8 0 0 0 1-16.5Z" fill="currentColor" opacity=".35" /><path d="M22 23V12m0 0-4.5 4.5M22 12l4.5 4.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
          <strong>{photoName || "Browse Files"}</strong>
          <span>{photoName ? "Tap to choose a different photo" : "Drag and drop files here"}</span>
        </label>
        {err("photo")}
      </div>

      <label className="pcf-consent">
        <input type="checkbox" name="marketingConsent" value="yes" />
        <span>{CONSENT_TEXT}</span>
      </label>

      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="pcf-hp" aria-hidden="true" />

      <div className="pcf-submit">
        {errors.form && <p className="pcf-err" role="alert">{errors.form}</p>}
        <button type="submit" disabled={sending}>{sending ? "Sending…" : "Submit"}</button>
      </div>
    </form>}
  </section>;
}

function Result({ outcome }: { outcome: Outcome }) {
  if (outcome === "eligible") return <div className="pcf-card pcf-result pcf-result--big">
    <p><b>Thank You. Good News!</b></p>
    <p><b>You are eligible to move to the next Step.</b></p>
    <p><b>Please schedule Your Embrowerment® Virtual PMU Consultation <a href={LINKS.consultCalendar}>HERE</a></b></p>
  </div>;
  return <div className="pcf-card pcf-result">
    <p><b>Thank you for your interest in the Embrowerment® Method PMU Service.</b></p>
    <p>This approach is a standardised procedure ensuring safety and quality results.</p>
    {outcome === "under-18" ? <>
      <p>At this time, PMU services are not recommended under the age of 18.</p>
      <p>Please revisit after then. We look forward to seeing you then.</p>
    </> : <>
      <p>At this time, PMU services are not recommended for while you are on Accutane treatment.</p>
      <p>Please revisit six months after you finish treatment. We look forward to seeing you then.</p>
    </>}
  </div>;
}
