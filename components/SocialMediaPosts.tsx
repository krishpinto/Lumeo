"use client";

import React, { useState } from "react";
import { Clipboard, Check } from "lucide-react";

interface SocialMediaPostsProps {
  eventId: string;
  eventOutput: any | null;
  refreshEventOutput: () => Promise<void>;
}

export default function SocialMediaPosts({ eventId, eventOutput, refreshEventOutput }: SocialMediaPostsProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("twitter");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);

  // Available platforms
  const platforms = [
    { id: "twitter", name: "Twitter", icon: "🐦", color: "bg-blue-600" },
    { id: "instagram", name: "Instagram", icon: "📸", color: "bg-pink-600" },
    { id: "facebook", name: "Facebook", icon: "👍", color: "bg-blue-700" },
    { id: "linkedin", name: "LinkedIn", icon: "💼", color: "bg-blue-800" },
    { id: "email", name: "Email", icon: "📧", color: "bg-gray-600" },
  ];

  const generatePost = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/generate/socialposts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          platform: selectedPlatform,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate post");
      }

      const data = await response.json();
      if (data.success) {
        setSuccess(`${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} post generated successfully!`);
        // Refresh event output to get the new post
        await refreshEventOutput();
      }
    } catch (error) {
      console.error("Error generating post:", error);
      setError(error instanceof Error ? error.message : "Failed to generate post");
    } finally {
      setLoading(false);
    }
  };

  // Copy post content to clipboard
  const copyToClipboard = (platform: string) => {
    if (!eventOutput?.socialPosts?.[platform]) return;
    
    let contentToCopy = eventOutput.socialPosts[platform].content;
    
    // For email, include subject line
    if (platform === 'email' && eventOutput.socialPosts[platform].subject) {
      contentToCopy = `Subject: ${eventOutput.socialPosts[platform].subject}\n\n${contentToCopy}`;
    }
    
    navigator.clipboard.writeText(contentToCopy);
    setCopiedPlatform(platform);
    
    // Reset copied status after 2 seconds
    setTimeout(() => {
      setCopiedPlatform(null);
    }, 2000);
  };

  // Check if a post for a platform already exists
  const postExists = (platform: string) => {
    return eventOutput?.socialPosts && eventOutput.socialPosts[platform];
  };

  // Character limits for each platform (for UI display)
  const getCharacterLimit = (platform: string) => {
    const limits: Record<string, number> = {
      twitter: 280,
      instagram: 2200,
      facebook: 63206,
      linkedin: 3000,
      email: 10000
    };
    return limits[platform] || 0;
  };

  return (
    <div className=" p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-100">Generate Social Media Posts</h2>

      {!eventOutput && (
        <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
          <p className="text-yellow-400">
            You need to generate event data first before creating social media posts. Go to the "Event Details" tab and click on "Generate Event Data".
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Platform selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Platform
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  selectedPlatform === platform.id
                    ? "border-blue-500  bg-gray-800 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    : "border-gray-700  hover:border-blue-400 hover:border-opacity-50"
                }`}
                onClick={() => setSelectedPlatform(platform.id)}
              >
                <div className="text-center">
                  <span className={`block h-10 w-10 mx-auto mb-2 rounded-full ${platform.color} flex items-center justify-center text-lg`}>
                    {platform.icon}
                  </span>
                  <h3 className="font-medium text-gray-200">{platform.name}</h3>
                  {postExists(platform.id) && (
                    <span className="text-xs text-green-400">
                      Generated
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform info */}
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="font-medium mb-2 text-gray-200">
            {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} Post Guidelines
          </h3>
          <p className="text-sm text-gray-400 mb-2">
            Character Limit: {getCharacterLimit(selectedPlatform)}
          </p>
          <p className="text-sm text-gray-400">
            {selectedPlatform === 'twitter' && "Short, concise with hashtags. Keep it conversational and direct."}
            {selectedPlatform === 'instagram' && "Visual-focused with hashtags (up to 30). More descriptive and inspirational."}
            {selectedPlatform === 'facebook' && "Medium-length with optional hashtags. Engaging and informational in tone."}
            {selectedPlatform === 'linkedin' && "Professional tone with industry-specific hashtags. Focus on business value."}
            {selectedPlatform === 'email' && "Formal structure with subject line, greeting, body text, and clear call to action."}
          </p>
        </div>

        {/* Generate button */}
        <div className="flex flex-col space-y-4">
          <button
            onClick={generatePost}
            disabled={loading || !eventOutput}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <span className="mr-2">✨</span>
                Generate {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} Post
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

        {/* Generated posts */}
        {eventOutput?.socialPosts && Object.keys(eventOutput.socialPosts).length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-medium mb-3 text-gray-200">Generated Social Media Posts</h3>
            <div className="space-y-4">
              {Object.entries(eventOutput.socialPosts).map(([platform, postData]: [string, any]) => {
                const platformObj = platforms.find(p => p.id === platform);
                return (
                  <div key={platform} className="border border-gray-700 rounded-lg overflow-hidden">
                    <div className={`${platformObj?.color || 'bg-gray-600'} p-3 flex justify-between items-center text-white`}>
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{platformObj?.icon || '📱'}</span>
                        <h4 className="font-medium capitalize">{platform}</h4>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(platform)}
                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded"
                        title="Copy to clipboard"
                      >
                        {copiedPlatform === platform ? <Check size={18} /> : <Clipboard size={18} />}
                      </button>
                    </div>
                    <div className="p-4 bg-gray-800">
                      {platform === 'email' && postData.subject && (
                        <div className="mb-2">
                          <span className="font-medium text-gray-300">Subject:</span> <span className="text-gray-200">{postData.subject}</span>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap text-gray-300">
                        {postData.content}
                      </div>
                      <div className="mt-2 text-xs text-gray-500 flex justify-between">
                        <span>Characters: {postData.characterCount} / {getCharacterLimit(platform)}</span>
                        <span>Created: {new Date(postData.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}