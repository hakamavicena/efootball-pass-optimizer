
import React from 'react';
import { PassOption, Player } from '@/types/football';

interface FinishedPhasePanelProps {
  ballHolder: Player;
  executedPass: PassOption;
}

const FinishedPhasePanel: React.FC<FinishedPhasePanelProps> = ({ ballHolder, executedPass }) => {
  const { targetPlayer, score, distance, opponentDensity, tacticalAlignment, styleMatch, aiPreference } = executedPass;

  // Formula weights
  const w1 = 0.2, w2 = 0.2, w3 = 0.2, w4 = 0.2, w5 = 0.2;

  return (
    <div className="bg-white p-4 rounded shadow border-l-4 border-green-500">
      <h3 className="font-bold mb-3 text-lg text-green-700">Pass Executed!</h3>
      
      {/* Ball Holder Info */}
      <div className="mb-3 p-2 bg-blue-50 rounded">
        <p className="font-semibold text-blue-700">From: {ballHolder.name}</p>
        <p className="text-sm text-gray-600">{ballHolder.position} - {ballHolder.playingStyle}</p>
        <p className="text-sm text-gray-600">AI Style: {ballHolder.aiStyle}</p>
      </div>
      
      {/* Target Player Info */}
      <div className="mb-3 p-2 bg-green-50 rounded">
        <p className="font-semibold text-green-700">To: {targetPlayer.name}</p>
        <p className="text-sm text-gray-600">{targetPlayer.position} - {targetPlayer.playingStyle}</p>
        <p className="text-sm text-gray-600">AI Style: {targetPlayer.aiStyle}</p>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Pass Score (Best Option):</span>
          <span className="font-bold text-lg text-green-600">{score.toFixed(2)}</span>
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
          <p className="mt-1">This was the best pass option (lowest score)</p>
          <p className="mt-1 text-green-600">✓ Pass successfully executed</p>
        </div>
      </div>
    </div>
  );
};

export default FinishedPhasePanel;
