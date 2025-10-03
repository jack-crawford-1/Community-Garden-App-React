export default function Rules({ rules }: { rules: string[] }) {
  return (
    <div className="bg-[#000000] p-6 rounded-xl border-l-8 border-[#55b47e] shadow-lg font-pixel text-xs leading-relaxed tracking-wide max-w-3xl mx-auto">
      <ul className="space-y-3 ">
        {rules.map((rule, idx) => (
          <li
            key={idx}
            className="text-white text-lg leading-8 ipangolin-regular"
          >
            <span className="mr-4 text-white">{idx + 1}</span>
            {rule}
          </li>
        ))}
      </ul>
    </div>
  );
}
