
import React from 'react';
import { Player, PassOption } from '@/types/football';

interface PassScoreDisplayProps {
  ballHolder: Player;
  passOptions: PassOption[];
}

const PassScoreDisplay: React.FC<PassScoreDisplayProps> = ({ ballHolder, passOptions }) => {
  const bestPass = passOptions.length > 0 ? passOptions.reduce((best, current) => 
    current.score > best.score ? current : best
  ) : null;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Pass Analysis</h3>
      
      <div className="mb-3">
        <p className="text-sm"><strong>Ball Holder:</strong> {ballHolder.name}</p>
        <p className="text-sm"><strong>Position:</strong> {ballHolder.position}</p>
        <p className="text-sm"><strong>Style:</strong> {ballHolder.playingStyle}</p>
      </div>

      {bestPass && (
        <div className="mb-3 p-2 bg-yellow-50 rounded">
          <p className="text-sm font-semibold">Best Pass Option:</p>
          <p className="text-sm">{bestPass.targetPlayer.name} ({bestPass.targetPlayer.position})</p>
          <p className="text-sm font-bold">Score: {bestPass.score.toFixed(1)}</p>
        </div>
      )}

      <div className="space-y-2 max-h-48 overflow-y-auto">
        <p className="text-sm font-semibold">All Pass Options:</p>
        {passOptions.map((option, index) => (
          <div key={index} className="text-xs p-2 border rounded">
            <p><strong>{option.targetPlayer.name}</strong> ({option.targetPlayer.position})</p>
            <p>Total Score: <span className="font-bold">{option.score.toFixed(1)}</span></p>
            <p>Distance: {option.distance.toFixed(1)}</p>
            <p>Opponent Density: {option.opponentDensity.toFixed(1)}</p>
            <p>Tactical: {option.tacticalAlignment.toFixed(1)}</p>
            <p>Style: {option.styleMatch.toFixed(1)}</p>
            <p>AI Pref: {option.aiPreference.toFixed(1)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PassScoreDisplay;
