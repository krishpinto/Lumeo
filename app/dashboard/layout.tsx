import type React from "react";
import DashboardLayout from "@/components/dashboard/Dashboard-layout2";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
