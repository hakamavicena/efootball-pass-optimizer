
import React from 'react';
import { Player, MatchState } from '@/types/football';

interface FootballFieldProps {
  matchState: MatchState | null;
}

const FootballField: React.FC<FootballFieldProps> = ({ matchState }) => {
  if (!matchState) {
    return (
      <div className="w-full h-96 bg-green-400 border-2 border-white rounded flex items-center justify-center">
        <p className="text-white text-xl">Click Start Simulation to begin</p>
      </div>
    );
  }

  const { players, ballHolder, passOptions } = matchState;

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
      {players.map((player) => (
        <div
          key={player.id}
          className={`absolute w-6 h-6 rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-xs font-bold
            ${player.team === 'home' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'}
            ${player.id === ballHolder.id ? 'ring-4 ring-yellow-400' : ''}
          `}
          style={{
            left: `${player.x}%`,
            top: `${player.y}%`,
          }}
          title={`${player.name} (${player.position})`}
        >
          {player.position.slice(0, 2)}
        </div>
      ))}

      {/* Pass options arrows */}
      {passOptions.map((option, index) => {
        const dx = option.targetPlayer.x - ballHolder.x;
        const dy = option.targetPlayer.y - ballHolder.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        const opacity = Math.min(option.score / 100, 1);
        const thickness = Math.max(2, option.score / 20);

        return (
          <div
            key={index}
            className="absolute"
            style={{
              left: `${ballHolder.x}%`,
              top: `${ballHolder.y}%`,
              width: `${length}%`,
              height: `${thickness}px`,
              background: `rgba(255, 255, 0, ${opacity})`,
              transformOrigin: '0 50%',
              transform: `rotate(${angle}deg)`,
              pointerEvents: 'none',
            }}
          >
            <div 
              className="absolute right-0 top-1/2 transform -translate-y-1/2"
              style={{
                width: 0,
                height: 0,
                borderLeft: '8px solid rgba(255, 255, 0, 0.8)',
                borderTop: '4px solid transparent',
                borderBottom: '4px solid transparent',
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default FootballField;
