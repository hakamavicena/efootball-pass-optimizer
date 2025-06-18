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
  const [selectedPass, setSelectedPass] = useState<PassOption | null>(null);

  const startSimulation = () => {
    console.log('Starting simulation with formation:', formation);
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
  };

  const handlePassClick = (passOption: PassOption) => {
    setSelectedPass(passOption);
  };

  // Handle opponent pressure after 2 seconds
  useEffect(() => {
    if (simulation.phase === 'playing' && simulation.ballHolder) {
      console.log('Starting pressure sequence...');
      
      const timer = setTimeout(() => {
        console.log('Pressure timer triggered');
        const opponents = simulation.players.filter(p => p.team !== simulation.ballHolder!.team);
        const nearestOpponents = findNearestOpponents(simulation.ballHolder!, opponents);
        
        console.log('Found nearest opponents:', nearestOpponents.map(o => o.name));
        
        // Start moving opponents toward ball holder
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

            // Check if opponents are close enough (5 units = pressure trigger)
            const closestDistance = Math.min(
              ...updatedOpponents.map(opp => {
                const dx = ballHolder.x - opp.x;
                const dy = ballHolder.y - opp.y;
                return Math.sqrt(dx * dx + dy * dy);
              })
            );

            console.log('Closest opponent distance:', closestDistance);

            if (closestDistance <= 8) { // Increased threshold for easier triggering
              clearInterval(interval);
              console.log('Pressure triggered! Calculating pass options...');
              
              // Calculate pass options
              const teammates = updatedPlayers.filter(p => 
                p.team === ballHolder.team && p.id !== ballHolder.id
              );
              const allOpponents = updatedPlayers.filter(p => p.team !== ballHolder.team);
              const passOptions = calculatePassOptions(ballHolder, teammates, allOpponents);
              
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
        }, 200); // Slower movement for better visualization
      }, 2000); // Reduced from 3000 to 2000

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
              onPassClick={handlePassClick}
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
              {simulation.passOptions.length > 0 && (
                <p>Pass Options: {simulation.passOptions.length}</p>
              )}
            </div>
            
            {selectedPass && (
              <PassCalculationPanel passOption={selectedPass} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
