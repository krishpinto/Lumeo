"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { useRouter } from "next/navigation"
import { CalendarIcon, InfoIcon } from "lucide-react"

import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formSchema = z.object({
  eventTitle: z.string().min(2, { message: "Event title must be at least 2 characters." }),
  eventType: z.string().min(1, { message: "Please select an event type." }),
  eventDate: z.string().min(1, { message: "Please select a date." }),
  eventDuration: z.string().min(1, { message: "Please specify event duration." }),
  location: z.string().min(2, { message: "Please specify a location." }),
  numberOfGuests: z.coerce.number().min(1, { message: "Number of guests must be at least 1." }),
  budget: z.coerce.number().min(1, { message: "Budget must be at least 1." }),
  description: z.string().optional(),
  preferences: z.object({
    theme: z.string().optional(),
    colors: z.string().optional(),
    activities: z.string().optional(),
    budgetPriority: z.string().optional(),
  }),
  preferredVendor: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

// Helper function to format date in YYYY-MM-DD format in local timezone
function formatDateToLocalString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// Helper function to format date in a user-friendly way
function formatDateForDisplay(dateString: string): string {
  if (!dateString) return ""

  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  return date.toLocaleDateString(undefined, options)
}

export default function CreatePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("details")
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventTitle: "",
      eventType: "",
      eventDuration: "",
      location: "",
      numberOfGuests: 0,
      budget: 0,
      description: "",
      preferences: {
        theme: "",
        colors: "",
        activities: "",
        budgetPriority: "",
      },
      preferredVendor: "",
    },
  })

  // Function to generate event data using the API
  const generateEventData = async (eventId: string) => {
    try {
      // Show generation in progress
      setStatusMessage("Generating event data. This may take a few moments...")

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
      setStatusMessage("Event data generated successfully!")
      return data.success
    } catch (error) {
      console.error("Failed to generate event data:", error)
      setError("An unexpected error occurred. Please try again later.")
      return false
    }
  }

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    setError(null)
    setStatusMessage("Creating your event...")

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

      // Prepare the event data with enhanced preferences
      const eventData = {
        userId,
        eventTitle: data.eventTitle,
        eventType: data.eventType,
        eventDate: data.eventDate, // Now directly using the string
        eventDuration: data.eventDuration,
        location: data.location,
        numberOfGuests: data.numberOfGuests,
        budget: data.budget,
        description: data.description,
        preferences: {
          theme: data.preferences.theme || "",
          colors: data.preferences.colors ? data.preferences.colors.split(",").map((item) => item.trim()) : [],
          activities: data.preferences.activities
            ? data.preferences.activities.split(",").map((item) => item.trim())
            : [],
          budgetPriority: data.preferences.budgetPriority ? [data.preferences.budgetPriority] : [],
        },
        preferredVendor: data.preferredVendor || "",
        createdAt: serverTimestamp(),
      }

      // Add the event to the "events" collection
      const eventRef = await addDoc(collection(db, "events"), eventData)
      const eventId = eventRef.id

      setStatusMessage("Event created successfully! Generating event data...")

      // Generate event data with the API
      try {
        const generationSuccess = await generateEventData(eventId)

        if (generationSuccess) {
          console.log("Event data generated successfully!")
          setStatusMessage("Event data generated successfully!")
        } else {
          console.warn("Event created but data generation failed.")
          setStatusMessage("Event created but data generation failed. You can try again from the dashboard.")
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

  const eventTypes = [
    { value: "wedding", label: "Wedding" },
    { value: "corporate", label: "Corporate Event" },
    { value: "birthday", label: "Birthday Party" },
    { value: "conference", label: "Conference" },
    { value: "seminar", label: "Seminar" },
    { value: "workshop", label: "Workshop" },
    { value: "retreat", label: "Retreat" },
    { value: "festival", label: "Festival" },
    { value: "corporate-retreat", label: "Corporate Retreat" },
    { value: "music-festival", label: "Music Festival" },
    { value: "concert", label: "Concert" },
    { value: "other", label: "Other" },
  ]

  const budgetPriorities = [
    { value: "venue", label: "Venue" },
    { value: "catering", label: "Catering" },
    { value: "decoration", label: "Decoration" },
    { value: "entertainment", label: "Entertainment" },
    { value: "photography", label: "Photography" },
    { value: "transportation", label: "Transportation" },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
        <p className="text-muted-foreground">
          Fill in the details to create your event and generate planning materials.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {statusMessage && !error && (
        <Alert className="mb-6">
          <AlertTitle>Status</AlertTitle>
          <AlertDescription>{statusMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Event Details</TabsTrigger>
            <TabsTrigger value="preferences">Preferences & Options</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the core details about your event.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventTitle">Event Title</Label>
                    <Input id="eventTitle" placeholder="Summer Wedding 2024" {...form.register("eventTitle")} />
                    {form.formState.errors.eventTitle && (
                      <p className="text-sm text-red-500">{form.formState.errors.eventTitle.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventType">Event Type</Label>
                    <Select
                      onValueChange={(value: any) => form.setValue("eventType", value)}
                      defaultValue={form.getValues("eventType")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.eventType && (
                      <p className="text-sm text-red-500">{form.formState.errors.eventType.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Event Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !form.getValues("eventDate") && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {form.getValues("eventDate") ? (
                            formatDateForDisplay(form.getValues("eventDate"))
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={form.getValues("eventDate") ? new Date(form.getValues("eventDate")) : undefined}
                          onSelect={(date: Date | undefined) => {
                            if (date) {
                              // Store date in local timezone format
                              const dateString = formatDateToLocalString(date)
                              form.setValue("eventDate", dateString, { shouldValidate: true })
                              // Force a re-render to update the button text
                              form.trigger("eventDate")
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {form.formState.errors.eventDate && (
                      <p className="text-sm text-red-500">{form.formState.errors.eventDate.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventDuration">Duration</Label>
                    <Input
                      id="eventDuration"
                      placeholder="e.g. 4 hours, All day, 3 days"
                      {...form.register("eventDuration")}
                    />
                    {form.formState.errors.eventDuration && (
                      <p className="text-sm text-red-500">{form.formState.errors.eventDuration.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="City, State or Venue Name" {...form.register("location")} />
                    {form.formState.errors.location && (
                      <p className="text-sm text-red-500">{form.formState.errors.location.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numberOfGuests">Number of Guests</Label>
                      <Input
                        id="numberOfGuests"
                        type="number"
                        min="1"
                        placeholder="100"
                        {...form.register("numberOfGuests")}
                      />
                      {form.formState.errors.numberOfGuests && (
                        <p className="text-sm text-red-500">{form.formState.errors.numberOfGuests.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget ($)</Label>
                      <Input id="budget" type="number" min="1" placeholder="5000" {...form.register("budget")} />
                      {form.formState.errors.budget && (
                        <p className="text-sm text-red-500">{form.formState.errors.budget.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Event Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide additional details about your event..."
                      className="min-h-[100px]"
                      {...form.register("description")}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => setActiveTab("preferences")}>
                  Next: Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferences & Options</CardTitle>
                <CardDescription>Customize your event with specific preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="mb-6">
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Optional Information</AlertTitle>
                  <AlertDescription>
                    These preferences help us generate better recommendations and materials for your event.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferences.theme">Theme</Label>
                    <Input
                      id="preferences.theme"
                      placeholder="e.g. Rustic, Modern, Traditional"
                      {...form.register("preferences.theme")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferences.colors">Color Scheme</Label>
                    <Input
                      id="preferences.colors"
                      placeholder="Comma separated, e.g. Blue, Gold, White"
                      {...form.register("preferences.colors")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferences.activities">Planned Activities</Label>
                    <Input
                      id="preferences.activities"
                      placeholder="Comma separated, e.g. Dancing, Games, Speeches"
                      {...form.register("preferences.activities")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferences.budgetPriority">Budget Priority</Label>
                    <Select
                      onValueChange={(value: any) => form.setValue("preferences.budgetPriority", value)}
                      defaultValue={form.getValues("preferences.budgetPriority")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetPriorities.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredVendor">Preferred Vendor (Optional)</Label>
                    <Input
                      id="preferredVendor"
                      placeholder="e.g. Specific caterer, venue, or service provider"
                      {...form.register("preferredVendor")}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => setActiveTab("details")}>
                  Back to Details
                </Button>
                <Button type="submit" disabled={isSubmitting} className="relative">
                  {isSubmitting ? "Creating Event..." : "Create & Generate Event"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
