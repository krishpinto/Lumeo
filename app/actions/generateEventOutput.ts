export async function generateEventOutput(eventId: string, userId: string) {
  try {
    console.log("Sending eventId:", eventId, "userId:", userId); // Debugging
    const response = await fetch("/api/generate/eventdata", {
      method: "POST",
      body: JSON.stringify({ eventId, userId }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error("Failed to generate event output.");
    }

    const data = await response.json();
    console.log("Generated Output:", data);
    return data; // Return the generated output
  } catch (error) {
    console.error("Request failed:", error);
    throw new Error("Failed to generate event output. Please try again.");
  }
}
