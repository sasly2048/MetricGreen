"use client";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="mx-auto flex w-full max-w-[1600px]">
      <DashboardSidebar />
      <div className="min-w-0 flex-1 px-4 py-6 pb-24 sm:px-6 sm:py-8 sm:pb-12 lg:px-10 lg:pb-12">
        {children}
      </div>
    </div>
  );
}
