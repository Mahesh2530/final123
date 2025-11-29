"use client"

import { useState } from "react"
import { ThemeProvider } from "./components/theme-provider"
import { LoginPage } from "./components/LoginPage"
import { CreateAccountPage } from "./components/CreateAccountPage"
import { HomePage } from "./components/HomePage"
import { AdminDashboard } from "./components/AdminDashboard"
import { StudentDashboard } from "./components/StudentDashboard"

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [showCreateAccount, setShowCreateAccount] = useState(false)
  const [showStudentHome, setShowStudentHome] = useState(false)
  const [showWelcomePage, setShowWelcomePage] = useState(true)

  const handleLogin = (role, name, email) => {
    setUserRole(role)
    setUserName(name)
    setUserEmail(email)
    setIsLoggedIn(true)
    if (role === "student") {
      setShowStudentHome(true)
    }
  }

  const handleSignUp = (role, name, email) => {
    console.log("[v0] New account created:", { role, name, email })
    handleLogin(role, name, email)
    setShowCreateAccount(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserRole(null)
    setUserName("")
    setUserEmail("")
    setShowCreateAccount(false)
    setShowStudentHome(false)
    setShowWelcomePage(true)
  }

  const handleBackToStudentHome = () => {
    setShowStudentHome(true)
  }

  const handleEnterLibrary = () => {
    setShowStudentHome(false)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div>
        {showWelcomePage && !isLoggedIn ? (
          <HomePage 
            onLogin={() => {
              setShowWelcomePage(false)
            }} 
            onCreateAccount={() => {
              setShowWelcomePage(false)
              setShowCreateAccount(true)
            }}
          />
        ) : !isLoggedIn ? (
          showCreateAccount ? (
            <CreateAccountPage 
              onSignUp={handleSignUp} 
              onBackToLogin={() => setShowCreateAccount(false)} 
            />
          ) : (
            <LoginPage 
              onLogin={handleLogin} 
              onCreateAccount={() => setShowCreateAccount(true)} 
            />
          )
        ) : userRole === "admin" ? (
          <AdminDashboard userName={userName} userEmail={userEmail} onLogout={handleLogout} />
        ) : userRole === "student" ? (
          showStudentHome ? (
            <HomePage userName={userName} onLogout={handleLogout} onEnterLibrary={handleEnterLibrary} />
          ) : (
            <StudentDashboard userName={userName} onLogout={handleLogout} onBack={handleBackToStudentHome} />
          )
        ) : (
          <HomePage />
        )}
      </div>
    </ThemeProvider>
  )
}
