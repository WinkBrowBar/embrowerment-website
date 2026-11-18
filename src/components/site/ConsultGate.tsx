import { Link } from "@tanstack/react-router";
import { LINKS } from "./data";

/** "Book a consultation" → our PMU Pre-Consult Eligibility Form. */
export function ConsultButton({ className = "btn-solid", children = "Book a consultation" }: { className?: string; children?: string }) {
  return <Link to={LINKS.consult as "/pmu-consultation"} className={className}>{children}</Link>;
}
