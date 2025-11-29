"use client"

import { Button } from "./ui/button"
import { BookOpen, Users, Upload, Search } from "lucide-react"

export function HomePage({ userName, onLogout, onEnterLibrary }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-red-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 shadow-2xl border-b-4 border-red-500 animate-slide-down">
        <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-red-600 p-3 rounded-lg shadow-lg transform hover:scale-110 transition animate-pulse-gentle">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edulibrary</h1>
              <p className="text-gray-800 font-semibold">Educational Resource Management System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-yellow-600 via-green-600 to-red-600 bg-clip-text text-transparent mb-4 animate-fade-scale">
            Welcome to Edulibrary
          </h2>
          <p className="text-xl text-gray-700 font-semibold mb-8">
            Access thousands of educational resources organized and managed for your learning journey
          </p>
          {userName ? (
            <div className="space-y-4 animate-fade-scale">
              <p className="text-2xl font-bold text-green-600">Welcome back, {userName}!</p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={onEnterLibrary}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-10 py-4 text-lg shadow-lg transform hover:scale-110 transition-all duration-300 hover-shadow animate-bounce-in"
                >
                  Enter Library
                </Button>
                <Button
                  onClick={onLogout}
                  variant="outline"
                  className="bg-white text-red-600 border-2 border-red-600 hover:bg-red-50 font-bold px-10 py-4 text-lg shadow-lg hover-scale hover-shadow"
                >
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold px-10 py-4 text-lg shadow-lg transform hover:scale-105 transition"
            >
              Get Started
            </Button>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* For Admins */}
          <div className="bg-white rounded-xl shadow-xl p-8 border-4 border-red-500 hover-lift animate-slide-up stagger-1">
            <div className="bg-red-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4 shadow-lg hover-rotate">
              <Upload className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-red-600">For Administrators</h3>
            <p className="text-gray-700 font-semibold mb-4">
              Upload and organize educational resources. Manage user access and maintain the library.
            </p>
            <ul className="text-sm text-gray-700 space-y-2 font-semibold">
              <li className="flex items-center gap-2">
                ✓ <span className="text-red-600">Upload resources</span>
              </li>
              <li className="flex items-center gap-2">
                ✓ <span className="text-red-600">Organize materials</span>
              </li>
              <li className="flex items-center gap-2">
                ✓ <span className="text-red-600">Manage categories</span>
              </li>
              <li className="flex items-center gap-2">
                ✓ <span className="text-red-600">Track usage</span>
              </li>
            </ul>
          </div>

          {/* For Students */}
          <div className="bg-white rounded-xl shadow-xl p-8 border-4 border-green-500 hover-lift animate-slide-up stagger-2">
            <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4 shadow-lg hover-rotate">
              <Search className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-green-600">For Students</h3>
            <p className="text-gray-700 font-semibold mb-4">
              Search and access educational materials. Download resources and share feedback.
            </p>
            <ul className="text-sm text-gray-700 space-y-2 font-semibold">
              <li className="flex items-center gap-2">
                ✓ <span className="text-green-600">Search resources</span>
              </li>
              <li className="flex items-center gap-2">
                ✓ <span className="text-green-600">Download files</span>
              </li>
              <li className="flex items-center gap-2">
                ✓ <span className="text-green-600">Write reviews</span>
              </li>
              <li className="flex items-center gap-2">
                ✓ <span className="text-green-600">Access anytime</span>
              </li>
            </ul>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-xl shadow-xl p-8 border-4 border-yellow-500 hover-lift animate-slide-up stagger-3">
            <div className="bg-yellow-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4 shadow-lg hover-rotate">
              <Users className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-yellow-600">Growing Community</h3>
            <p className="text-gray-700 font-semibold mb-4">
              Join thousands of students and educators using our platform.
            </p>
            <ul className="text-sm text-gray-700 space-y-2 font-semibold">
              <li className="flex items-center gap-2">
                ✓ <span className="text-yellow-600">10,000+ Resources</span>
              </li>
              <li className="flex items-center gap-2">
                ✓ <span className="text-yellow-600">5,000+ Active Users</span>
              </li>
              <li className="flex items-center gap-2">
                ✓ <span className="text-yellow-600">50+ Subjects</span>
              </li>
              <li className="flex items-center gap-2">
                ✓ <span className="text-yellow-600">24/7 Access</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 text-white py-16 mt-16 shadow-xl">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Ready to enhance your learning?</h2>
          <p className="text-lg mb-8 text-gray-800 font-semibold">
            Login to access the full library and make the most of our resources.
          </p>
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-gray-900 text-yellow-400 hover:bg-gray-800 px-10 py-4 text-lg font-bold shadow-lg hover-scale hover-shadow animate-bounce-in"
          >
            Login Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12 border-t-4 border-yellow-400">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="font-semibold">© 2025 Edulibrary. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
