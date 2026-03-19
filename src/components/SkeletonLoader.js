"use client";

import { motion } from "framer-motion";

export function SkeletonBlock({
  height = "h-32",
  width = "w-full",
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1,
        ease: "easeInOut",
      }}
      className={`bg-neutral-800/50 rounded-2xl ${height} ${width} ${className}`}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      <SkeletonBlock height="h-40" />
      <SkeletonBlock height="h-40" />
      <SkeletonBlock height="h-40" />

      {/* Skeleton for action cards or lists */}
      <SkeletonBlock height="h-64" className="md:col-span-2 lg:col-span-3" />
    </div>
  );
}
