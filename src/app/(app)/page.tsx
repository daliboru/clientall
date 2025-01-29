import Link from 'next/link'
import React from 'react'

const Page: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-purple-600">ClientAll</span>
        </div>
        <div className="space-x-4">
          <Link href="#" className="text-gray-700 hover:text-purple-600">
            Features
          </Link>
          <Link href="#" className="text-gray-700 hover:text-purple-600">
            Pricing
          </Link>
          <Link
            href="/login"
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Simplify Your Workflow <br /> With Our SaaS Solution
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Boost productivity, streamline processes, and drive growth with our powerful platform.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 flex items-center">
            Get Started
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-100">
            Watch Demo
          </button>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Seamless Integration',
                description: 'Connect with your existing tools effortlessly.',
              },
              {
                title: 'Real-time Analytics',
                description: 'Gain insights instantly with our comprehensive dashboards.',
              },
              {
                title: 'Scalable Infrastructure',
                description: 'Grow your business without worrying about technical limitations.',
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2025 ClientAll. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Page
