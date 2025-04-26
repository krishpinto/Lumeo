"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"

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
  const [updatingTask, setUpdatingTask] = useState<string | null>(null)

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
      } else if (tabParam === "details" || !tabParam) {
        setActiveTab("details") 
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

  // New function to update task status
  const toggleTaskStatus = async (taskIndex: number, isDone: boolean) => {
    if (!eventId || typeof eventId !== "string" || !eventOutput) return
    
    try {
      setUpdatingTask(taskIndex.toString())
      
      // Get the current task
      const task = eventOutput.taskChecklist[taskIndex]
      
      // Create updated task with new done status
      const updatedTask = { ...task, task_done: isDone }
      
      // Create a copy of the current checklist
      const updatedChecklist = [...eventOutput.taskChecklist]
      updatedChecklist[taskIndex] = updatedTask
      
      // Update the local state first for immediate UI feedback
      const updatedEventOutput = { 
        ...eventOutput, 
        taskChecklist: updatedChecklist 
      }
      setEventOutput(updatedEventOutput)
      
      // Update in Firestore
      const outputRef = doc(db, "eventOutputs", eventId)
      await updateDoc(outputRef, {
        taskChecklist: updatedChecklist
      })
      
    } catch (error) {
      console.error("Error updating task status:", error)
      // Revert the local state if there was an error
      await fetchEventOutput()
    } finally {
      setUpdatingTask(null)
    }
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

  // Render the appropriate content based on the active tab
  const renderContent = () => {
    switch(activeTab) {
      case "details":
        return (
          <div className="p-6 rounded-lg shadow-sm border">
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
        );
      case "schedule":
        return eventOutput ? (
          <div className="p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Event Schedule</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
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
        ) : (
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-lg text-yellow-700 mb-4">
              No schedule data has been generated yet.
            </p>
            <button
              onClick={generateEventData}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Event Data"}
            </button>
          </div>
        );
      case "budget":
        return eventOutput ? (
          <div className="p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Budget Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
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
        ) : (
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-lg text-yellow-700 mb-4">
              No budget data has been generated yet.
            </p>
            <button
              onClick={generateEventData}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Event Data"}
            </button>
          </div>
        );
      case "tasks":
        return eventOutput ? (
          <div className="p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Task Checklist</h2>
            <div className="space-y-2">
              {eventOutput.taskChecklist.map((task: any, index: number) => (
                <div key={task.id || index} className="flex items-center p-2 border rounded">
                  <input 
                    type="checkbox" 
                    id={`task-${index}`} 
                    className="mr-2" 
                    checked={task.task_done} 
                    onChange={(e) => toggleTaskStatus(index, e.target.checked)}
                    disabled={updatingTask === index.toString()}
                  />
                  <label 
                    htmlFor={`task-${index}`} 
                    className={`flex-grow ${task.task_done ? 'line-through text-gray-500' : ''}`}
                  >
                    {task.task}
                  </label>
                  <span className=" text-purple-800 text-xs px-2 py-1 rounded ml-2">
                    Complexity: {task.complexity}
                  </span>
                  
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-lg text-yellow-700 mb-4">
              No tasks have been generated yet.
            </p>
            <button
              onClick={generateEventData}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Event Data"}
            </button>
          </div>
        );
      case "flow":
        return eventOutput ? (
          <div className="p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Event Flow Diagram</h2>
            <div style={{ width: "100%", height: "600px" }}>
              <EventFlowDiagram eventId={eventId as string} />
            </div>
          </div>
        ) : (
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-lg text-yellow-700 mb-4">
              No flow diagram data has been generated yet.
            </p>
            <button
              onClick={generateEventData}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Event Data"}
            </button>
          </div>
        );
      case "documents":
        return (
          <EventDocuments eventId={eventId as string} eventOutput={eventOutput} refreshEventOutput={fetchEventOutput} />
        );
      case "view-documents":
        return eventOutput?.eventDocuments ? (
          <DocumentViewer
            documents={eventOutput.eventDocuments}
            selectedDocument={selectedDocForViewing}
            setSelectedDocument={setSelectedDocForViewing}
          />
        ) : (
          <div className="mt-8 p-6 bg-black-900 border border-purple-900 rounded-lg">
            <p className="text-lg mb-4">
              No documents have been generated yet.
            </p>
            <button
              onClick={() => setActiveTab("documents")}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Create Documents
            </button>
          </div>
        );
      case "social":
        return (
          <SocialMediaPosts
            eventId={eventId as string}
            eventOutput={eventOutput}
            refreshEventOutput={fetchEventOutput}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Title section with more prominence */}
      <div className="mb-8 pb-4 border-b">
        <h1 className="text-4xl font-bold text-primary">{event.eventTitle}</h1>
        <p className="text-gray-500 mt-2">{event.eventType} · {event.eventDate}</p>
      </div>
      
      {!eventOutput && activeTab === "details" && (
        <div className="mt-8 p-6 bg-black-900 border border-purple-900 rounded-lg">
            <p className="text-lg mb-4">
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

      {/* Render the active tab content */}
      {renderContent()}
    </div>
  )
}