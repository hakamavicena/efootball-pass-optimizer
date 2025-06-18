
import React from 'react';
import { PassOption } from '@/types/football';

interface PassCalculationPanelProps {
  passOption: PassOption;
}

const PassCalculationPanel: React.FC<PassCalculationPanelProps> = ({ passOption }) => {
  const { targetPlayer, score, distance, opponentDensity, tacticalAlignment, styleMatch, aiPreference } = passOption;

  return (
    <div className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
      <h3 className="font-bold mb-3 text-lg">Pass Calculation</h3>
      
      <div className="mb-3">
        <p className="font-semibold text-blue-600">{targetPlayer.name}</p>
        <p className="text-sm text-gray-600">{targetPlayer.position} - {targetPlayer.playingStyle}</p>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Total Score:</span>
          <span className="font-bold text-lg">{score.toFixed(2)}</span>
        </div>
        
        <hr className="my-2" />
        
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Distance (w=0.2):</span>
            <span>{distance.toFixed(1)} → {(0.2 * (100 - distance)).toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Opponent Density (w=0.2):</span>
            <span>{opponentDensity.toFixed(1)} → {(0.2 * (100 - opponentDensity)).toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Tactical Alignment (w=0.2):</span>
            <span>{tacticalAlignment.toFixed(1)} → {(0.2 * tacticalAlignment).toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Style Match (w=0.2):</span>
            <span>{styleMatch.toFixed(1)} → {(0.2 * styleMatch).toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>AI Preference (w=0.2):</span>
            <span>{aiPreference.toFixed(1)} → {(0.2 * aiPreference).toFixed(2)}</span>
          </div>
        </div>
        
        <hr className="my-2" />
        
        <div className="text-xs text-gray-500">
          <p>Formula: 0.2×(100-D) + 0.2×(100-O) + 0.2×T + 0.2×S + 0.2×A</p>
          <p className="mt-1">Lower score = Better pass option</p>
        </div>
      </div>
    </div>
  );
};

export default PassCalculationPanel;
