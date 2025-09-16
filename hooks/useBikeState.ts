
import { useState, useEffect, useCallback } from 'react';
import { Settings, RefuelRecord, BikeState } from '../types';
import { parseRefuelEntry, analyzeFuelEconomy as analyzeFuelEconomyAPI } from '../services/geminiService';

const DEFAULT_SETTINGS: Settings = {
  bikeModel: 'Honda Dream Yuga',
  tankCapacityL: 8,
  fuelEconomyKmPerL: 55,
};

const ODOMETER_START_KM = 12000;

export const useBikeState = () => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const storedSettings = localStorage.getItem('bikeSettings');
      return storedSettings ? JSON.parse(storedSettings) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [refuelRecords, setRefuelRecords] = useState<RefuelRecord[]>(() => {
     try {
      const storedRecords = localStorage.getItem('refuelRecords');
      return storedRecords ? JSON.parse(storedRecords) : [];
    } catch {
      return [];
    }
  });

  const [bikeState, setBikeState] = useState<BikeState>(() => {
    const initialOdometer = refuelRecords[refuelRecords.length - 1]?.totalOdometerKm || ODOMETER_START_KM;
    return {
      currentFuelL: settings.tankCapacityL,
      tripKm: 0,
      totalOdometerKm: initialOdometer,
      currentSpeedKph: 0,
      isGpsAvailable: true,
      estimatedRangeKm: settings.tankCapacityL * settings.fuelEconomyKmPerL,
    };
  });
  
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingNlp, setLoadingNlp] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('bikeSettings', JSON.stringify(settings));
    // Recalculate range when settings change
    setBikeState(prev => ({
      ...prev,
      estimatedRangeKm: prev.currentFuelL * settings.fuelEconomyKmPerL
    }));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('refuelRecords', JSON.stringify(refuelRecords));
  }, [refuelRecords]);


  // Simulate real-time GPS data
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this data would come from navigator.geolocation.watchPosition
      // and be smoothed with a Kalman filter before processing.
      setBikeState(prev => {
        const isMoving = Math.random() > 0.2;
        const newSpeed = isMoving ? Math.max(0, prev.currentSpeedKph + (Math.random() * 6 - 3)) : 0;
        
        const distanceIncrement = newSpeed / 3600; // km traveled in the last second
        const newTotalOdometer = prev.totalOdometerKm + distanceIncrement;
        const newTripKm = prev.tripKm + distanceIncrement;
        
        const fuelConsumed = distanceIncrement / settings.fuelEconomyKmPerL;
        const newFuelL = Math.max(0, prev.currentFuelL - fuelConsumed);
        
        const newEstimatedRange = newFuelL * settings.fuelEconomyKmPerL;

        return {
          ...prev,
          currentSpeedKph: Math.min(120, newSpeed),
          totalOdometerKm: newTotalOdometer,
          tripKm: newTripKm,
          currentFuelL: newFuelL,
          estimatedRangeKm: newEstimatedRange,
          isGpsAvailable: Math.random() > 0.01 // Simulate occasional GPS drop
        };
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.fuelEconomyKmPerL]);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const addRefuelRecordWithNLP = useCallback(async (text: string) => {
    setLoadingNlp(true);
    try {
      const { litersAdded } = await parseRefuelEntry(text, settings.tankCapacityL);
      if (litersAdded > 0) {
        const newRecord: RefuelRecord = {
          id: new Date().toISOString(),
          timestamp: new Date().toISOString(),
          litersAdded,
          totalOdometerKm: bikeState.totalOdometerKm,
        };
        setRefuelRecords(prev => [...prev, newRecord].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        setBikeState(prev => ({
          ...prev,
          currentFuelL: Math.min(settings.tankCapacityL, prev.currentFuelL + litersAdded),
        }));
      }
    } catch (error) {
      console.error("Error parsing refuel entry:", error);
      // Here you would show an error toast to the user
    } finally {
      setLoadingNlp(false);
    }
  }, [bikeState.totalOdometerKm, settings.tankCapacityL]);
  
  const analyzeFuelEconomy = useCallback(async () => {
    setLoadingAnalysis(true);
    setAiAnalysis(null);
    try {
      const analysis = await analyzeFuelEconomyAPI(refuelRecords);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error("Error analyzing fuel economy:", error);
      setAiAnalysis("Sorry, I was unable to analyze your data at this time.");
    } finally {
      setLoadingAnalysis(false);
    }
  }, [refuelRecords]);

  return {
    ...bikeState,
    settings,
    refuelRecords,
    aiAnalysis,
    loadingNlp,
    loadingAnalysis,
    updateSettings,
    addRefuelRecordWithNLP,
    analyzeFuelEconomy,
  };
};
