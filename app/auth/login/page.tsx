"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"
import { setAuthCookie } from "@/lib/cookies"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function Login() {
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const { signInWithGoogle, currentUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect if already logged in
    if (currentUser) {
      // Set cookie when user is authenticated
      currentUser.getIdToken().then((token: string) => {
        setAuthCookie(token)
        router.push("/dashboard")
      })
    }
  }, [currentUser, router])

  async function handleGoogleSignIn() {
    try {
      setError("")
      setLoading(true)
      const user = await signInWithGoogle()
      // Set auth cookie after successful login
      const token = await user.getIdToken()
      setAuthCookie(token)
      router.push("/dashboard")
    } catch (error) {
      setError(`Failed to sign in with Google: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Back button */}
      <div className="p-6">
        <Link href="/" className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Logo placeholder */}
          <div className="mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center">
              <img src="/image 4.svg" alt="Logo" className="w-35 h-35" />
            </div>
          </div>

          {/* Login header */}
          <h1 className="text-2xl font-medium mb-2">Login to Your App</h1>
          <p className="text-gray-400 mb-8">Choose a method to login</p>

          {/* Error message */}
          {error && (
            <div className="w-full bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Google login button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-transparent border border-zinc-700 text-white py-3 px-4 rounded-lg transition-all duration-900 hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1Z"
              />
            </svg>
            <span>{loading ? "Signing in..." : "Continue with Google"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
