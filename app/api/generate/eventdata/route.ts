import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; // For unique taskChecklist item IDs

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY });

export async function POST(req: NextRequest) {
  try {
    console.log("✅ Received request to generate content");

    const { eventId } = await req.json();
    console.log("📦 Parsed eventId:", eventId);

    // Fetch event data
    const eventDocRef = doc(db, "events", eventId);
    const eventDoc = await getDoc(eventDocRef);

    if (!eventDoc.exists()) {
      console.error(`❌ Event with ID ${eventId} not found`);
      return NextResponse.json(
        { error: `Event with ID ${eventId} not found` },
        { status: 404 }
      );
    }

    const event = eventDoc.data();
    console.log("📄 Event data:", event);

    // Construct prompt
    const prompt = `
You're an expert AI event planner. Based on the event details below, generate:

1. A detailed event schedule as an array of objects, each with time and activity.
2. A budget breakdown that distributes within a total budget of $${event?.budget ?? "N/A"}.
3. A task checklist of key planning tasks. For each task, assign a "complexity" score from 1 (very easy) to 100 (very complex).
4. A simple event flow diagram for React Flow.

Return this JSON format:
{
  "eventSchedule": [ { "time": "10:00 AM", "activity": "Guest Arrival" }, ... ],
  "budgetBreakdown": { "venue": 1000, "catering": 800, ... },
  "taskChecklist": [ { "task": "Book venue", "complexity": 7 }, ... ],
  "eventFlowDiagram": { "nodes": [...], "edges": [...] }
}

IMPORTANT: Return only valid JSON. Do not include markdown formatting or extra text.

Event Details:
- Title: ${event?.eventTitle}
- Type: ${event?.eventType}
- Date: ${event?.eventDate}
- Duration: ${event?.eventDuration}
- Location: ${event?.location}
- Guests: ${event?.numberOfGuests}
- Total Budget: $${event?.budget}
- Theme: ${event?.preferences?.theme}
- Preferred Colors: ${event?.preferences?.colors?.join(", ") ?? "N/A"}
- Preferred Activities: ${event?.preferences?.activities?.join(", ") ?? "N/A"}
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

IMPORTANT: Return only valid JSON. Do not include any additional text or explanations.
`;

    console.log("✉️ Sending prompt to Gemini...");
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const cleanedResponse = (response.text ?? "")
      .replace(/```json/g, "")
      .replace(/```/g, "");

    console.log("🧹 Cleaned AI response:", cleanedResponse);

    let output;
    try {
      output = JSON.parse(cleanedResponse || "{}");
    } catch (err) {
      console.error("❌ Failed to parse AI output:", err);
      return NextResponse.json(
        { error: "AI output is not valid JSON", rawOutput: cleanedResponse },
        { status: 500 }
      );
    }

    // 🔁 Enhance taskChecklist
    const transformedChecklist = output.taskChecklist?.map((taskObj: any) => ({
      id: uuidv4(),
      task: typeof taskObj === "string" ? taskObj : taskObj.task,
      task_done: false,
      complexity: taskObj.complexity ?? "medium",
    })) ?? [];

    // 🛠️ Fix node structure for React Flow
    const normalizedNodes = output.eventFlowDiagram?.nodes?.map((node: any) => ({
      id: node.id || node.data?.id || uuidv4(),
      type: node.type || "default",
      data: node.data,
      position: node.position,
    })) ?? [];

    const finalOutput = {
      eventSchedule: output.eventSchedule ?? [],
      budgetBreakdown: output.budgetBreakdown ?? {},
      taskChecklist: transformedChecklist,
      eventFlowDiagram: {
        nodes: normalizedNodes,
        edges: output.eventFlowDiagram?.edges ?? [],
      },
      createdAt: new Date().toISOString(),
    };

    // 🔥 Save to 'eventOutputs' collection
    const outputDocRef = doc(db, "eventOutputs", eventId);
    await setDoc(outputDocRef, finalOutput);
    console.log("✅ Output stored in Firestore under eventOutputs");

    return NextResponse.json({ success: true, output: finalOutput });
  } catch (error) {
    console.error("❌ Error generating or storing content:", error);
    return NextResponse.json(
      { error: "Failed to generate and store content" },
      { status: 500 }
    );
  }
}
