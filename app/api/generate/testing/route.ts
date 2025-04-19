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
      You're an AI event planner. Based on the following event details, generate:
1. An event schedule (with time and activity).
2. A budget breakdown (categorized with estimated amounts).
3. A checklist of key planning tasks.
4. A flow diagram in this format: 
{
  "nodes": [{ "id": "1", "type": "start", "data": { "label": "Start" }, "position": { "x": 50, "y": 100 } }],
  "edges": [{ "id": "e1-2", "source": "1", "target": "2" }]
}

Event Details:
- Title: ${event?.eventTitle ?? "N/A"}
- Type: ${event?.eventType ?? "N/A"}
- Date: ${event?.eventDate ?? "N/A"}
- Duration: ${event?.eventDuration ?? "N/A"}
- Location: ${event?.location ?? "N/A"}
- Guests: ${event?.numberOfGuests ?? "N/A"}
- Preferences: Theme - ${event?.preferences?.theme ?? "N/A"}, Colors - ${event?.preferences?.colors?.join(", ") ?? "N/A"}, Activities - ${event?.preferences?.activities?.join(", ") ?? "N/A"}

Output JSON format:
{
  "eventSchedule": [...],
  "budgetBreakdown": {...},
  "taskChecklist": [...],
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
