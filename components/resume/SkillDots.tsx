const PROFICIENCY_DOTS: Record<string, number> = {
  expert: 5,
  advanced: 4,
  intermediate: 3,
}

export default function SkillDots({ proficiency }: { proficiency: string }) {
  const filled = PROFICIENCY_DOTS[proficiency] ?? 3
  return (
    <span className="inline-flex gap-0.5 ml-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full border ${i < filled ? 'bg-[#1a5c38] border-[#1a5c38]' : 'border-gray-400'}`}
        />
      ))}
    </span>
  )
}
