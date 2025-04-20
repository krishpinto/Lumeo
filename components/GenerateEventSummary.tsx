"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation"; // Import useParams to get the eventId from the URL

export default function GenerateEventSummary() {
  const [output, setOutput] = useState<any>(null); // Allow `output` to store objects
  const [loading, setLoading] = useState(false);
  const { eventId } = useParams(); // Get the eventId from the URL

  const handleGenerate = async () => {
    if (!eventId) {
      console.error("Event ID is missing from the URL.");
      setOutput("Event ID is missing from the URL.");
      return;
    }

    setLoading(true);
    setOutput(null);

    try {
      const response = await fetch("/api/generate/eventdata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }), // Use eventId from the URL
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        setOutput(`Failed to generate content: ${errorText}`);
        return;
      }

      const data = await response.json();
      setOutput(data.output); // Use `data.output` as returned by the API
    } catch (error) {
      console.error("Request failed:", error);
      setOutput("An error occurred while generating content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleGenerate}
        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Event Summary"}
      </button>

      {output && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-bold">Generated Output:</h3>
          {/* Render the output as JSON */}
          {typeof output === "object" ? (
            <pre className="text-sm text-gray-800">
              {JSON.stringify(output, null, 2)}
            </pre>
          ) : (
            <p>{output}</p>
          )}
        </div>
      )}
    </div>
  );
}
