import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "");

// Platform character limits and content guidelines
const PLATFORM_CONSTRAINTS = {
  twitter: {
    charLimit: 280,
    description: "Short, concise with hashtags. Can include links.",
    tone: "Conversational, direct"
  },
  instagram: {
    charLimit: 2200,
    description: "Visual-focused with hashtags (up to 30). Can be longer than Twitter.",
    tone: "Inspirational, descriptive"
  },
  facebook: {
    charLimit: 63206,
    description: "Medium-length with optional hashtags. Can include links.",
    tone: "Engaging, informational"
  },
  linkedin: {
    charLimit: 3000, 
    description: "Professional tone, industry-specific hashtags. Can include links.",
    tone: "Professional, thought leadership"
  },
  email: {
    charLimit: 10000,
    description: "Formal structure with subject line, greeting, body, and call to action.",
    tone: "Personal but professional, detailed"
  }
};

export async function POST(req: NextRequest) {
  try {
    console.log("✅ Received request to generate social media posts");

    const { eventId, platform } = await req.json();
    console.log("📦 Parsed data:", { eventId, platform });

    if (!eventId || !platform) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Validate platform
    if (!Object.keys(PLATFORM_CONSTRAINTS).includes(platform)) {
      return NextResponse.json(
        { error: "Invalid platform specified" },
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
    const platformDetails = PLATFORM_CONSTRAINTS[platform as keyof typeof PLATFORM_CONSTRAINTS];

    // Construct prompt based on platform
    const prompt = `
Generate a ${platform} post for an event with the following details:

Event Details:
- Title: ${event?.eventTitle}
- Type: ${event?.eventType}
- Date: ${event?.eventDate}
- Time: ${eventOutput?.eventSchedule?.[0]?.time || "TBD"}
- Location: ${event?.location}
- Theme: ${event?.preferences?.theme || "Not specified"}

IMPORTANT REQUIREMENTS:
1. Character limit: ${platformDetails.charLimit} characters maximum
2. Platform: ${platform} (${platformDetails.description})
3. Tone: ${platformDetails.tone}
4. Include relevant hashtags appropriate for the platform
5. Include a clear call to action
${platform === 'email' ? '6. Include a subject line' : ''}

For context, this is the event schedule:
${JSON.stringify(eventOutput?.eventSchedule || [])}

Return ONLY the post content, nothing else. No explanations or additional text. For email, include a subject line separated by "SUBJECT:" at the beginning.
`;

    console.log("✉️ Sending prompt to Gemini...");
    
    // ✅ FIXED: Use correct SDK
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    const postContent = response.text() || "";
    console.log("📄 Generated post content");

    // Create the post data
    const postData: {
      platform: string;
      content: string;
      characterCount: number;
      createdAt: string;
      subject?: string;
    } = {
      platform,
      content: postContent,
      characterCount: postContent.length,
      createdAt: new Date().toISOString(),
    };

    // Email-specific processing for subject line
    let emailSubject = null;
    let processedContent = postContent;
    
    if (platform === 'email' && postContent.includes('SUBJECT:')) {
      const parts = postContent.split('SUBJECT:');
      emailSubject = parts[1].split('\n')[0].trim();
      processedContent = parts[1].substring(parts[1].indexOf('\n')).trim();
      
      postData.subject = emailSubject;
      postData.content = processedContent;
    }

    // Update the eventOutputs document to include the new post
    const currentEventOutput = outputDoc.data() || {};
    const currentSocialPosts = currentEventOutput.socialPosts || {};
    
    // Update with the new post
    const updatedSocialPosts = {
      ...currentSocialPosts,
      [platform]: postData
    };

    // Update the document in Firestore
    await updateDoc(outputDocRef, {
      socialPosts: updatedSocialPosts
    });
    
    console.log(`✅ ${platform} post stored in eventOutputs.socialPosts`);

    return NextResponse.json({ 
      success: true, 
      post: postData 
    });
  } catch (error) {
    console.error("❌ Error generating social media post:", error);
    return NextResponse.json(
      { error: "Failed to generate social media post" },
      { status: 500 }
    );
  }
}