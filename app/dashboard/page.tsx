"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { removeAuthCookie, getAuthCookie } from "../../lib/cookies";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase"; // Ensure this is your Firestore instance

export default function Dashboard() {
  const { currentUser, logout, loading } = useAuth();
  const router = useRouter();
  const { eventId } = useParams();
  const [events, setEvents] = useState<
    {
      id: string;
      eventTitle?: string;
      eventType?: string;
      eventDate?: string;
      location?: string;
      numberOfGuests?: number;
    }[]
  >([]); // State to store user events
  const [loadingEvents, setLoadingEvents] = useState(true); // State for event loading

  useEffect(() => {
    const authCookie = getAuthCookie();

    // Redirect to login if not authenticated and not loading
    if (!loading && (!currentUser || !authCookie)) {
      router.push("/login");
    }
  }, [currentUser, loading, router]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!currentUser) return;

      try {
        const eventsQuery = query(
          collection(db, "events"),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(eventsQuery);
        const userEvents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(userEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      removeAuthCookie();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleEventClick = (eventId: string) => {
    router.push(`/dashboard/${eventId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return null; // Prevent rendering if not authenticated
  }

  return (
    <div className="container p-6 mx-auto">
      <div className="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center mb-6 space-x-4">
          {currentUser.photoURL && (
            <img
              src={currentUser.photoURL}
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
          )}
          <div>
            <p className="font-medium">
              Welcome, {currentUser.displayName || "User"}!
            </p>
            <p className="text-sm text-gray-600">{currentUser.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Your Events</h2>
        {loadingEvents ? (
          <p>Loading events...</p>
        ) : events.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {events.map((event) => (
              <li
                key={event.id}
                className="p-4 bg-gray-100 rounded-lg shadow-md cursor-pointer hover:bg-gray-200"
                onClick={() => handleEventClick(event.id)}
              >
                <h3 className="text-lg font-bold">{event.eventTitle}</h3>
                <p className="text-sm text-gray-600">
                  Type: {event.eventType || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Date: {event.eventDate || "N/A"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-600">No events found.</p>
        )}
      </div>
    </div>
  );
}
