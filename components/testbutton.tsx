"use client";

import React, { useState } from "react";

export default function GenerateCookieRecipes() {
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setOutput(null);

    try {
      const eventId = "jInCYtLBUt1HVa37peqV"; // Replace with the actual eventId
      const response = await fetch("/api/generate/testing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }), // Include eventId in the request body
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        setOutput("Failed to generate content.");
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
          <pre className="text-sm text-gray-800">{output}</pre>
        </div>
      )}
    </div>
  );
}
