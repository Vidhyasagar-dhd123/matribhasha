export async function GET(request) {
  return new Response(JSON.stringify({ message: "Hello API" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request) {
  const data = await request.json();
  return new Response(JSON.stringify({ received: data }), { status: 201 });
}