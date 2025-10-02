export const dynamic = "force-static"

export default function DocsPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-3xl font-bold">Webhook & LAM Quick Setup</h1>
      <p className="text-sm text-muted-foreground">Follow these steps to connect your WhatsApp provider quickly.</p>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">1) Environment (.env)</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><code>DEMO_MODE=true</code></li>
          <li><code>WHATSAPP_VERIFY_TOKEN=&lt;your_token&gt;</code></li>
          <li>Optional for LAM replies:
            <ul className="list-disc pl-6">
              <li><code>LAM_API_BASE_URL=https://waba.lafricamobile.com/api</code></li>
              <li><code>LAM_API_KEY=&lt;your_bearer_token&gt;</code></li>
              <li><code>LAM_SENDER_ID=&lt;your_sender_or_number&gt;</code></li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">2) Webhook URL (provider/BSP)</h2>
        <p>Use: <code>https://YOUR_DOMAIN/webhook/whatsapp</code> (alias to the main handler).</p>
        <p>Verify Token: same as <code>WHATSAPP_VERIFY_TOKEN</code>.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">3) Verify (GET)</h2>
        <pre className="p-3 rounded bg-muted text-sm overflow-auto"><code>https://YOUR_DOMAIN/webhook/whatsapp?hub.mode=subscribe&amp;hub.verify_token=YOUR_TOKEN&amp;hub.challenge=123</code></pre>
        <p>Expect HTTP 200 with body <code>123</code>.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">4) Test</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Send a WhatsApp message to your WABA number.</li>
          <li>With <code>DEMO_MODE=true</code> you receive: <code>Echo: &lt;your text&gt;</code>.</li>
          <li>If LAM envs are set, reply is sent via LAM; otherwise via WhatsApp Graph.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">5) Go production later</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Set <code>DEMO_MODE=false</code>.</li>
          <li>Add <code>WHATSAPP_APP_SECRET</code>, <code>WHATSAPP_ACCESS_TOKEN</code> (or per-restaurant credentials) to enable signature validation and full AI/order logic.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Endpoints</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><code>GET/POST /webhook/whatsapp</code> → alias to <code>/api/whatsapp</code></li>
          <li>Templates: <code>/api/tools/whatsapp/templates</code></li>
        </ul>
      </section>

      <p className="text-sm text-muted-foreground">See README for deeper production notes.</p>
    </main>
  )
}
