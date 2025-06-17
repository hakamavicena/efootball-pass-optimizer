
import React, { useState, useEffect } from 'react';
import FootballField from '@/components/FootballField';
import PassScoreDisplay from '@/components/PassScoreDisplay';
import { generatePlayers, simulateMatch } from '@/utils/matchSimulation';
import { Player, MatchState } from '@/types/football';

const Index = () => {
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [passCount, setPassCount] = useState(0);
  const [goalScored, setGoalScored] = useState(false);

  const startSimulation = () => {
    const players = generatePlayers();
    const initialState: MatchState = {
      players,
      ballHolder: players.find(p => p.team === 'home' && p.position === 'CMF')!,
      passOptions: [],
      currentPass: 0
    };
    setMatchState(initialState);
    setIsRunning(true);
    setPassCount(0);
    setGoalScored(false);
  };

  const resetSimulation = () => {
    setMatchState(null);
    setIsRunning(false);
    setPassCount(0);
    setGoalScored(false);
  };

  useEffect(() => {
    if (!isRunning || !matchState || goalScored) return;

    const interval = setInterval(() => {
      const result = simulateMatch(matchState);
      
      if (result.goalScored) {
        setGoalScored(true);
        setIsRunning(false);
        console.log(`Goal scored after ${passCount} passes!`);
      } else {
        setMatchState(result.newState);
        setPassCount(prev => prev + 1);
      }
    }, 2000); // 2 second intervals

    return () => clearInterval(interval);
  }, [isRunning, matchState, passCount, goalScored]);

  return (
    <div className="min-h-screen bg-green-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">eFootball Pass Optimizer</h1>
        
        <div className="flex gap-4 justify-center mb-4">
          <button 
            onClick={startSimulation}
            disabled={isRunning}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Start Simulation
          </button>
          <button 
            onClick={resetSimulation}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <FootballField matchState={matchState} />
          </div>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold mb-2">Match Info</h3>
              <p>Formation: 4-3-3</p>
              <p>Tactics: Possession Game</p>
              <p>Passes: {passCount}</p>
              <p>Status: {goalScored ? '⚽ GOAL!' : isRunning ? '🟢 Running' : '⚪ Stopped'}</p>
            </div>
            
            {matchState && (
              <PassScoreDisplay 
                ballHolder={matchState.ballHolder}
                passOptions={matchState.passOptions}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
