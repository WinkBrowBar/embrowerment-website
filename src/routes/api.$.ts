import { createFileRoute } from "@tanstack/react-router";
import { proxy } from "@/lib/proxy";

// Forwards /api/* to the backend (see lib/proxy.ts).
export const Route = createFileRoute("/api/$")({
  server: { handlers: { ANY: ({ request }) => proxy(request) } },
});