// Temporarily disabled custom login route
// Original code moved to route.ts.bak
export async function POST(request: Request) {
  return new Response("Login route temporarily disabled", { status: 503 });
} 