import { createFileRoute } from "@tanstack/react-router";
import { SmartLink } from "@/components/site";

export const Route = createFileRoute("/semi-permanent-makeup")({
  head: () => ({ meta: [
    { title: "Semi-Permanent Makeup — Embrowerment®" },
    { name: "description", content: "The Embrowerment® PMU artist network is coming soon." },
  ] }),
  component: SemiPermanentMakeup,
});

function SemiPermanentMakeup() {
  return <section className="acad-final soon-page">
    <span className="eyebrow">Embrowerment® PMU Artist Network</span>
    <h1 className="h-display">Semi-Permanent Makeup<br /><em className="acad-hl">Coming soon.</em></h1>
    <p >Join a growing network of artists united by one methodology, shared standards and a commitment to exceptional artistry.</p>
    <div className="row">
      <SmartLink href="/method" className="btn-mono">Back to the Method</SmartLink>
    </div>
  </section>;
}