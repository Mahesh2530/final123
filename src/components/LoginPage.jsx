"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { BookOpen, LogIn, UserPlus } from "lucide-react"
import { getUserByEmail } from "../utils/indexeddb"

export function LoginPage({ onLogin, onCreateAccount }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Please fill all fields")
      return
    }

    setLoading(true)
    try {
      const user = await getUserByEmail(email)

      if (user && user.password === password) {
        onLogin(user.role, user.name, user.email)
      } else {
        alert("Invalid email or password. Please try again or create an account.")
      }
    } catch (error) {
      console.error("[v0] Login error:", error)
      alert("Error during login. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-black to-yellow-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-4 border-yellow-300">
        <CardHeader className="space-y-2 text-center bg-gradient-to-r from-yellow-400 via-black to-yellow-500">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-300 p-3 rounded-lg shadow-lg">
              <BookOpen className="w-8 h-8 text-black" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-yellow-100">Edulibrary</CardTitle>
          <CardDescription className="text-yellow-200 font-semibold">
            Educational Resource Management System
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-8 bg-gradient-to-b from-black to-yellow-900">
          <div className="space-y-4">
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="border-2 border-yellow-400 focus:border-yellow-300 font-semibold bg-black text-yellow-100 placeholder-yellow-600"
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="border-2 border-yellow-400 focus:border-yellow-300 font-semibold bg-black text-yellow-100 placeholder-yellow-600"
            />

            <div className="bg-yellow-900 border-2 border-yellow-400 rounded-lg p-4 text-sm text-yellow-100 font-semibold shadow-md">
              <p className="font-bold mb-2 text-yellow-300">New User?</p>
              <p className="text-xs">Create an account to get started</p>
            </div>

            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-base h-12 shadow-lg transform hover:scale-105 transition disabled:opacity-50"
              size="lg"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Button
              onClick={onCreateAccount}
              disabled={loading}
              className="w-full border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-950 font-bold text-base h-12 shadow-lg transform hover:scale-105 transition flex items-center justify-center gap-2 bg-black disabled:opacity-50"
              size="lg"
            >
              <UserPlus className="w-4 h-4" />
              Create Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
