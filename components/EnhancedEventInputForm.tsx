// app/(components)/EnhancedEventInputForm.tsx
"use client";

import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";

export default function EnhancedEventInputForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    eventTitle: "",
    eventType: "",
    eventDate: "",
    eventDuration: "",
    location: "",
    numberOfGuests: 0,
    preferredVendor: "",
    budgetAllocationPreference: "",
    budget: 0,
    // Additional preferences 
    preferences: {
      theme: "",
      colors: [""],
      activities: [""],
      budgetPriority: [""],
    }
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle preferences differently
    if (name.includes("preferences.")) {
      const preferenceField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [preferenceField]: value.includes(",") ? value.split(",").map(item => item.trim()) : value,
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Function to generate event data using the API
  const generateEventData = async (eventId: string) => {
    try {
      const response = await fetch("/api/generate/eventdata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error generating event data:", errorText);
        return false;
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Failed to generate event data:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
        logo: user.photoURL || "",
        updatedAt: serverTimestamp(),
      });

      // Prepare the event data with enhanced preferences
      const eventData = {
        userId,
        eventTitle: formData.eventTitle,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        eventDuration: formData.eventDuration,
        location: formData.location,
        numberOfGuests: Number(formData.numberOfGuests),
        budget: Number(formData.budget),
        preferences: {
          theme: formData.preferences.theme,
          colors: Array.isArray(formData.preferences.colors) ? formData.preferences.colors : [formData.preferences.colors],
          activities: Array.isArray(formData.preferences.activities) ? formData.preferences.activities : [formData.preferences.activities],
          budgetPriority: formData.budgetAllocationPreference ? [formData.budgetAllocationPreference] : [],
        },
        createdAt: serverTimestamp(),
      };

      // Add the event to the "events" collection
      const eventRef = await addDoc(collection(db, "events"), eventData);
      const eventId = eventRef.id;

      // Generate event data immediately after creating the event
      const generationSuccess = await generateEventData(eventId);

      if (generationSuccess) {
        console.log("Event created and data generated successfully!");
      } else {
        console.warn("Event created but data generation failed. Continuing to dashboard.");
      }

      // Navigate to the event dashboard regardless of generation success
      router.push(`/dashboard/${eventId}`);
    } catch (err) {
      console.error("Error saving event:", err);
      setIsSubmitting(false);
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

      {/* Enhanced Preferences Section */}
      <div>
        <h3 className="text-lg font-semibold mt-6 mb-2">
          Preferences (Optional)
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            name="preferences.theme"
            placeholder="Theme (e.g. Rustic, Modern, Traditional)"
            value={formData.preferences.theme}
            onChange={handleChange}
            className="w-full input input-bordered"
          />
          <input
            type="text"
            name="preferences.colors"
            placeholder="Preferred Colors (comma separated, e.g. Blue, Gold)"
            value={Array.isArray(formData.preferences.colors) ? formData.preferences.colors.join(", ") : formData.preferences.colors}
            onChange={handleChange}
            className="w-full input input-bordered"
          />
          <input
            type="text"
            name="preferences.activities"
            placeholder="Preferred Activities (comma separated, e.g. Dancing, Games)"
            value={Array.isArray(formData.preferences.activities) ? formData.preferences.activities.join(", ") : formData.preferences.activities}
            onChange={handleChange}
            className="w-full input input-bordered"
          />
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
        <button 
          type="submit" 
          className="btn btn-primary w-full mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Event..." : "Create & Generate Event"}
        </button>
      </div>
    </form>
  );
}