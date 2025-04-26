"use client"

import type React from "react"

import { useState } from "react"
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { useRouter } from "next/navigation"
import { Calendar, ChevronDown, Info } from "lucide-react"

import { db } from "@/lib/firebase"

// Add this after the imports, before the component definition
const selectStyles = `
  select option {
    background-color: #1a1a1a;
    color: #ffffff;
  }
`

export default function EventPlanningForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formValues, setFormValues] = useState({
    eventTitle: "",
    eventType: "",
    eventDate: "",
    eventDuration: "",
    location: "",
    numberOfGuests: "",
    budget: "",
    description: "",
    preferences: {
      theme: "",
      colors: "",
      activities: "",
      budgetPriority: "",
    },
    preferredVendor: "",
  })

  // List of event types
  const eventTypes = [
    "Wedding",
    "Birthday Party",
    "Corporate Event",
    "Conference",
    "Seminar",
    "Workshop",
    "Retreat",
    "Festival",
    "Corporate Retreat",
    "Music Festival",
    "Concert",
    "Other",
  ]

  // List of budget priorities
  const budgetPriorities = ["Venue", "Catering", "Decoration", "Entertainment", "Photography", "Transportation"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name.includes("preferences.")) {
      const preferenceName = name.split(".")[1]
      setFormValues({
        ...formValues,
        preferences: {
          ...formValues.preferences,
          [preferenceName]: value,
        },
      })
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      })
    }
  }

  // Function to generate event data using the API
  const generateEventData = async (eventId: string) => {
    try {
      setSuccess("Generating event data. This may take a few moments...")

      const response = await fetch("/api/generate/eventdata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error generating event data:", errorText)
        setError("Failed to generate event data. Please try again later.")
        return false
      }

      const data = await response.json()
      setSuccess("Event data generated successfully!")
      return data.success
    } catch (error) {
      console.error("Failed to generate event data:", error)
      setError("An unexpected error occurred. Please try again later.")
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess("Creating your event...")

    try {
      const auth = getAuth()
      const user = auth.currentUser

      if (!user) {
        throw new Error("User not authenticated")
      }

      const userId = user.uid

      // Add or update the user in the "users" collection
      await setDoc(doc(db, "users", userId), {
        userId,
        name: user.displayName || "Anonymous",
        email: user.email || "No email provided",
        logo: user.photoURL || "",
        updatedAt: serverTimestamp(),
      })

      // Prepare the event data
      const eventData = {
        userId,
        eventTitle: formValues.eventTitle,
        eventType: formValues.eventType,
        eventDate: formValues.eventDate,
        eventDuration: formValues.eventDuration,
        location: formValues.location,
        numberOfGuests: Number.parseInt(formValues.numberOfGuests) || 0,
        budget: Number.parseInt(formValues.budget) || 0,
        description: formValues.description,
        preferences: {
          theme: formValues.preferences.theme || "",
          colors: formValues.preferences.colors
            ? formValues.preferences.colors.split(",").map((item) => item.trim())
            : [],
          activities: formValues.preferences.activities
            ? formValues.preferences.activities.split(",").map((item) => item.trim())
            : [],
          budgetPriority: formValues.preferences.budgetPriority ? [formValues.preferences.budgetPriority] : [],
        },
        preferredVendor: formValues.preferredVendor || "",
        createdAt: serverTimestamp(),
      }

      // Add the event to the "events" collection
      const eventRef = await addDoc(collection(db, "events"), eventData)
      const eventId = eventRef.id

      setSuccess("Event created successfully! Generating event data...")

      // Generate event data with the API
      try {
        const generationSuccess = await generateEventData(eventId)

        if (generationSuccess) {
          console.log("Event data generated successfully!")
          setSuccess("Event data generated successfully!")
        } else {
          console.warn("Event created but data generation failed.")
          setSuccess("Event created but data generation failed. You can try again from the dashboard.")
        }

        // Navigate to the dashboard after everything is done
        router.push(`/dashboard/${eventId}`)
      } catch (genError) {
        console.error("Error generating event data:", genError)
        // Still navigate to dashboard even if generation fails
        router.push(`/dashboard/${eventId}`)
      }
    } catch (err) {
      console.error("Error saving event:", err)
      setError("Failed to create event. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <style jsx global>
        {selectStyles}
      </style>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-primary">Create Your Event</h1>
        <p className="text-gray-500">Complete the form below to start planning your perfect event</p>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
      )}

      {success && !error && (
        <div className="bg-green-900/30 border border-green-800 text-green-200 px-4 py-3 rounded mb-6" role="alert">
          <strong className="font-bold">Status: </strong>
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold mb-1">Basic Information</h2>
          <p className="text-gray-500 text-sm">Enter the core details about your event.</p>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="eventTitle" className="block mb-2 font-medium">
              Event Title
            </label>
            <input
              id="eventTitle"
              type="text"
              name="eventTitle"
              value={formValues.eventTitle}
              onChange={handleChange}
              placeholder="Summer Wedding 2024"
              className="w-full px-4 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="eventType" className="block mb-2 font-medium">
              Event Type
            </label>
            <div className="relative">
              <select
                id="eventType"
                name="eventType"
                value={formValues.eventType}
                onChange={handleChange}
                className="w-full px-4 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-background text-foreground"
                required
              >
                <option value="">Select event type</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type.toLowerCase().replace(/\s+/g, "-")}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
            </div>
          </div>

          <div>
            <label htmlFor="eventDate" className="block mb-2 font-medium">
              Event Date
            </label>
            <div className="relative">
              <input
                id="eventDate"
                type="date"
                name="eventDate"
                value={formValues.eventDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="eventDuration" className="block mb-2 font-medium">
              Duration
            </label>
            <input
              id="eventDuration"
              type="text"
              name="eventDuration"
              value={formValues.eventDuration}
              onChange={handleChange}
              placeholder="e.g. 4 hours, All day, 3 days"
              className="w-full px-4 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="block mb-2 font-medium">
              Location
            </label>
            <input
              id="location"
              type="text"
              name="location"
              value={formValues.location}
              onChange={handleChange}
              placeholder="City, State or Venue Name"
              className="w-full px-4 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="numberOfGuests" className="block mb-2 font-medium">
                Number of Guests
              </label>
              <input
                id="numberOfGuests"
                type="number"
                name="numberOfGuests"
                value={formValues.numberOfGuests}
                onChange={handleChange}
                min="1"
                placeholder="100"
                className="w-full px-4 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="budget" className="block mb-2 font-medium">
                Budget ($)
              </label>
              <input
                id="budget"
                type="number"
                name="budget"
                value={formValues.budget}
                onChange={handleChange}
                min="1"
                placeholder="5000"
                className="w-full px-4 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block mb-2 font-medium">
              Event Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formValues.description}
              onChange={handleChange}
              placeholder="Provide additional details about your event..."
              className="w-full px-4 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px]"
            />
          </div>
        </div>

        <div className="p-6 border-t">
          <h2 className="text-xl font-semibold mb-1">Preferences & Options</h2>
          <p className="text-gray-500 text-sm mb-6">
            These details help us customize your event experience (optional).
          </p>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="theme" className="block mb-2 font-medium">
                  Theme
                </label>
                <input
                  id="theme"
                  type="text"
                  name="preferences.theme"
                  value={formValues.preferences.theme}
                  onChange={handleChange}
                  placeholder="e.g. Rustic, Modern, Traditional"
                  className="w-full px-4 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="colors" className="block mb-2 font-medium">
                  Color Scheme
                </label>
                <input
                  id="colors"
                  type="text"
                  name="preferences.colors"
                  value={formValues.preferences.colors}
                  onChange={handleChange}
                  placeholder="Comma separated, e.g. Blue, Gold, White"
                  className="w-full px-4 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="activities" className="block mb-2 font-medium">
                  Planned Activities
                </label>
                <input
                  id="activities"
                  type="text"
                  name="preferences.activities"
                  value={formValues.preferences.activities}
                  onChange={handleChange}
                  placeholder="Comma separated, e.g. Dancing, Games, Speeches"
                  className="w-full px-4 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="budgetPriority" className="block mb-2 font-medium">
                  Budget Priority
                </label>
                <div className="relative">
                  <select
                    id="budgetPriority"
                    name="preferences.budgetPriority"
                    value={formValues.preferences.budgetPriority}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-background text-foreground"
                  >
                    <option value="">Select budget priority</option>
                    {budgetPriorities.map((priority) => (
                      <option key={priority} value={priority.toLowerCase()}>
                        {priority}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="preferredVendor" className="block mb-2 font-medium">
                Preferred Vendor (Optional)
              </label>
              <input
                id="preferredVendor"
                type="text"
                name="preferredVendor"
                value={formValues.preferredVendor}
                onChange={handleChange}
                placeholder="e.g. Specific caterer, venue, or service provider"
                className="w-full px-4 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex items-center justify-between">
          <div className="flex items-center text-gray-500">
            <Info className="w-4 h-4 mr-1" />
            <span className="text-sm">
              Fields marked with <span className="text-red-500">*</span> are required
            </span>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3  border text-white rounded-md hover:bg-gray-900 focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Creating Event..." : "Create & Generate Event"}
          </button>
        </div>
      </form>
    </div>
  )
}
