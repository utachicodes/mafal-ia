export default async function ChatbotPage() {

  return (
    <div className="container mx-auto p-6">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-4">AI Chatbot</h1>
        <p className="text-muted-foreground">
          Your AI chatbot interface will appear here. Start by configuring your chatbot settings.
        </p>
        
        <div className="mt-8 p-6 bg-muted/30 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Create Your First Chatbot</h2>
          <p className="text-muted-foreground mb-6">
            Configure your AI chatbot by providing some basic information about your business.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Chatbot Name</label>
              <input 
                type="text" 
                placeholder="e.g., Customer Support Bot" 
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Welcome Message</label>
              <textarea 
                placeholder="Hello! How can I help you today?" 
                rows={3}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div className="pt-2">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Create Chatbot
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
