"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import GenerateCookieRecipes from "@/components/testbutton"; // Adjust the import path as necessary

export default function EventDetailsPage() {
  const { eventId } = useParams(); // Get the eventId from the URL
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!eventId) {
          console.error("Invalid event ID");
          return;
        }

        // Fetch event details from Firestore
        if (typeof eventId === "string") {
          const eventDoc = await getDoc(doc(db, "events", eventId));
          if (eventDoc.exists()) {
            setEvent(eventDoc.data());
          } else {
            console.error(`Event with ID ${eventId} not found`);
          }
        } else {
          console.error("Invalid event ID format");
        }
        // This block is redundant and has been removed as eventId is a string
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
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
      <GenerateCookieRecipes />
    </div>
    
  );
}