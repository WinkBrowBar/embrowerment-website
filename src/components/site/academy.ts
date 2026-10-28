import { IMG } from "./data";

/* Images: only the Embrowerment® site's own photos (public/images). */
export const ACADEMY_IMG = {
  hero: [IMG.umbreen, IMG.academy, IMG.method, IMG.studio[0]] as const,
  studio: IMG.kit,
  studio2: "https://backend.winkbrowbar.com/uploads/media/Beyond_beauty-1769681931.png",
  kit: [IMG.kit, IMG.collection, IMG.products1, IMG.studio[2], IMG.products2, IMG.kit, IMG.products3, IMG.collection, IMG.studio[0], IMG.pmu[0], IMG.kit, IMG.studio[1]] as const,
};

/* Academy content — HARDCODED for now. Swap ACADEMY_COURSES for an API call when courses go dynamic. */

export const ACADEMY = {
  kajabi: "https://academy.winkbrowbar.com",          // Kajabi custom domain
  login: "https://academy.winkbrowbar.com/login",
  kitPrice: 500,                                       // add-on kit at checkout (demo)
  studio: { line1: "194 Court Street, Suite 5", line2: "Brooklyn, NY 11201", map: "https://www.google.com/maps/search/?api=1&query=194+Court+St+Suite+5+Brooklyn+NY+11201" },
  phone: "+1 646-798-2723",
  tel: "+16467982723",
  email: "hello@winkbrowbar.com",
};

export type AcademyFormat = "online" | "hybrid" | "inperson";
export const FORMAT_LABEL: Record<AcademyFormat, string> = { online: "Online", hybrid: "Hybrid", inperson: "In person" };

export type AcademyCourse = {
  slug: string;
  title: string;
  formats: AcademyFormat[];
  blurb: string;
  price: number;        // demo price
  image: string;
  purchaseUrl: string;  // Kajabi offer checkout URL
  comingSoon: boolean;  // true = show "Coming soon" instead of Enroll
};

const c = (slug: string, title: string, formats: AcademyFormat[], blurb: string, image: string): AcademyCourse =>
  ({ slug, title, formats, blurb, price: 1000, image, purchaseUrl: `${ACADEMY.kajabi}/offers/${slug}`, comingSoon: true });

export const ACADEMY_COURSES: AcademyCourse[] = [
  c("threading", "Threading", ["hybrid", "inperson"], "Signature brow threading with organic cotton thread, plus full-face threading.", IMG.academy),
  c("waxing", "Waxing", ["hybrid", "inperson"], "Brow mapping and sculpted arches with chocolate wax, plus facial waxing.", IMG.method),
  c("brow-extensions", "Brow Extensions", ["hybrid"], "Custom-matched fibers for fullness and shape, and refills after shedding.", IMG.pmu[0]),
  c("keratin-brow-lamination", "Keratin Brow Lamination", ["online", "hybrid"], "The 3-step lift and set, plus the lamination, tint and shape combo.", IMG.products1),
  c("tinting", "Tinting", ["online", "hybrid"], "Classic and premium brow and lash tint, hybrid stain and lightening.", IMG.products2),
  c("lash-extensions", "Lash Extensions", ["hybrid", "inperson"], "Classic single lash sets, express sets and strip application.", IMG.hero),
  c("lash-lifting", "Lash Lifting", ["online", "hybrid"], "Keratin and premium lash lifts with tint.", IMG.products3),
  c("semi-permanent-makeup", "Semi-Permanent Makeup", ["hybrid", "inperson"], "Nanoblading, microblading, microshading, ombré brows and liner, the Embrowerment® way.", IMG.pmu[1]),
];

/* Student testimonials — Umbreen supplies these. The section stays hidden while this is empty. */
export const ACADEMY_TESTIMONIALS: { quote: string; name: string; course: string }[] = [];