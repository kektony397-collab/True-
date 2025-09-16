
import React from 'react';

interface FuelGaugeProps {
  fuelLiters: number;
  tankCapacity: number;
}

const FuelGauge: React.FC<FuelGaugeProps> = ({ fuelLiters, tankCapacity }) => {
  const percentage = Math.max(0, Math.min(1, fuelLiters / tankCapacity));
  const isLow = percentage < 0.2;

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference * (1 - percentage * 0.75);

  const strokeColorClass = isLow ? 'stroke-red-500' : 'stroke-cyan-400';

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
            className={`${strokeColorClass} transition-all duration-500 ease-in-out`}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
           <span className={`text-4xl font-bold ${isLow ? 'text-red-500' : 'text-white'} leading-none`}>
            {(percentage * 100).toFixed(0)}<span className="text-2xl">%</span>
          </span>
          <span className="text-sm text-gray-400">{fuelLiters.toFixed(1)} L</span>
        </div>
      </div>
      <h3 className="text-sm text-cyan-400 font-semibold tracking-widest mt-2">FUEL</h3>
    </div>
  );
};

export default React.memo(FuelGauge);
