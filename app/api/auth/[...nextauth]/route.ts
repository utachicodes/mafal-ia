// Authentication removed

export async function GET() {
  return new Response(JSON.stringify({ message: "Authentication disabled" }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  })
}

export async function POST() {
  return new Response(JSON.stringify({ message: "Authentication disabled" }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  })
}
