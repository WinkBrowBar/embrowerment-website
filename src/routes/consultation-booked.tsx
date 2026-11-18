import { createFileRoute } from "@tanstack/react-router";
import { CONCIERGE } from "@/components/site";

/** Confirmation shown after a PMU consultation is booked in GHL. Not in the menu; hidden from search. */
export const Route = createFileRoute("/consultation-booked")({
  head: () => ({ meta: [
    { title: "Consultation booked — Embrowerment®" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: ConsultationBooked,
});

function ConsultationBooked() {
  return <section className="booked">
    <h1 className="h-display">You are booked for the Embrowerment® PMU Virtual Consultation – we are so happy to be on this journey with you.</h1>
    <p className="booked-note">If possible, have no makeup on your brows for the virtual appointment.</p>

    <div className="booked-concierge">
      <h2>Embrowerment® Concierge</h2>
      <p className="booked-phone">
        {CONCIERGE.phone}
        <span aria-hidden="true">·</span><a href={`tel:${CONCIERGE.tel}`}>Call</a>
        <span aria-hidden="true">·</span><a href={`sms:${CONCIERGE.tel}`}>Text</a>
      </p>
      <a href={`mailto:${CONCIERGE.email}`}>{CONCIERGE.email}</a>
      <a href="/">Embrowerment.com</a>
      <p>Concierge availability: Monday–Sunday, 2:00 PM – 7:00 PM EST.</p>
      <p>Messages received outside of these hours will be responded to promptly during concierge hours.</p>
    </div>
  </section>;
}
