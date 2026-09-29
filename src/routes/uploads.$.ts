import { createFileRoute } from "@tanstack/react-router";
import { proxy } from "@/lib/proxy";

// Forwards /uploads/* (admin-uploaded images) to the backend.
export const Route = createFileRoute("/uploads/$")({
  server: { handlers: { GET: ({ request }) => proxy(request), HEAD: ({ request }) => proxy(request) } },
});