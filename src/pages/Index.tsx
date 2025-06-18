
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import SimpleField from '@/components/SimpleField';
import PassCalculationPanel from '@/components/PassCalculationPanel';
import { SimulationState, PassOption } from '@/types/football';
import { FORMATIONS } from '@/utils/formations';
import { 
  createTeams, 
  calculatePassOptions, 
  findNearestOpponents, 
  moveOpponentsTowardsBall 
} from '@/utils/simpleSimulation';

const Index = () => {
  const [formation, setFormation] = useState('4-3-3');
  const [simulation, setSimulation] = useState<SimulationState>({
    phase: 'setup',
    players: [],
    ballHolder: null,
    passOptions: [],
    pressureOpponents: []
  });
  const [hoveredPass, setHoveredPass] = useState<PassOption | null>(null);

  const startSimulation = () => {
    const players = createTeams(formation);
    const randomPlayer = players[Math.floor(Math.random() * players.length)];
    
    setSimulation({
      phase: 'playing',
      players,
      ballHolder: randomPlayer,
      passOptions: [],
      pressureOpponents: []
    });
  };

  const stepSimulation = () => {
    if (simulation.phase === 'pressure' && simulation.passOptions.length > 0) {
      // Find the pass with lowest score (best option)
      const bestPass = simulation.passOptions.reduce((best, current) => 
        current.score < best.score ? current : best
      );
      
      console.log(`Ball passed from ${simulation.ballHolder?.name} to ${bestPass.targetPlayer.name}`);
      console.log(`Pass score: ${bestPass.score.toFixed(2)}`);
      
      setSimulation(prev => ({
        ...prev,
        phase: 'finished',
        ballHolder: bestPass.targetPlayer
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
    setHoveredPass(null);
  };

  // Handle opponent pressure after 3 seconds
  useEffect(() => {
    if (simulation.phase === 'playing' && simulation.ballHolder) {
      const timer = setTimeout(() => {
        const opponents = simulation.players.filter(p => p.team !== simulation.ballHolder!.team);
        const nearestOpponents = findNearestOpponents(simulation.ballHolder!, opponents);
        
        // Start moving opponents toward ball holder
        const interval = setInterval(() => {
          setSimulation(prev => {
            if (prev.phase !== 'playing') {
              clearInterval(interval);
              return prev;
            }

            const updatedOpponents = moveOpponentsTowardsBall(prev.ballHolder!, nearestOpponents);
            const updatedPlayers = prev.players.map(player => {
              const updatedOpp = updatedOpponents.find(opp => opp.id === player.id);
              return updatedOpp || player;
            });

            // Check if opponents are close enough (1 meter = ~3 units on our scale)
            const ballHolder = prev.ballHolder!;
            const closestDistance = Math.min(
              ...updatedOpponents.map(opp => {
                const dx = ballHolder.x - opp.x;
                const dy = ballHolder.y - opp.y;
                return Math.sqrt(dx * dx + dy * dy);
              })
            );

            if (closestDistance <= 3) {
              clearInterval(interval);
              
              // Calculate pass options
              const teammates = updatedPlayers.filter(p => 
                p.team === ballHolder.team && p.id !== ballHolder.id
              );
              const allOpponents = updatedPlayers.filter(p => p.team !== ballHolder.team);
              const passOptions = calculatePassOptions(ballHolder, teammates, allOpponents);
              
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
        }, 100);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [simulation.phase, simulation.ballHolder]);

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
              onPassHover={setHoveredPass}
              onPassLeave={() => setHoveredPass(null)}
            />
          </div>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold mb-2">Status</h3>
              <p>Formation: {formation}</p>
              <p>Phase: {simulation.phase}</p>
              {simulation.ballHolder && (
                <p>Ball: {simulation.ballHolder.name} ({simulation.ballHolder.position})</p>
              )}
            </div>
            
            {hoveredPass && (
              <PassCalculationPanel passOption={hoveredPass} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
