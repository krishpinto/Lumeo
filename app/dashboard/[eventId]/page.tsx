"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import GenerateEventSummary from "@/components/GenerateEventSummary"; // Adjust the import path as necessary
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import EventFlowDiagram from "@/components/EventFlowDiagram";

export default function EventDetailsPage() {
  const { eventId } = useParams(); // Get the eventId from the URL
  const [event, setEvent] = useState<any>(null);
  const [eventOutput, setEventOutput] = useState<any>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [loadingOutput, setLoadingOutput] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!eventId || typeof eventId !== "string") {
          console.error("Invalid event ID");
          return;
        }

        // Fetch event details from Firestore
        const eventDoc = await getDoc(doc(db, "events", eventId));
        if (eventDoc.exists()) {
          setEvent(eventDoc.data());
        } else {
          console.error(`Event with ID ${eventId} not found`);
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoadingEvent(false);
      }
    };

    const fetchEventOutput = async () => {
      try {
        if (!eventId || typeof eventId !== "string") {
          console.error("Invalid event ID");
          return;
        }

        // Fetch event output from Firestore
        const outputDoc = await getDoc(doc(db, "eventOutputs", eventId));
        if (outputDoc.exists()) {
          setEventOutput(outputDoc.data());
        } else {
          console.log(`No event output found for event ID ${eventId}`);
        }
      } catch (error) {
        console.error("Error fetching event output:", error);
      } finally {
        setLoadingOutput(false);
      }
    };

    fetchEvent();
    fetchEventOutput();
  }, [eventId]);

  if (loadingEvent || loadingOutput) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Event not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{event.eventTitle}</h1>
      <p className="text-lg mb-2">Type: {event.eventType}</p>
      <p className="text-lg mb-2">Date: {event.eventDate}</p>
      <p className="text-lg mb-2">Duration: {event.eventDuration}</p>
      <p className="text-lg mb-2">Location: {event.location}</p>
      <p className="text-lg mb-2">Guests: {event.numberOfGuests}</p>
      <p className="text-lg mb-2">Budget: ${event.budget}</p>
      <GenerateEventSummary eventId={eventId as string} />

      {eventOutput ? (
        <>
          <h2 className="text-xl font-bold mt-6 mb-4">Event Flow Diagram</h2>
          <div style={{ width: "100%", height: "500px" }}>
            {/* Pass the eventId dynamically */}
            <EventFlowDiagram eventId={eventId as string} />
          </div>
        </>
      ) : (
        <>
          <p className="text-lg text-red-500 mt-6">
            No event output found. Please generate event data.
          </p>
        </>
      )}
    </div>
  );
}
