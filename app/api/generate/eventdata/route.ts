import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { db } from "@/lib/firebase"; // Ensure this points to your Firestore instance
import { doc, getDoc } from "firebase/firestore";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY });

export async function POST(req: NextRequest) {
  try {
    console.log("Received request to generate content");

    // Parse the request body
    const { eventId } = await req.json();
    console.log("Parsed eventId:", eventId);

    // Fetch event details from Firestore
    const eventDoc = await getDoc(doc(db, "events", eventId));
    console.log(
      "Fetched event document:",
      eventDoc.exists() ? "Exists" : "Does not exist"
    );

    if (!eventDoc.exists()) {
      console.error(`Event with ID ${eventId} not found`);
      return NextResponse.json(
        { error: `Event with ID ${eventId} not found` },
        { status: 404 }
      );
    }

    const event = eventDoc.data();
    console.log("Event data fetched from Firestore:", event);

    // Construct the prompt with event details
    const prompt = `
You're an expert AI event planner. Based on the event details below, generate:

1. A detailed event schedule as an array of objects, each with time and activity.
2. A **budget breakdown** that distributes **within a total budget of $${event?.budget ?? "N/A"}**. Ensure:
   - Total adds up to the exact budget.
   - More budget goes to user's **priority preferences**.
3. A task checklist of key planning tasks.
4. A simple **event flow diagram** for React Flow in this format:
{
  "nodes": [{ "id": "1", "type": "start", "data": { "label": "Start" }, "position": { "x": 50, "y": 100 } }],
  "edges": [{ "id": "e1-2", "source": "1", "target": "2" }]
}

Event Details:
- Title: ${event?.eventTitle}
- Type: ${event?.eventType}
- Date: ${event?.eventDate}
- Duration: ${event?.eventDuration}
- Location: ${event?.location}
- Guests: ${event?.numberOfGuests}
- Total Budget: $${event?.budget}
- Theme: ${event?.preferences?.theme}
- Preferred Colors: ${event?.preferences?.colors?.join(", ")}
- Preferred Activities: ${event?.preferences?.activities?.join(", ")}
- Budget Priorities: ${event?.preferences?.budgetPriority?.join(", ") ?? "None"}

Output JSON format (strictly match this):
{
  "eventSchedule": [ { "time": "10:00 AM", "activity": "Guest Arrival" }, ... ],
  "budgetBreakdown": {
    "venue": 1000,
    "catering": 800,
    "decorations": 400,
    ...
  },
  "taskChecklist": [ "Book venue", "Confirm vendors", ... ],
  "eventFlowDiagram": {
    "nodes": [...],
    "edges": [...]
  }
}
`;

    console.log("Constructed prompt:", prompt);

    // Generate content using Google GenAI
    console.log("Sending prompt to Google GenAI...");
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    console.log("AI response received:", response);

    // Return the generated content
    return NextResponse.json({ output: response.text });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
