
import React from 'react';

interface SpeedometerProps {
  speed: number;
}

const Speedometer: React.FC<SpeedometerProps> = ({ speed }) => {
  const MAX_SPEED = 120;
  const clampedSpeed = Math.min(Math.max(speed, 0), MAX_SPEED);
  const percentage = clampedSpeed / MAX_SPEED;

  const circumference = 2 * Math.PI * 40; // r=40
  const strokeDashoffset = circumference * (1 - percentage * 0.75); // 0.75 for 270 degrees

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center justify-center aspect-square">
      <div className="relative w-full h-full">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-[225deg]">
          <circle
            cx="50"
            cy="50"
            r="40"
            strokeWidth="8"
            className="stroke-gray-700"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            strokeWidth="8"
            className="stroke-cyan-400 transition-all duration-500 ease-in-out"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white leading-none">
            {Math.round(clampedSpeed)}
          </span>
          <span className="text-sm text-gray-400">km/h</span>
        </div>
      </div>
      <h3 className="text-sm text-cyan-400 font-semibold tracking-widest mt-2">SPEED</h3>
    </div>
  );
};

export default React.memo(Speedometer);
