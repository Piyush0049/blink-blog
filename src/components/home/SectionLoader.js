"use client";
import { Loader2 } from "lucide-react";

export default function SectionLoader() {
  return (
    <div className="flex justify-center items-center py-10">
      <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600 animate-spin" />
      <span className="ml-2 text-gray-600 text-sm sm:text-base">Loading...</span>
    </div>
  );
}
