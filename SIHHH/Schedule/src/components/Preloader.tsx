import React, { useEffect, useState } from "react";

export default function Preloader(): JSX.Element {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 700);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return <></>;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[#05111a] to-[#081421] opacity-95"></div>

      <div className="relative z-10 flex flex-col items-center gap-4">
        <div
          className="w-24 h-24 rounded-full animate-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(255,200,70,0.8), rgba(255,140,40,0.5), rgba(255,60,40,0.3))",
            boxShadow: "0 0 40px rgba(255,160,40,0.5)",
          }}
        ></div>

        <div className="text-center">
          <div className="text-xl font-semibold">Intelli-Schedule</div>
          <div className="text-sm text-gray-300 mt-1">
            Preparing an intelligent timetable for you…
          </div>
        </div>
      </div>
    </div>
  );
}
