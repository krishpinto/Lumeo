// app/dashboard/create/page.tsx
"use client";

import React from "react";
import EnhancedEventInputForm from "@/components/EnhancedEventInputForm";

export default function CreatePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>
      <EnhancedEventInputForm />
    </div>
  );
}