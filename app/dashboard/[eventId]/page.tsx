"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { db } from "@/lib/firebase"
import EventFlowDiagram from "@/components/EventFlowDiagram"
import EventDocuments from "@/components/EventDocuments"
import DocumentViewer from "@/components/DocumentViewer"
import SocialMediaPosts from "@/components/SocialMediaPosts"

export default function EventDetailsPage() {
  const { eventId } = useParams()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")

  const [event, setEvent] = useState<any>(null)
  const [eventOutput, setEventOutput] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("details")
  const [selectedDocForViewing, setSelectedDocForViewing] = useState<string | null>(null)

  const fetchEventOutput = async () => {
    if (!eventId || typeof eventId !== "string") return

    try {
      const outputDoc = await getDoc(doc(db, "eventOutputs", eventId))
      if (outputDoc.exists()) {
        setEventOutput(outputDoc.data())
      } else {
        console.log(`No event output found for event ID ${eventId}`)
        setEventOutput(null)
      }
    } catch (error) {
      console.error("Error fetching event output:", error)
    }
  }

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        if (!eventId || typeof eventId !== "string") {
          console.error("Invalid event ID")
          return
        }

        // Fetch event details
        const eventDoc = await getDoc(doc(db, "events", eventId))
        if (eventDoc.exists()) {
          setEvent(eventDoc.data())
        } else {
          console.error(`Event with ID ${eventId} not found`)
        }

        // Fetch event output
        await fetchEventOutput()
      } catch (error) {
        console.error("Error fetching event data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEventData()
  }, [eventId])

  // Set active tab based on URL parameter
  useEffect(() => {
    if (tabParam) {
      if (tabParam === "documents") {
        setActiveTab("documents")
      } else if (tabParam === "view-documents") {
        setActiveTab("view-documents")
      } else if (tabParam === "social") {
        setActiveTab("social")
      } else if (tabParam === "flow") {
        setActiveTab("flow")
      } else if (tabParam === "schedule") {
        setActiveTab("schedule")
      } else if (tabParam === "budget") {
        setActiveTab("budget")
      } else if (tabParam === "tasks") {
        setActiveTab("tasks")
      }
    }
  }, [tabParam])

  // Reset selected doc when changing tabs
  useEffect(() => {
    if (activeTab !== "view-documents") {
      setSelectedDocForViewing(null)
    }
  }, [activeTab])

  const generateEventData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/generate/eventdata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate event data")
      }

      const data = await response.json()
      if (data.success) {
        // Refresh the output data
        await fetchEventOutput()
      }
    } catch (error) {
      console.error("Error generating event data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Function to view a specific document
  const viewDocument = (docType: string) => {
    setSelectedDocForViewing(docType)
    setActiveTab("view-documents")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-2">Loading event details...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-red-500 text-xl">Event not found.</p>
      </div>
    )
  }

  // Check if any documents exist
  const hasDocuments = eventOutput?.eventDocuments && Object.keys(eventOutput.eventDocuments).length > 0

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{event.eventTitle}</h1>

      {/* the tabs control for the events */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="details">Event Details</TabsTrigger>
          <TabsTrigger value="schedule" disabled={!eventOutput}>
            Schedule
          </TabsTrigger>
          <TabsTrigger value="budget" disabled={!eventOutput}>
            Budget
          </TabsTrigger>
          <TabsTrigger value="tasks" disabled={!eventOutput}>
            Tasks
          </TabsTrigger>
          <TabsTrigger value="flow" disabled={!eventOutput}>
            Flow Diagram
          </TabsTrigger>
          <TabsTrigger value="documents">Create Documents</TabsTrigger>
          {hasDocuments && (
            <>
              <TabsTrigger value="view-documents">View Documents</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <div className= "p-6 rounded-lg shadow-sm border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Type:</span> {event.eventType}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span> {event.eventDate}
                  </p>
                  <p>
                    <span className="font-medium">Duration:</span> {event.eventDuration}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span> {event.location}
                  </p>
                  <p>
                    <span className="font-medium">Guests:</span> {event.numberOfGuests}
                  </p>
                  <p>
                    <span className="font-medium">Budget:</span> ${event.budget}
                  </p>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Preferences</h2>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Theme:</span> {event.preferences?.theme || "Not specified"}
                  </p>
                  <p>
                    <span className="font-medium">Colors:</span>{" "}
                    {event.preferences?.colors?.join(", ") || "Not specified"}
                  </p>
                  <p>
                    <span className="font-medium">Activities:</span>{" "}
                    {event.preferences?.activities?.join(", ") || "Not specified"}
                  </p>
                  <p>
                    <span className="font-medium">Budget Priority:</span>{" "}
                    {event.preferences?.budgetPriority?.join(", ") || "Not specified"}
                  </p>
                  <p>
                    <span className="font-medium">Preferred Vendor:</span> {event.preferredVendor || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {!eventOutput && (
            <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-lg text-yellow-700 mb-4">
                No event data has been generated yet. Generate data to see the event schedule, budget, task list, and
                flow diagram.
              </p>
              <button
                onClick={generateEventData}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Event Data"}
              </button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          {eventOutput && (
            <div className=" p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Event Schedule</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="">
                    <tr>
                      <th className="py-2 px-4 border-b text-left">Time</th>
                      <th className="py-2 px-4 border-b text-left">Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventOutput.eventSchedule.map((item: any, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? "" : ""}>
                        <td className="py-2 px-4 border-b">{item.time}</td>
                        <td className="py-2 px-4 border-b">{item.activity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="budget" className="mt-6">
          {eventOutput && (
            <div className=" p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Budget Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full ">
                  <thead className="">
                    <tr>
                      <th className="py-2 px-4 border-b text-left">Category</th>
                      <th className="py-2 px-4 border-b text-left">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(eventOutput.budgetBreakdown).map(
                      ([category, amount]: [string, any], index: number) => (
                        <tr key={index} className={index % 2 === 0 ? "" : ""}>
                          <td className="py-2 px-4 border-b capitalize">{category}</td>
                          <td className="py-2 px-4 border-b">${amount}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          {eventOutput && (
            <div className=" p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Task Checklist</h2>
              <div className="space-y-2">
                {eventOutput.taskChecklist.map((task: any, index: number) => (
                  <div key={task.id || index} className="flex items-center p-2 border rounded hover:">
                    <input type="checkbox" id={`task-${index}`} className="mr-2" checked={task.task_done} readOnly />
                    <label htmlFor={`task-${index}`} className="flex-grow">
                      {task.task}
                    </label>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Complexity: {task.complexity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="flow" className="mt-6">
          {eventOutput && (
            <div className=" p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Event Flow Diagram</h2>
              <div style={{ width: "100%", height: "600px" }}>
                <EventFlowDiagram eventId={eventId as string} />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <EventDocuments eventId={eventId as string} eventOutput={eventOutput} refreshEventOutput={fetchEventOutput} />
        </TabsContent>

        <TabsContent value="view-documents" className="mt-6">
          {eventOutput?.eventDocuments && (
            <DocumentViewer
              documents={eventOutput.eventDocuments}
              selectedDocument={selectedDocForViewing}
              setSelectedDocument={setSelectedDocForViewing}
            />
          )}
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <SocialMediaPosts
            eventId={eventId as string}
            eventOutput={eventOutput}
            refreshEventOutput={fetchEventOutput}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
