import React from 'react';
import { SimulationState, PassOption } from '@/types/football';

interface SimpleFieldProps {
  simulation: SimulationState;
  onPassClick: (pass: PassOption) => void;
}

const SimpleField: React.FC<SimpleFieldProps> = ({ simulation, onPassClick }) => {
  if (simulation.phase === 'setup') {
    return (
      <div className="w-full h-96 bg-green-400 border-2 border-white rounded flex items-center justify-center">
        <p className="text-white text-xl">Select formation and click Start</p>
      </div>
    );
  }

  const { players, ballHolder, passOptions, pressureOpponents } = simulation;

  return (
    <div className="relative w-full h-96 bg-green-400 border-2 border-white rounded overflow-hidden">
      {/* Field markings */}
      <div className="absolute inset-0 border-2 border-white"></div>
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white"></div>
      <div className="absolute left-1/2 top-1/2 w-20 h-20 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      
      {/* Goal areas */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-24 border-2 border-white border-l-0"></div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-24 border-2 border-white border-r-0"></div>

      {/* Players */}
      {players.map((player) => {
        const isPressureOpponent = pressureOpponents.some(opp => opp.id === player.id);
        const isBallHolder = ballHolder?.id === player.id;
        
        return (
          <div
            key={player.id}
            className={`absolute w-6 h-6 rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-xs font-bold
              ${player.team === 'home' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'}
              ${isBallHolder ? 'ring-4 ring-yellow-400' : ''}
              ${isPressureOpponent ? 'ring-2 ring-orange-400' : ''}
            `}
            style={{
              left: `${player.x}%`,
              top: `${player.y}%`,
            }}
            title={`${player.name} (${player.position}) - ${player.playingStyle}`}
          >
            {player.position.slice(0, 2)}
          </div>
        );
      })}

      {/* Pass option arrows - made bigger and clickable */}
      {ballHolder && passOptions.map((option, index) => {
        const dx = option.targetPlayer.x - ballHolder.x;
        const dy = option.targetPlayer.y - ballHolder.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        // Color based on score (lower score = better = greener)
        const normalizedScore = Math.min(100, Math.max(0, option.score));
        const green = Math.floor(255 * (1 - normalizedScore / 100));
        const red = Math.floor(255 * (normalizedScore / 100));
        const color = `rgb(${red}, ${green}, 0)`;

        return (
          <div
            key={index}
            className="absolute cursor-pointer hover:opacity-80"
            style={{
              left: `${ballHolder.x}%`,
              top: `${ballHolder.y}%`,
              width: `${length}%`,
              height: '6px', // Made thicker
              background: color,
              transformOrigin: '0 50%',
              transform: `rotate(${angle}deg)`,
              zIndex: 10,
            }}
            onClick={() => onPassClick(option)}
            title={`Click to see calculation details - Pass to ${option.targetPlayer.name} - Score: ${option.score.toFixed(1)}`}
          >
            <div 
              className="absolute right-0 top-1/2 transform -translate-y-1/2"
              style={{
                width: 0,
                height: 0,
                borderLeft: `12px solid ${color}`, // Made bigger
                borderTop: '6px solid transparent', // Made bigger
                borderBottom: '6px solid transparent', // Made bigger
              }}
            />
            <div 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-bold text-white bg-black bg-opacity-75 px-2 py-1 rounded" // Made bigger
            >
              {option.score.toFixed(1)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SimpleField;
