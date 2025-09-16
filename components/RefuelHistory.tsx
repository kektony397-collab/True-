
import React, { useState } from 'react';
import { RefuelRecord } from '../types';
import { LoadingSpinner } from './icons/Icons';

interface RefuelHistoryProps {
  records: RefuelRecord[];
  onAddRecord: (text: string) => Promise<void>;
  aiAnalysis: string | null;
  onAnalyze: () => void;
  loadingNlp: boolean;
  loadingAnalysis: boolean;
}

const RefuelHistory: React.FC<RefuelHistoryProps> = ({ records, onAddRecord, aiAnalysis, onAnalyze, loadingNlp, loadingAnalysis }) => {
  const [nlpInput, setNlpInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nlpInput.trim() && !loadingNlp) {
      await onAddRecord(nlpInput);
      setNlpInput('');
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div>
        <h2 className="text-lg font-bold text-cyan-400 mb-2">Log Refuel</h2>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={nlpInput}
            onChange={(e) => setNlpInput(e.target.value)}
            placeholder="e.g., 'filled up for 20 dollars' or '5.5L'"
            className="flex-grow bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={loadingNlp}
          />
          <button
            type="submit"
            className="bg-cyan-500 text-white font-bold px-4 py-2 rounded-md hover:bg-cyan-600 transition disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={loadingNlp || !nlpInput.trim()}
          >
            {loadingNlp ? <LoadingSpinner /> : 'Add'}
          </button>
        </form>
      </div>

      <div className="flex-grow overflow-y-auto bg-gray-800/50 rounded-lg p-3 space-y-2">
        <h2 className="text-lg font-bold text-cyan-400 mb-2">History</h2>
        {records.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No refuel records yet.</p>
        ) : (
          records.map(record => (
            <div key={record.id} className="bg-gray-700/50 p-3 rounded-md flex justify-between items-center">
              <div>
                <p className="font-semibold text-white">{record.litersAdded.toFixed(2)} Liters</p>
                <p className="text-xs text-gray-400">at {Math.round(record.totalOdometerKm).toLocaleString()} km</p>
              </div>
              <p className="text-xs text-gray-400">{new Date(record.timestamp).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>

      <div>
        <button
          onClick={onAnalyze}
          disabled={loadingAnalysis || records.length < 2}
          className="w-full bg-indigo-600 text-white font-bold px-4 py-2 rounded-md hover:bg-indigo-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loadingAnalysis ? <LoadingSpinner /> : 'Get AI Fuel Analysis'}
        </button>
        {aiAnalysis && (
          <div className="mt-4 bg-gray-800 p-4 rounded-lg border border-indigo-500/50">
            <h3 className="text-md font-bold text-indigo-400 mb-2">AI Insights</h3>
            <div className="text-sm text-gray-300 whitespace-pre-wrap">{aiAnalysis}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RefuelHistory;
