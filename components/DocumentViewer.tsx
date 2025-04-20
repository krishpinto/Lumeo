// components/DocumentViewer.tsx
"use client";

import React, { useState, useEffect } from "react";

interface DocumentViewerProps {
  documents: Record<string, any>;
  selectedDocument: string | null;
  setSelectedDocument: (doc: string | null) => void;
}

export default function DocumentViewer({ documents, selectedDocument, setSelectedDocument }: DocumentViewerProps) {
  const [iframeSrc, setIframeSrc] = useState<string>("");
  const [fullscreen, setFullscreen] = useState<boolean>(false);

  // Initialize with the first document if none is selected
  useEffect(() => {
    if (!selectedDocument && Object.keys(documents).length > 0) {
      setSelectedDocument(Object.keys(documents)[0]);
    }
  }, [documents, selectedDocument, setSelectedDocument]);

  // Update iframe content when selected document changes
  useEffect(() => {
    if (selectedDocument && documents[selectedDocument]) {
      setIframeSrc(documents[selectedDocument].htmlContent);
    }
  }, [selectedDocument, documents]);

  const downloadDocument = () => {
    if (!selectedDocument || !documents[selectedDocument]) return;
    
    const htmlContent = documents[selectedDocument].htmlContent;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedDocument}-document.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printDocument = () => {
    if (!selectedDocument || !documents[selectedDocument]) return;
    
    const htmlContent = documents[selectedDocument].htmlContent;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  if (Object.keys(documents).length === 0) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <p className="text-yellow-700">
          No documents have been generated yet. Go to the "Create Documents" tab to generate event documents.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
        <h2 className="text-xl font-semibold">Document Viewer</h2>
        <div className="flex space-x-2">
          <button 
            onClick={toggleFullscreen}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
            aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {fullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
          <button 
            onClick={() => setFullscreen(false)}
            className={`p-2 bg-red-500 text-white rounded hover:bg-red-600 ${fullscreen ? 'block' : 'hidden'}`}
          >
            Close
          </button>
        </div>
      </div>
      
      <div className={`grid ${fullscreen ? 'grid-cols-5' : 'grid-cols-1 md:grid-cols-5'} h-full`}>
        {/* Document Selection Sidebar */}
        <div className={`${fullscreen ? 'col-span-1' : 'col-span-1 md:col-span-1'} border-r p-4 bg-gray-50`}>
          <h3 className="font-medium mb-3">Available Documents</h3>
          <div className="space-y-2">
            {Object.entries(documents).map(([docType, docData]: [string, any]) => (
              <button
                key={docType}
                onClick={() => setSelectedDocument(docType)}
                className={`w-full text-left p-3 rounded flex items-center ${
                  selectedDocument === docType ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">
                  {docType === 'invitation' ? '✉️' : docType === 'itinerary' ? '📋' : '📄'}
                </span>
                <div>
                  <span className="block font-medium">
                    {docType.charAt(0).toUpperCase() + docType.slice(1)}
                  </span>
                  {docData.theme && (
                    <span className="text-xs text-gray-500">
                      Theme: {docData.theme.charAt(0).toUpperCase() + docData.theme.slice(1)}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
          
          {/* Document Actions */}
          {selectedDocument && (
            <div className="mt-6 space-y-2">
              <h3 className="font-medium mb-2">Actions</h3>
              <button
                onClick={downloadDocument}
                className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center"
              >
                <span className="mr-2">💾</span>
                Download
              </button>
              <button
                onClick={printDocument}
                className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center justify-center"
              >
                <span className="mr-2">🖨️</span>
                Print
              </button>
            </div>
          )}
        </div>
        
        {/* Document Preview */}
        <div className={`${fullscreen ? 'col-span-4' : 'col-span-1 md:col-span-4'} p-4`}>
          {selectedDocument ? (
            <div className="h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">
                  {selectedDocument.charAt(0).toUpperCase() + selectedDocument.slice(1)} Preview
                </h3>
                {documents[selectedDocument]?.theme && (
                  <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded">
                    Theme: {documents[selectedDocument].theme.charAt(0).toUpperCase() + documents[selectedDocument].theme.slice(1)}
                  </span>
                )}
              </div>
              <div className={`border rounded overflow-hidden ${fullscreen ? 'h-[calc(100vh-180px)]' : 'h-[600px]'}`}>
                <iframe
                  srcDoc={iframeSrc}
                  className="w-full h-full border-0"
                  title={`${selectedDocument} preview`}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Select a document to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}