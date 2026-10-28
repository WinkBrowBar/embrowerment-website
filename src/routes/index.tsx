import { createFileRoute } from "@tanstack/react-router";
import { api, type Product } from "@/lib/api";
import { Hero, Definition, Method, PermanentMakeup, Products, Academy, AboutUmbreen, FeaturedIn } from "@/components/site";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Embrowerment® — Confidence begins in the eye zone" },
    { name: "description", content: "Embrowerment® — a method for brows, a mindset for life. The Method, permanent makeup, products and academy by Umbreen Sheikh." },
    { property: "og:title", content: "Embrowerment®" },
    { property: "og:description", content: "Confidence begins in the eye zone. A method for brows - a mindset for life." },
    { property: "og:image", content: "/images/hero.webp" },
  ] }),
  loader: () => api<{ products: Product[] }>("/products").then(d => d.products).catch(e => { if (typeof window === "undefined") throw e; return [] as Product[]; }),
  component: Index,
});

const TICKER = ["Brow mapping", "Nanoblading", "Ombré brows", "Lamination", "Lash lifts", "Tinting", "Threading", "Academy"];

function Index() {
  const products = Route.useLoaderData();
  return <div className="home">
    <Hero />
    <FeaturedIn />
    <Definition />
    <Method />
    <PermanentMakeup />
    <div className="acad-ticker" aria-hidden="true">
      <div className="acad-ticker-track">
        {[0, 1].map(k => <ul key={k}>{TICKER.map(t => <li key={t}>{t}</li>)}</ul>)}
      </div>
    </div>
    <Products products={products} />
    <Academy />
    <AboutUmbreen />
  </div>;
}
