import React from "react";

const PERIODS = [
  { value: "weekly",  label: "This Week"  },
  { value: "monthly", label: "This Month" },
  { value: "alltime", label: "All Time"   },
];

const PeriodFilter = ({ selected, onChange }) => {
  return (
    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${selected === p.value
              ? "bg-blue-900 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-200"}`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
};

export default PeriodFilter;
