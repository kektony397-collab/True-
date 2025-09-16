
import React from 'react';

interface OdometerProps {
  kilometers: number;
}

const Odometer: React.FC<OdometerProps> = ({ kilometers }) => {
  const formatted = kilometers.toFixed(1).padStart(7, '0').split('');
  
  return (
    <div className="flex items-center bg-black/50 p-2 rounded-md space-x-1">
      {formatted.map((char, index) => (
        <React.Fragment key={index}>
          {char === '.' ? (
            <span className="text-4xl text-gray-500 self-end pb-1">.</span>
          ) : (
            <div
              className={`w-6 h-10 flex items-center justify-center rounded ${
                index === formatted.length - 1 ? 'bg-cyan-900/50 text-cyan-300' : 'bg-gray-800/80 text-white'
              }`}
            >
              <span className="text-4xl font-bold">{char}</span>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default React.memo(Odometer);
