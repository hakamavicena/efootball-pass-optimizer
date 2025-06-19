
import React from 'react';
import { PassOption } from '@/types/football';

interface PassCalculationPanelProps {
  passOption: PassOption;
}

const PassCalculationPanel: React.FC<PassCalculationPanelProps> = ({ passOption }) => {
  const { targetPlayer, score, distance, opponentDensity, tacticalAlignment, styleMatch, aiPreference } = passOption;

  // Formula weights
  const w1 = 0.2, w2 = 0.2, w3 = 0.2, w4 = 0.2, w5 = 0.2;

  return (
    <div className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
      <h3 className="font-bold mb-3 text-lg">Pass Calculation (Directed Graph)</h3>
      
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
            <span>Distance Dij (w1=0.2):</span>
            <span>{distance.toFixed(1)} → {(w1 * distance).toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Opponent Density Oj (w2=0.2):</span>
            <span>{opponentDensity.toFixed(1)} → {(w2 * opponentDensity).toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Tactical (100-Tij) (w3=0.2):</span>
            <span>{tacticalAlignment.toFixed(1)} → {(w3 * (100 - tacticalAlignment)).toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Player Style (100-Pi) (w4=0.2):</span>
            <span>{styleMatch.toFixed(1)} → {(w4 * (100 - styleMatch)).toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>AI Preference (100-Ai) (w5=0.2):</span>
            <span>{aiPreference.toFixed(1)} → {(w5 * (100 - aiPreference)).toFixed(2)}</span>
          </div>
        </div>
        
        <hr className="my-2" />
        
        <div className="text-xs text-gray-500">
          <p className="font-semibold">Formula: w1⋅Dij + w2⋅Oj + w3⋅(100-Tij) + w4⋅(100-Pi) + w5⋅(100-Ai)</p>
          <p className="mt-1">Lower score = Better pass option</p>
          <p className="mt-1 text-blue-600">Graph: Directed edge from ball holder → target</p>
        </div>
      </div>
    </div>
  );
};

export default PassCalculationPanel;
