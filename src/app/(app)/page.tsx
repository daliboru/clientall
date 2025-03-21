import { ArrowRight, Building2, Users2, Zap } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Tiny Portals',
}

export default async function LandingPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
        {/* Navigation */}
        <nav className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 max-w-7xl mx-auto">
          <div className="flex items-center justify-center sm:justify-start">
            <span className="text-2xl font-bold text-primary">Tiny Portals</span>
          </div>
          <div className="flex justify-center items-center sm:justify-end space-x-4 sm:space-x-6">
            <Link href="#features" className="text-foreground hover:text-primary">
              Features
            </Link>
            <Link href="#pricing" className="text-foreground hover:text-primary">
              Pricing
            </Link>
            <Link
              href="/login"
              className="bg-primary text-primary-foreground px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-24 flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 text-center leading-tight mb-6">
            Manage Your Clients <br className="hidden sm:block" />
            <span className="text-primary">With Confidence</span>
          </h1>
          <p className="text-lg sm:text-xl text-foreground text-center max-w-2xl mb-8 sm:mb-12 px-4">
            The all-in-one platform for consultants to organize client information, track
            deliverables, and streamline communication.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto px-4">
            <Link
              href="/signup"
              className="bg-primary text-primary-foreground px-6 sm:px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-base sm:text-lg font-medium"
            >
              Get Started <ArrowRight className="h-5 w-5" />
            </Link>
            <button className="border border-purple-200 bg-background text-primary px-6 sm:px-8 py-3 rounded-lg hover:bg-purple-50 transition-colors text-base sm:text-lg font-medium w-full sm:w-auto">
              Book a Demo
            </button>
          </div>
        </main>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 sm:mb-16">
              Everything You Need
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
              {[
                {
                  icon: <Users2 className="h-8 w-8 text-primary" />,
                  title: 'Client Management',
                  description:
                    'Organize client information, documents, and communication history in one place.',
                },
                {
                  icon: <Building2 className="h-8 w-8 text-primary" />,
                  title: 'Workspace Organization',
                  description:
                    'Create dedicated spaces for each client with customizable access and permissions.',
                },
                {
                  icon: <Zap className="h-8 w-8 text-primary" />,
                  title: 'Efficient Workflows',
                  description:
                    'Streamline your processes with automated tasks and deliverable tracking.',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-background p-6 sm:p-8 rounded-2xl border border-border hover:border-purple-200 transition-colors"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-foreground leading-relaxed text-sm sm:text-base">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-muted py-8 sm:py-12 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-foreground text-sm sm:text-base">
              &copy; 2025 Tiny Portals. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
