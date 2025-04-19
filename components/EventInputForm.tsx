// app/(components)/EventInputForm.tsx
"use client";

import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase"; // Ensure this is your Firestore instance
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";

interface EventInputFormProps {
  userId: string;
}

export default function EventInputForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    eventTitle: "",
    eventType: "",
    eventDate: "",
    eventDuration: "",
    location: "",
    numberOfGuests: 0,
    preferredVendor: "",
    budgetAllocationPreference: "",
    budget: 0, // New field for budget
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User not authenticated");
      }

      const userId = user.uid;

      // Add or update the user in the "users" collection
      await setDoc(doc(db, "users", userId), {
        userId,
        name: user.displayName || "Anonymous",
        email: user.email || "No email provided",
        logo: user.photoURL || "", // Assuming the user's photo URL is available
        updatedAt: serverTimestamp(),
      });

      // Add the event to the "events" collection
      const eventRef = await addDoc(collection(db, "events"), {
        userId,
        eventTitle: formData.eventTitle,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        eventDuration: formData.eventDuration,
        location: formData.location,
        numberOfGuests: Number(formData.numberOfGuests),
        budget: Number(formData.budget), // Save the budget
        createdAt: serverTimestamp(),
      });

      // Add preferences to the "preferences" collection
      await addDoc(collection(db, "preferences"), {
        userId,
        eventId: eventRef.id,
        preferredVendor: formData.preferredVendor,
        budgetAllocationPreference: formData.budgetAllocationPreference,
        createdAt: serverTimestamp(),
      });

      router.push(`/event/${eventRef.id}`);
    } catch (err) {
      console.error("Error saving event:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6"
    >
      <h2 className="text-2xl font-bold text-center">Create New Event</h2>

      {/* Event Details Section */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Event Details</h3>
        <div className="space-y-3">
          <input
            type="text"
            name="eventTitle"
            placeholder="Event Title"
            value={formData.eventTitle}
            onChange={handleChange}
            className="w-full input input-bordered"
            required
          />
          <input
            type="text"
            name="eventType"
            placeholder="Event Type (Wedding, Party...)"
            value={formData.eventType}
            onChange={handleChange}
            className="w-full input input-bordered"
            required
          />
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            className="w-full input input-bordered"
            required
          />
          <input
            type="text"
            name="eventDuration"
            placeholder="Duration (e.g. 5 hours)"
            value={formData.eventDuration}
            onChange={handleChange}
            className="w-full input input-bordered"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location (City, State)"
            value={formData.location}
            onChange={handleChange}
            className="w-full input input-bordered"
            required
          />
          <input
            type="number"
            name="numberOfGuests"
            placeholder="Number of Guests"
            value={formData.numberOfGuests}
            onChange={handleChange}
            className="w-full input input-bordered"
            required
          />
          <input
            type="number"
            name="budget"
            placeholder="Budget (e.g. 5000)"
            value={formData.budget}
            onChange={handleChange}
            className="w-full input input-bordered"
            required
          />
        </div>
      </div>

      {/* Preferences Section */}
      <div>
        <h3 className="text-lg font-semibold mt-6 mb-2">
          Preferences (Optional)
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            name="preferredVendor"
            placeholder="Preferred Vendor (e.g. FNP)"
            value={formData.preferredVendor}
            onChange={handleChange}
            className="w-full input input-bordered"
          />
          <select
            name="budgetAllocationPreference"
            value={formData.budgetAllocationPreference}
            onChange={handleChange}
            className="w-full input input-bordered"
          >
            <option value="">Select Priority Budget Area</option>
            <option value="venue">Venue</option>
            <option value="decoration">Decoration</option>
            <option value="food">Food</option>
            <option value="entertainment">Entertainment</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button type="submit" className="btn btn-primary w-full mt-4">
          Submit Event
        </button>
      </div>
    </form>
  );
}
