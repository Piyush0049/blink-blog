"use client";

export default function SectionHeader({
  icon,
  title,
  gradient,
  borderGradient,
}) {
  return (
    <div className="mb-6 sm:mb-10">
      <div className="flex items-center gap-2 mb-1 sm:mb-1">
        {icon}
        <h2
          className={`text-xl sm:text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
        >
          {title}
        </h2>
      </div>
      <div
        className={`h-1 w-20 sm:w-28 bg-gradient-to-r ${borderGradient} rounded-full mb-4 sm:mb-6`}
      />
    </div>
  );
}
