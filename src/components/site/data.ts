export const LINKS = {
  home: "/",
  method: "/method",
  pmu: "/permanent-makeup",
  pmuPolicies: "/pmu-policies",
  returns: "/returns",
  umbreen: "https://www.umbreen.com/about",
  umbreenSite: "https://www.umbreen.com",
  foundation: "https://www.embrowermentfoundation.org", // TODO: confirm the Foundation domain
  winkBrowBar: "https://www.winkbrowbar.com",
  instagram: "https://www.instagram.com/embrowerment",
  tiktok: "https://tiktok.com/@embrowerment",
  facebook: "https://www.facebook.com/thisisumbreen",
  consult: "https://form.jotform.com/260343754783059",
  lookbook: "https://lookbook.embrowerment.com/",
};

export const CONCIERGE = {
  phone: "646.798.2723",
  tel: "+16467982723",
  email: "hello@embrowerment.com",
  hours: "Monday–Sunday, 2:00 PM – 7:00 PM EST",
};

export const IMG = {
  logo: "/images/logo-white.png",
  hero: "/images/hero.webp",
  method: "/images/method.webp",
  pmu: ["/images/pmu-1.webp", "/images/pmu-2.webp", "/images/pmu-3.webp"] as const,
  products1: "/images/products-1.webp",
  collection: "/images/collection.webp",
  kit: "/images/kit.webp",
  products2: "/images/products-2.webp",
  products3: "/images/products-3.webp",
  academy: "/images/academy.webp",
  studio: ["/images/studio-1.webp", "/images/studio-2.webp", "/images/studio-3.webp"] as const,
  umbreen: "/images/umbreen.webp",
};

/* Permanent makeup results gallery — files live in public/images/pmu-work/ (full) and pmu-work/sm/ (grid size) */
const PMU_WORK_SIZES = [[1280, 1600], [900, 1600], [1080, 1080], [1280, 1600], [1200, 1600], [1280, 1600], [1200, 1600], [1280, 1600], [900, 1600], [1080, 1080], [1143, 1600], [1281, 1600], [900, 1600], [1200, 1600], [1080, 1080], [1274, 1600], [1200, 1600], [900, 1600], [1200, 1600], [1080, 1080], [900, 1600], [887, 1109], [1143, 1600], [900, 1600], [1280, 1600], [1200, 1600], [900, 1600], [1024, 1280], [1200, 1600], [1200, 1600], [900, 1600], [1600, 1067], [900, 1600], [1280, 1600], [1200, 1600], [900, 1600], [1143, 1600], [1200, 1600], [1200, 1600], [1143, 1600], [1200, 1600], [1600, 1200], [1600, 1200], [1600, 1143], [1067, 1600], [1600, 1200]] as const;
/* b = before & after, r = results, s = in the studio — one letter per photo, same order as the files */
const PMU_WORK_TAGS = "brbbrbrbbbsbbrbbrbrbbbsrbrbrrrbsrbrbsrrsrrrssr";
export const PMU_WORK_CATS = { b: "Before & After", r: "Results", s: "In the Studio" } as const;
export type PmuCat = keyof typeof PMU_WORK_CATS;
const PMU_WORK_LAST = ["01", "04", "07"]; // shown at the end of the gallery
const PMU_WORK_ALL = PMU_WORK_SIZES.map(([w, h], i) => {
  const n = String(i + 1).padStart(2, "0");
  return { n, src: `/images/pmu-work/${n}.webp`, thumb: `/images/pmu-work/sm/${n}.webp`, w, h, cat: PMU_WORK_TAGS[i] as PmuCat };
});
export const PMU_WORK = [...PMU_WORK_ALL.filter((p) => !PMU_WORK_LAST.includes(p.n)), ...PMU_WORK_ALL.filter((p) => PMU_WORK_LAST.includes(p.n))];
export const PMU_REELS = [
  { title: "Healed Ombré Brows", note: "Healed" },
  { title: "Shaping to Ombré", note: "Process" },
  { title: "Ombré Brows", note: "Fresh" },
  { title: "Before to Healed", note: "Transformation" },
].map((r, i) => ({ ...r, src: `/video/pmu-reel-${i + 1}.mp4`, poster: `/video/pmu-reel-${i + 1}.webp` }));

/* "As featured in" press strip — drop logo files into public/images/press/ with these names; until a file exists the name shows as text */
export const PRESS = [
  { name: "Harper's Bazaar", logo: "/images/press/harpers-bazaar.png" },
  { name: "Condé Nast Traveler", logo: "/images/press/conde-nast-traveler.png" },
  { name: "Allure", logo: "/images/press/allure.png" },
  { name: "Town & Country", logo: "/images/press/town-country.png" },
  { name: "New York", logo: "/images/press/new-york.png" },
  { name: "Cosmopolitan", logo: "/images/press/cosmopolitan.png" },
  { name: "The Hollywood Reporter", logo: "/images/press/hollywood-reporter.png" },
  { name: "Glamour", logo: "/images/press/glamour.png" },
  { name: "Vogue", logo: "/images/press/vogue.png" },
  { name: "Refinery29", logo: "/images/press/refinery29.png" },
];