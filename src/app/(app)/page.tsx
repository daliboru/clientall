import { ArrowRight, Building2, Users2, Zap } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Page: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-purple-600">Tiny Portals</span>
        </div>
        <div className="space-x-6">
          <Link href="#features" className="text-gray-600 hover:text-purple-600">
            Features
          </Link>
          <Link href="#pricing" className="text-gray-600 hover:text-purple-600">
            Pricing
          </Link>
          <Link
            href="/login"
            className="bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 text-center leading-tight mb-6">
          Manage Your Clients <br />
          <span className="text-purple-600">With Confidence</span>
        </h1>
        <p className="text-xl text-gray-600 text-center max-w-2xl mb-12">
          The all-in-one platform for consultants to organize client information, track
          deliverables, and streamline communication.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-lg font-medium"
          >
            Get Started <ArrowRight className="h-5 w-5" />
          </Link>
          <button className="border border-purple-200 bg-white text-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition-colors text-lg font-medium">
            Book a Demo
          </button>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Everything You Need</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Users2 className="h-8 w-8 text-purple-600" />,
                title: 'Client Management',
                description:
                  'Organize client information, documents, and communication history in one place.',
              },
              {
                icon: <Building2 className="h-8 w-8 text-purple-600" />,
                title: 'Workspace Organization',
                description:
                  'Create dedicated spaces for each client with customizable access and permissions.',
              },
              {
                icon: <Zap className="h-8 w-8 text-purple-600" />,
                title: 'Efficient Workflows',
                description:
                  'Streamline your processes with automated tasks and deliverable tracking.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-purple-100 hover:border-purple-200 transition-colors"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-purple-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} ClientAll. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Page
