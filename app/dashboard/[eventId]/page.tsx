"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import EventFlowDiagram from "@/components/EventFlowDiagram";
import EventDocuments from "@/components/EventDocuments";
import DocumentViewer from "@/components/DocumentViewer"; // New component we'll create
import SocialMediaPosts from "@/components/SocialMediaPosts";

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [eventOutput, setEventOutput] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [selectedDocForViewing, setSelectedDocForViewing] = useState<
    string | null
  >(null);

  const fetchEventOutput = async () => {
    if (!eventId || typeof eventId !== "string") return;

    try {
      const outputDoc = await getDoc(doc(db, "eventOutputs", eventId));
      if (outputDoc.exists()) {
        setEventOutput(outputDoc.data());
      } else {
        console.log(`No event output found for event ID ${eventId}`);
        setEventOutput(null);
      }
    } catch (error) {
      console.error("Error fetching event output:", error);
    }
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        if (!eventId || typeof eventId !== "string") {
          console.error("Invalid event ID");
          return;
        }

        // Fetch event details
        const eventDoc = await getDoc(doc(db, "events", eventId));
        if (eventDoc.exists()) {
          setEvent(eventDoc.data());
        } else {
          console.error(`Event with ID ${eventId} not found`);
        }

        // Fetch event output
        await fetchEventOutput();
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  // Reset selected doc when changing tabs
  useEffect(() => {
    if (activeTab !== "view-documents") {
      setSelectedDocForViewing(null);
    }
  }, [activeTab]);

  const generateEventData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate/eventdata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate event data");
      }

      const data = await response.json();
      if (data.success) {
        // Refresh the output data
        await fetchEventOutput();
      }
    } catch (error) {
      console.error("Error generating event data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to view a specific document
  const viewDocument = (docType: string) => {
    setSelectedDocForViewing(docType);
    setActiveTab("view-documents");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-2">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-xl">Event not found.</p>
      </div>
    );
  }

  // Check if any documents exist
  const hasDocuments =
    eventOutput?.eventDocuments &&
    Object.keys(eventOutput.eventDocuments).length > 0;

  return (
    <div className="container mx-auto pt-20 p-6">
      <h1 className="text-3xl font-bold mb-6">{event.eventTitle}</h1>

      {/* Navigation Tabs */}
      <div className="flex border-b mb-6 overflow-x-auto">
        <button
          className={`py-2 px-4 mr-2 ${
            activeTab === "details"
              ? "bg-blue-500 text-white rounded-t"
              : "text-blue-500"
          }`}
          onClick={() => setActiveTab("details")}
        >
          Event Details
        </button>
        <button
          className={`py-2 px-4 mr-2 ${
            activeTab === "schedule"
              ? "bg-blue-500 text-white rounded-t"
              : "text-blue-500"
          }`}
          onClick={() => setActiveTab("schedule")}
          disabled={!eventOutput}
        >
          Schedule
        </button>
        <button
          className={`py-2 px-4 mr-2 ${
            activeTab === "budget"
              ? "bg-blue-500 text-white rounded-t"
              : "text-blue-500"
          }`}
          onClick={() => setActiveTab("budget")}
          disabled={!eventOutput}
        >
          Budget
        </button>
        <button
          className={`py-2 px-4 mr-2 ${
            activeTab === "tasks"
              ? "bg-blue-500 text-white rounded-t"
              : "text-blue-500"
          }`}
          onClick={() => setActiveTab("tasks")}
          disabled={!eventOutput}
        >
          Tasks
        </button>
        <button
          className={`py-2 px-4 mr-2 ${
            activeTab === "flow"
              ? "bg-blue-500 text-white rounded-t"
              : "text-blue-500"
          }`}
          onClick={() => setActiveTab("flow")}
          disabled={!eventOutput}
        >
          Flow Diagram
        </button>
        <button
          className={`py-2 px-4 mr-2 ${
            activeTab === "documents"
              ? "bg-blue-500 text-white rounded-t"
              : "text-blue-500"
          }`}
          onClick={() => setActiveTab("documents")}
        >
          Create Documents
        </button>
        {hasDocuments && (
          <>
            <button
              className={`py-2 px-4 ${
                activeTab === "view-documents"
                  ? "bg-blue-500 text-white rounded-t"
                  : "text-blue-500"
              }`}
              onClick={() => setActiveTab("view-documents")}
            >
              View Documents
            </button>
            <button
              className={`py-2 px-4 mr-2 ${
                activeTab === "social"
                  ? "bg-blue-500 text-white rounded-t"
                  : "text-blue-500"
              }`}
              onClick={() => setActiveTab("social")}
            >
              Social Media
            </button>
          </>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === "details" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
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
                  <span className="font-medium">Duration:</span>{" "}
                  {event.eventDuration}
                </p>
                <p>
                  <span className="font-medium">Location:</span>{" "}
                  {event.location}
                </p>
                <p>
                  <span className="font-medium">Guests:</span>{" "}
                  {event.numberOfGuests}
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
                  <span className="font-medium">Theme:</span>{" "}
                  {event.preferences?.theme || "Not specified"}
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
                  {event.preferences?.budgetPriority?.join(", ") ||
                    "Not specified"}
                </p>
                <p>
                  <span className="font-medium">Preferred Vendor:</span>{" "}
                  {event.preferredVendor || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "schedule" && eventOutput && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Event Schedule</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Time</th>
                  <th className="py-2 px-4 border-b text-left">Activity</th>
                </tr>
              </thead>
              <tbody>
                {eventOutput.eventSchedule.map((item: any, index: number) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="py-2 px-4 border-b">{item.time}</td>
                    <td className="py-2 px-4 border-b">{item.activity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "budget" && eventOutput && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Budget Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Category</th>
                  <th className="py-2 px-4 border-b text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(eventOutput.budgetBreakdown).map(
                  ([category, amount]: [string, any], index: number) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : ""}
                    >
                      <td className="py-2 px-4 border-b capitalize">
                        {category}
                      </td>
                      <td className="py-2 px-4 border-b">${amount}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "tasks" && eventOutput && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Task Checklist</h2>
          <div className="space-y-2">
            {eventOutput.taskChecklist.map((task: any, index: number) => (
              <div
                key={task.id || index}
                className="flex items-center p-2 border rounded hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  id={`task-${index}`}
                  className="mr-2"
                  checked={task.task_done}
                  readOnly
                />
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

      {activeTab === "flow" && eventOutput && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Event Flow Diagram</h2>
          <div style={{ width: "100%", height: "500px" }}>
            <EventFlowDiagram eventId={eventId as string} />
          </div>
        </div>
      )}

      {activeTab === "documents" && (
        <EventDocuments
          eventId={eventId as string}
          eventOutput={eventOutput}
          refreshEventOutput={fetchEventOutput}
        />
      )}

      {activeTab === "view-documents" && eventOutput?.eventDocuments && (
        <DocumentViewer
          documents={eventOutput.eventDocuments}
          selectedDocument={selectedDocForViewing}
          setSelectedDocument={setSelectedDocForViewing}
        />
      )}

      {activeTab === "social" && (
        <SocialMediaPosts
          eventId={eventId as string}
          eventOutput={eventOutput}
          refreshEventOutput={fetchEventOutput}
        />
      )}

      {!eventOutput &&
        activeTab !== "documents" &&
        activeTab !== "view-documents" && (
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-lg text-yellow-700 mb-4">
              No event data has been generated yet. Generate data to see the
              event schedule, budget, task list, and flow diagram.
            </p>
            <button
              onClick={generateEventData}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Event Data"}
            </button>
          </div>
        )}

      {/* Quick document access panel - visible on all tabs except documents and view-documents */}
      {eventOutput?.eventDocuments &&
        Object.keys(eventOutput.eventDocuments).length > 0 &&
        activeTab !== "documents" &&
        activeTab !== "view-documents" && (
          <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-3">Quick Document Access</h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(eventOutput.eventDocuments).map(
                ([docType, docData]: [string, any]) => (
                  <button
                    key={docType}
                    onClick={() => viewDocument(docType)}
                    className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 flex items-center"
                  >
                    <span className="mr-2">
                      {docType === "invitation" ? "✉️" : "📋"}
                    </span>
                    {docType.charAt(0).toUpperCase() + docType.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>
        )}
    </div>
  );
}
