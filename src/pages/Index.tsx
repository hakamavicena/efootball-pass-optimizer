
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import SimpleField from '@/components/SimpleField';
import PassCalculationPanel from '@/components/PassCalculationPanel';
import FinishedPhasePanel from '@/components/FinishedPhasePanel';
import { SimulationState, PassOption } from '@/types/football';
import { FORMATIONS } from '@/utils/formations';
import { 
  createTeams, 
  calculatePassOptions, 
  findNearestOpponents, 
  moveOpponentsTowardsBall 
} from '@/utils/simpleSimulation';

const TACTICS = [
  'Possession Game',
  'Quick Counter', 
  'Long Ball Counter',
  'Out Wide',
  'Long Ball'
];

const Index = () => {
  const [formation, setFormation] = useState('4-3-3');
  const [tactic, setTactic] = useState('Possession Game');
  const [simulation, setSimulation] = useState<SimulationState>({
    phase: 'setup',
    players: [],
    ballHolder: null,
    passOptions: [],
    pressureOpponents: []
  });
  const [selectedPass, setSelectedPass] = useState<PassOption | null>(null);
  const [executedPass, setExecutedPass] = useState<PassOption | null>(null);
  const [previousBallHolder, setPreviousBallHolder] = useState<any>(null);

  const startSimulation = () => {
    console.log('Starting simulation with formation:', formation, 'and tactic:', tactic);
    const players = createTeams(formation);
    console.log('Created players:', players.length);
    
    // Pick a random home team player (not goalkeeper)
    const homeFieldPlayers = players.filter(p => p.team === 'home' && p.position !== 'GK');
    const randomPlayer = homeFieldPlayers[Math.floor(Math.random() * homeFieldPlayers.length)];
    
    console.log('Selected ball holder:', randomPlayer.name);
    
    setSimulation({
      phase: 'playing',
      players,
      ballHolder: randomPlayer,
      passOptions: [],
      pressureOpponents: []
    });
    setExecutedPass(null);
    setPreviousBallHolder(null);
  };

  const stepSimulation = () => {
    if (simulation.phase === 'pressure' && simulation.passOptions.length > 0) {
      // Find the pass with lowest score (best option)
      const bestPass = simulation.passOptions.reduce((best, current) => 
        current.score < best.score ? current : best
      );
      
      console.log(`Ball passed from ${simulation.ballHolder?.name} to ${bestPass.targetPlayer.name}`);
      console.log(`Pass score: ${bestPass.score.toFixed(2)}`);
      
      // Store the executed pass and previous ball holder for the finished panel
      setExecutedPass(bestPass);
      setPreviousBallHolder(simulation.ballHolder);
      
      setSimulation(prev => ({
        ...prev,
        phase: 'finished',
        ballHolder: bestPass.targetPlayer,
        passOptions: [],
        pressureOpponents: []
      }));
    }
  };

  const resetSimulation = () => {
    setSimulation({
      phase: 'setup',
      players: [],
      ballHolder: null,
      passOptions: [],
      pressureOpponents: []
    });
    setSelectedPass(null);
    setExecutedPass(null);
    setPreviousBallHolder(null);
  };

  const handlePassClick = (passOption: PassOption) => {
    setSelectedPass(passOption);
  };

  // Handle opponent pressure and ensure ball is always passed
  useEffect(() => {
    if (simulation.phase === 'playing' && simulation.ballHolder) {
      console.log('Starting pressure sequence...');
      
      const timer = setTimeout(() => {
        console.log('Pressure timer triggered');
        const opponents = simulation.players.filter(p => p.team !== simulation.ballHolder!.team);
        const nearestOpponents = findNearestOpponents(simulation.ballHolder!, opponents);
        
        console.log('Found nearest opponents:', nearestOpponents.map(o => o.name));
        
        const interval = setInterval(() => {
          setSimulation(prev => {
            if (prev.phase !== 'playing') {
              clearInterval(interval);
              return prev;
            }

            const ballHolder = prev.ballHolder!;
            const updatedOpponents = moveOpponentsTowardsBall(ballHolder, nearestOpponents);
            const updatedPlayers = prev.players.map(player => {
              const updatedOpp = updatedOpponents.find(opp => opp.id === player.id);
              return updatedOpp || player;
            });

            const closestDistance = Math.min(
              ...updatedOpponents.map(opp => {
                const dx = ballHolder.x - opp.x;
                const dy = ballHolder.y - opp.y;
                return Math.sqrt(dx * dx + dy * dy);
              })
            );

            console.log('Closest opponent distance:', closestDistance);

            // Always trigger pressure after opponents have moved enough (increased threshold to ensure pass)
            if (closestDistance <= 12) {
              clearInterval(interval);
              console.log('Pressure triggered! Calculating pass options...');
              
              const teammates = updatedPlayers.filter(p => 
                p.team === ballHolder.team && p.id !== ballHolder.id
              );
              const allOpponents = updatedPlayers.filter(p => p.team !== ballHolder.team);
              const passOptions = calculatePassOptions(ballHolder, teammates, allOpponents, tactic);
              
              console.log('Pass options calculated:', passOptions.length);
              
              return {
                ...prev,
                phase: 'pressure',
                players: updatedPlayers,
                passOptions,
                pressureOpponents: updatedOpponents
              };
            }

            return {
              ...prev,
              players: updatedPlayers
            };
          });
        }, 150); // Slightly faster movement for better gameplay
      }, 1500); // Reduced timer for quicker pressure

      return () => clearTimeout(timer);
    }
  }, [simulation.phase, simulation.ballHolder, tactic]);

  return (
    <div className="min-h-screen bg-green-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Simple eFootball Pass Simulation</h1>
        
        <div className="flex gap-4 justify-center mb-4">
          <Select value={formation} onValueChange={setFormation} disabled={simulation.phase !== 'setup'}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(FORMATIONS).map(form => (
                <SelectItem key={form} value={form}>{form}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={tactic} onValueChange={setTactic} disabled={simulation.phase !== 'setup'}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TACTICS.map(tacticOption => (
                <SelectItem key={tacticOption} value={tacticOption}>{tacticOption}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={startSimulation} 
            disabled={simulation.phase !== 'setup'}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Start
          </Button>
          
          <Button 
            onClick={stepSimulation} 
            disabled={simulation.phase !== 'pressure'}
            className="bg-green-500 hover:bg-green-600"
          >
            Step (Pass Ball)
          </Button>
          
          <Button 
            onClick={resetSimulation}
            variant="outline"
          >
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <SimpleField 
              simulation={simulation}
              onPassClick={handlePassClick}
            />
          </div>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold mb-2">Status</h3>
              <p>Formation: {formation}</p>
              <p>Tactic: {tactic}</p>
              <p>Phase: {simulation.phase}</p>
              {simulation.ballHolder && (
                <p>Ball: {simulation.ballHolder.name} ({simulation.ballHolder.position})</p>
              )}
              {simulation.passOptions.length > 0 && (
                <p>Pass Options: {simulation.passOptions.length}</p>
              )}
            </div>
            
            {selectedPass && simulation.phase === 'pressure' && (
              <PassCalculationPanel 
                passOption={selectedPass} 
                ballHolder={simulation.ballHolder ? {
                  name: simulation.ballHolder.name,
                  position: simulation.ballHolder.position,
                  playingStyle: simulation.ballHolder.playingStyle,
                  aiStyle: simulation.ballHolder.aiStyle
                } : null}
              />
            )}
            
            {executedPass && previousBallHolder && simulation.phase === 'finished' && (
              <FinishedPhasePanel 
                ballHolder={previousBallHolder}
                executedPass={executedPass}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
