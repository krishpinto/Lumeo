// app/api/generate/eventdocuments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY });

export async function POST(req: NextRequest) {
  try {
    console.log("✅ Received request to generate event documents");

    const { eventId, documentType, theme } = await req.json();
    console.log("📦 Parsed data:", { eventId, documentType, theme });

    if (!eventId || !documentType || !theme) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Fetch event data and event output
    const eventDocRef = doc(db, "events", eventId);
    const eventDoc = await getDoc(eventDocRef);
    
    const outputDocRef = doc(db, "eventOutputs", eventId);
    const outputDoc = await getDoc(outputDocRef);

    if (!eventDoc.exists()) {
      console.error(`❌ Event with ID ${eventId} not found`);
      return NextResponse.json(
        { error: `Event with ID ${eventId} not found` },
        { status: 404 }
      );
    }

    if (!outputDoc.exists()) {
      console.error(`❌ Event output for ID ${eventId} not found`);
      return NextResponse.json(
        { error: `Event output for ID ${eventId} not found. Please generate event data first.` },
        { status: 404 }
      );
    }

    const event = eventDoc.data();
    const eventOutput = outputDoc.data();
    console.log("📄 Event data:", event);

    // Construct prompt based on document type
    let prompt = "";
    
    if (documentType === "invitation") {
      prompt = `
Generate a formal event invitation for the following event:

Event Details:
- Title: ${event?.eventTitle}
- Type: ${event?.eventType}
- Date: ${event?.eventDate}
- Time: ${eventOutput?.eventSchedule?.[0]?.time || "TBD"}
- Location: ${event?.location}
- Theme: ${event?.preferences?.theme || "Not specified"}
- Colors: ${event?.preferences?.colors?.join(", ") || "Not specified"}

The invitation should have the following components:
1. A formal heading
2. A warm welcome/introduction
3. Clear details about date, time, and location
4. RSVP information
5. Any special instructions or dress code

Design Theme: ${theme}

Return HTML markup that I can directly use for the invitation. Make it visually appealing with CSS styling inline. Use elegant fonts, appropriate spacing, and a color scheme that matches the event theme and preferred colors.
Use placeholders for images using this format: <img src="/api/placeholder/WIDTH/HEIGHT" alt="DESCRIPTION" />

IMPORTANT: Include all styling inline. Make it suitable for printing or sending digitally. The HTML should be complete and ready to render in a browser.
`;
    } else if (documentType === "itinerary") {
      prompt = `
Generate a formal and detailed event itinerary for the following event:

Event Details:
- Title: ${event?.eventTitle}
- Type: ${event?.eventType}
- Date: ${event?.eventDate}
- Location: ${event?.location}
- Schedule: ${JSON.stringify(eventOutput?.eventSchedule || [])}

The itinerary should include:
1. A welcome message and introduction
2. A detailed timeline of activities
3. Important notes about locations, requirements, or special needs
4. Contact information for key personnel
5. A map or directional guidance if relevant

Design Theme: ${theme}

Return HTML markup that I can directly use for the itinerary. Make it visually appealing with CSS styling inline. Use elegant fonts, appropriate spacing, and a color scheme that matches the event theme.
Use placeholders for images using this format: <img src="/api/placeholder/WIDTH/HEIGHT" alt="DESCRIPTION" />

IMPORTANT: Include all styling inline. Make it suitable for printing or sending digitally. The HTML should be complete and ready to render in a browser.
`;
    } else {
      return NextResponse.json(
        { error: "Invalid document type" },
        { status: 400 }
      );
    }

    console.log("✉️ Sending prompt to Gemini...");
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const htmlContent = response.text || "";
    console.log("📄 Generated HTML content");

    // Create the document data
    const documentData = {
      type: documentType,
      theme,
      htmlContent,
      createdAt: new Date().toISOString(),
    };

    // Update the eventOutputs document to include the new document
    // First, get the current eventDocuments if it exists
    const currentEventOutput = eventOutput || {};
    const currentEventDocuments = currentEventOutput.eventDocuments || {};
    
    // Update with the new document
    const updatedEventDocuments = {
      ...currentEventDocuments,
      [documentType]: documentData
    };

    // Update the document in Firestore
    await updateDoc(outputDocRef, {
      eventDocuments: updatedEventDocuments
    });
    
    console.log(`✅ ${documentType} document stored in eventOutputs.eventDocuments`);

    return NextResponse.json({ 
      success: true, 
      document: documentData 
    });
  } catch (error) {
    console.error("❌ Error generating document:", error);
    return NextResponse.json(
      { error: "Failed to generate document" },
      { status: 500 }
    );
  }
}