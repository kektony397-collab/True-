import React from 'react';
import { BikeState } from '../types';
import Speedometer from './Speedometer';
import FuelGauge from './FuelGauge';
import Odometer from './Odometer';

const Dashboard: React.FC<BikeState> = (props) => {
  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Speedometer speed={props.currentSpeedKph} />
        <FuelGauge 
          fuelLiters={props.currentFuelL} 
          tankCapacity={8} // Assuming fixed capacity for UI, could come from settings
        />
      </div>
      <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center justify-center space-y-2">
        <h3 className="text-sm text-cyan-400 font-semibold tracking-widest">ODOMETER</h3>
        <Odometer kilometers={props.totalOdometerKm} />
      </div>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm text-cyan-400 font-semibold tracking-widest">TRIP</h3>
          <p className="text-3xl font-bold text-white mt-1">
            {props.tripKm.toFixed(1)} <span className="text-lg text-gray-400">km</span>
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm text-cyan-400 font-semibold tracking-widest">RANGE</h3>
          <p className="text-3xl font-bold text-white mt-1">
            {props.estimatedRangeKm.toFixed(0)} <span className="text-lg text-gray-400">km</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);