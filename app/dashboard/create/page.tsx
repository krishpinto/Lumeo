"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import EventInputForm from "@/components/EventInputForm";
import GenerateCookieRecipes from "@/components/testbutton";
export default function CreatePage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <EventInputForm />
      <GenerateCookieRecipes />
    </div>
  );
}
