"use client"

import React, { useState } from "react"
import { X } from "lucide-react"
import { Button } from "../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { db } from "../firebase"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"

interface WaitlistModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")

    const handleJoinWaitlist = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccessMessage("")

        if (!email) {
            setError("Please enter a valid email address.")
            setIsLoading(false)
            return
        }

        try {
            const waitlistRef = collection(db, "waitlist")
            const q = query(waitlistRef, where("email", "==", email))
            const querySnapshot = await getDocs(q)

            if (!querySnapshot.empty) {

                setError("You're already in!")
                setTimeout(() => {
                    setSuccessMessage("")
                    onClose()
                }, 1000)
            } else {
                await addDoc(waitlistRef, { email, timestamp: new Date() })
                setSuccessMessage("Successfully entered 🚀!")
                setEmail("")

                setTimeout(() => {
                    setSuccessMessage("")
                    onClose()
                }, 1000)
            }
        } catch (err) {
            setError("Failed to join the waitlist. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>


            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="sm:max-w-md bg-white rounded-lg overflow-hidden">
                    <DialogHeader>
                        <DialogTitle>Join Launchpad (launching soon) 🚀</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleJoinWaitlist} className="space-y-4">
                        {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
                        {successMessage && (
                            <div className="p-3 bg-red-100 text-green-700 rounded-lg">
                                {successMessage}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 rounded-[5px] border border-gray-300 focus:outline-none focus:ring-2"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <Button type="submit" className="w-full bg-black text-white rounded-[5px] hover:bg-gray-800" disabled={isLoading}>
                            {isLoading ? "Joining..." : "Join Launchpad"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
