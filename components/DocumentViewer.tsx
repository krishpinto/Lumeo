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
      <div className="bg-gray-900 p-6 rounded-lg border border-yellow-700">
        <p className="text-yellow-400">
          No documents have been generated yet. Go to the "Create Documents" tab to generate event documents.
        </p>
      </div>
    );
  }

  return (
    <div className={` rounded-lg shadow-lg ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="flex items-center justify-between p-4  border-b border-gray-700 rounded-t-lg">
        <h2 className="text-xl font-semibold text-gray-100">Document Viewer</h2>
        <div className="flex space-x-2">
          <button 
            onClick={toggleFullscreen}
            className="p-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors"
            aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {fullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
          <button 
            onClick={() => setFullscreen(false)}
            className={`p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors ${fullscreen ? 'block' : 'hidden'}`}
          >
            Close
          </button>
        </div>
      </div>
      
      <div className={`grid ${fullscreen ? 'grid-cols-5' : 'grid-cols-1 md:grid-cols-5'} h-full`}>
        {/* Document Selection Sidebar */}
        <div className={`${fullscreen ? 'col-span-1' : 'col-span-1 md:col-span-1'} border-r border-gray-700 p-4 bg-gray-850`}>
          <h3 className="font-medium mb-3 text-gray-200">Available Documents</h3>
          <div className="space-y-2">
            {Object.entries(documents).map(([docType, docData]: [string, any]) => (
              <button
                key={docType}
                onClick={() => setSelectedDocument(docType)}
                className={`w-full text-left p-3 rounded flex items-center transition-all ${
                  selectedDocument === docType 
                    ? ' text-blue-300 border border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]' 
                    : 'hover:bg-gray-700 text-gray-300 border border-transparent'
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
                    <span className="text-xs text-gray-400">
                      Theme: {docData.theme.charAt(0).toUpperCase() + docData.theme.slice(1)}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
          
          {/* Document Actions */}
          {selectedDocument && (
            <div className="mt-6 space-y-3">
              <h3 className="font-medium mb-2 text-gray-200">Actions</h3>
              <button
                onClick={downloadDocument}
                className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <span className="mr-2">💾</span>
                Download
              </button>
              <button
                onClick={printDocument}
                className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                <span className="mr-2">🖨️</span>
                Print
              </button>
            </div>
          )}
        </div>
        
        {/* Document Preview */}
        <div className={`${fullscreen ? 'col-span-4' : 'col-span-1 md:col-span-4'} p-4 `}>
          {selectedDocument ? (
            <div className="h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-200">
                  {selectedDocument.charAt(0).toUpperCase() + selectedDocument.slice(1)} Preview
                </h3>
                {documents[selectedDocument]?.theme && (
                  <span className="bg-blue-900/40 text-blue-300 text-xs py-1 px-3 rounded-full border border-blue-700">
                    Theme: {documents[selectedDocument].theme.charAt(0).toUpperCase() + documents[selectedDocument].theme.slice(1)}
                  </span>
                )}
              </div>
              <div className={`border border-gray-700 rounded-lg overflow-hidden ${fullscreen ? 'h-[calc(100vh-180px)]' : 'h-[600px]'}`}>
                <div className="bg-white w-full h-full">
                  <iframe
                    srcDoc={iframeSrc}
                    className="w-full h-full border-0"
                    title={`${selectedDocument} preview`}
                    sandbox="allow-same-origin allow-scripts"
                    onLoad={(e) => {
                      // Remove any unwanted elements from the iframe
                      try {
                        const iframe = e.currentTarget;
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                        
                        if (iframeDoc) {
                          const unwantedElements = iframeDoc.querySelectorAll('script:not([type="application/ld+json"])');
                          unwantedElements.forEach(el => el.remove());
                        }
                      } catch (error) {
                        console.error("Error cleaning iframe:", error);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 border border-gray-700 rounded-lg bg-gray-800">
              <p className="text-gray-400">Select a document to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}