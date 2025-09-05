import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, Bot, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="absolute top-0 w-full border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Mafal-IA
            </span>
          </div>
          <Button asChild variant="ghost">
            <Link href="/auth/signin" className="text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors">
              Login
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Transform Your Business with AI
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            The most advanced AI platform for creating intelligent chatbots that understand your business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 px-8 py-6 text-lg">
              <Link href="/auth/signin">
                Get Started
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg border-2">
              <Link href="#features">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose Mafal-IA</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Bot className="h-10 w-10 text-indigo-600" />,
                title: "Smart AI Chatbots",
                description: "Create intelligent chatbots that understand and respond naturally to your customers."
              },
              {
                icon: <Shield className="h-10 w-10 text-indigo-600" />,
                title: "Enterprise Security",
                description: "Your data is protected with bank-level security and privacy controls."
              },
              {
                icon: <Zap className="h-10 w-10 text-indigo-600" />,
                title: "Lightning Fast",
                description: "Experience real-time responses with our high-performance AI infrastructure."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using Mafal-IA to enhance their customer experience.
          </p>
          <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-6 text-lg">
            <Link href="/auth/signin">
              Start Free Trial
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <Sparkles className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">Mafal-IA</span>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p>© {new Date().getFullYear()} Mafal-IA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
