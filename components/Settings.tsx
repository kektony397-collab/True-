import React, { useState, useEffect } from 'react';
import { Settings as SettingsType } from '../types';

interface SettingsProps {
  settings: SettingsType;
  onUpdate: (newSettings: Partial<SettingsType>) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  const [formState, setFormState] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormState(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: name === 'bikeModel' ? value : Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formState);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const InputField: React.FC<{
    label: string;
    name: keyof SettingsType;
    type: string;
    value: string | number;
    step?: string;
    inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  }> = ({ label, name, type, value, step, inputMode }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-cyan-400">
        {label}
      </label>
      <div className="mt-1">
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={handleChange}
          step={step}
          inputMode={inputMode}
          className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-cyan-400">Bike Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField 
          label="Bike Model" 
          name="bikeModel" 
          type="text" 
          value={formState.bikeModel} 
        />
        <InputField
          label="Tank Capacity (Liters)"
          name="tankCapacityL"
          type="number"
          value={formState.tankCapacityL}
          step="0.1"
          inputMode="decimal"
        />
        <InputField
          label="Avg. Fuel Economy (km/L)"
          name="fuelEconomyKmPerL"
          type="number"
          value={formState.fuelEconomyKmPerL}
          step="1"
          inputMode="decimal"
        />
        
        <div>
          <button
            type="submit"
            className="w-full bg-cyan-500 text-white font-bold px-4 py-2 rounded-md hover:bg-cyan-600 transition disabled:bg-gray-600"
          >
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
