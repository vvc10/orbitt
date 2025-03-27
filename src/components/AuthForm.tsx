"use client"

import React, { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { auth, googleProvider } from "../firebase"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  isSignUp: boolean
  setIsSignUp: (isSignUp: boolean) => void
  setLoginState: (state: boolean) => void
  setOnboardingComplete: (complete: boolean) => void
}

export default function AuthModal({
  isOpen,
  onClose,
  isSignUp,
  setIsSignUp,
  setLoginState,
  setOnboardingComplete,
}: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoginState(true)
        setOnboardingComplete(!user.displayName)
        onClose()
      }
    })
    return () => unsubscribe()
  }, [setLoginState, setOnboardingComplete, onClose])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
        setOnboardingComplete(false)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
        setOnboardingComplete(true)
      }
      setLoginState(true)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError("")
    try {
      await signInWithPopup(auth, googleProvider)
      setLoginState(true)
      setOnboardingComplete(false)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isSignUp ? "Create your account" : "Welcome back"}</DialogTitle>
          <button onClick={onClose} className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <form onSubmit={handleAuth} className="space-y-4">
          {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button type="button" variant="outline" onClick={handleGoogleSignIn} className="w-full" disabled={isLoading}>
            Continue with Google
          </Button>

          <div className="text-center text-sm">
            {isSignUp ? "Already have an account? " : "Need an account? "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline"
              disabled={isLoading}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
