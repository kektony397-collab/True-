
export interface Settings {
  bikeModel: string;
  tankCapacityL: number;
  fuelEconomyKmPerL: number;
}

export interface RefuelRecord {
  id: string;
  timestamp: string;
  litersAdded: number;
  totalOdometerKm: number;
}

export interface BikeState {
  currentFuelL: number;
  tripKm: number;
  totalOdometerKm: number;
  currentSpeedKph: number;
  isGpsAvailable: boolean;
  estimatedRangeKm: number;
}
