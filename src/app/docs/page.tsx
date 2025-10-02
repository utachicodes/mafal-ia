export const dynamic = "force-static"

export default function DocsPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-3xl font-bold">Chatbot Endpoint Setup</h1>
      <p className="text-sm text-muted-foreground">Create a restaurant, copy its chatbot endpoint, and POST messages to receive AI replies.</p>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">1) Create a restaurant</h2>
        <p>Use the onboarding API to create a restaurant and get the endpoint:</p>
        <pre className="p-3 rounded bg-muted text-sm overflow-auto">
{`POST /api/onboarding/simple
Body: { "name": "My Restaurant", "description": "...", "cuisine": "..." }
Response: { ok: true, restaurant: { id }, chatbotEndpoint }`}
        </pre>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">2) Send a message to the chatbot</h2>
        <p>POST to the endpoint returned in step 1:</p>
        <pre className="p-3 rounded bg-muted text-sm overflow-auto">
{`POST /api/chatbots/{restaurantId}/messages
Content-Type: application/json

{
  "from": "+221771234567",
  "text": "Hello, what's on your menu?"
}`}
        </pre>
        <p className="text-sm text-muted-foreground">The system replies outbound via the configured provider (e.g., LAM) without exposing any keys.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">3) Manage your menu</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><code>GET /api/restaurants/[id]/menu</code> — list items</li>
          <li><code>POST /api/restaurants/[id]/menu</code> — create item</li>
          <li><code>PATCH /api/restaurants/[id]/menu/[itemId]</code> — update item</li>
          <li><code>DELETE /api/restaurants/[id]/menu/[itemId]</code> — delete item</li>
        </ul>
      </section>

      <p className="text-sm text-muted-foreground">That’s it. No provider-specific setup required on this page.</p>
    </main>
  )
}
