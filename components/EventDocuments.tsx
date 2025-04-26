"use client";

import React, { useState } from "react";

interface EventDocumentsProps {
  eventId: string;
  eventOutput: any | null;
  refreshEventOutput: () => Promise<void>;
}

export default function EventDocuments({ eventId, eventOutput, refreshEventOutput }: EventDocumentsProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDocType, setSelectedDocType] = useState<string>("invitation");
  const [selectedTheme, setSelectedTheme] = useState<string>("elegant");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Available document types
  const documentTypes = [
    { id: "invitation", name: "Event Invitation", icon: "✉️" },
    { id: "itinerary", name: "Event Itinerary", icon: "📋" },
  ];

  // Available themes
  const themes = [
    { id: "elegant", name: "Elegant" },
    { id: "modern", name: "Modern" },
    { id: "festive", name: "Festive" },
    { id: "formal", name: "Formal" },
    { id: "casual", name: "Casual" },
    { id: "corporate", name: "Corporate" },
  ];

  const generateDocument = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/generate/eventdocuments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          documentType: selectedDocType,
          theme: selectedTheme,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate document");
      }

      const data = await response.json();
      if (data.success) {
        setSuccess(`${selectedDocType.charAt(0).toUpperCase() + selectedDocType.slice(1)} generated successfully!`);
        // Refresh event output to get the new document
        await refreshEventOutput();
      }
    } catch (error) {
      console.error("Error generating document:", error);
      setError(error instanceof Error ? error.message : "Failed to generate document");
    } finally {
      setLoading(false);
    }
  };

  // Check if a document type already exists in the output
  const documentExists = (docType: string) => {
    return eventOutput?.eventDocuments && eventOutput.eventDocuments[docType];
  };

  return (
    <div className=" p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-100">Generate Event Documents</h2>

      {!eventOutput && (
        <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
          <p className="text-yellow-400">
            You need to generate event data first before creating documents. Go to the "Event Details" tab and click on "Generate Event Data".
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Document type selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Document Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {documentTypes.map((docType) => (
              <div
                key={docType.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedDocType === docType.id
                    ? "border-purple-700 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    : "border hover:border-purple-700 hover:border-opacity-50"
                }`}
                onClick={() => setSelectedDocType(docType.id)}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{docType.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-200">{docType.name}</h3>
                    {documentExists(docType.id) && (
                      <span className="text-xs text-green-400">
                        Already generated - will be replaced
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Theme selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Design Theme
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  selectedTheme === theme.id
                    ? "border-purple-700 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    : "border hover:border-purple-700 hover:border-opacity-50"
                }`}
                onClick={() => setSelectedTheme(theme.id)}
              >
                <div className="text-center">
                  <span className="block h-8 w-8 mx-auto mb-2 rounded-full bg-gradient-to-br from-purple-400 to-purple-700"></span>
                  <h3 className="font-medium text-gray-200">{theme.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <div className="flex flex-col space-y-4">
          <button
            onClick={generateDocument}
            disabled={loading || !eventOutput}
            className="w-full py-3 border-grey-800 border-3 text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-700 disabled:text-gray-400 flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <span className="mr-2">✨</span>
                Generate {selectedDocType.charAt(0).toUpperCase() + selectedDocType.slice(1)}
              </>
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-400">
              {success}
            </div>
          )}
        </div>

        {/* Existing documents section */}
        {eventOutput?.eventDocuments && Object.keys(eventOutput.eventDocuments).length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-medium mb-3 text-gray-200">Already Generated Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(eventOutput.eventDocuments).map(([docType, docData]: [string, any]) => (
                <div key={docType} className="flex items-center p-4 border border-gray-700 rounded-lg bg-gray-800">
                  <span className="text-2xl mr-3">
                    {docType === 'invitation' ? '✉️' : '📋'}
                  </span>
                  <div>
                    <h4 className="font-medium capitalize text-gray-200">{docType}</h4>
                    <p className="text-sm text-gray-400">
                      Theme: {docData.theme.charAt(0).toUpperCase() + docData.theme.slice(1)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(docData.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}