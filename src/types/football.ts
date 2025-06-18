
export interface Player {
  id: string;
  name: string;
  position: string;
  x: number;
  y: number;
  team: 'home' | 'away';
  playingStyle: string;
  aiStyle: string;
  passingAccuracy: number;
}

export interface PassOption {
  targetPlayer: Player;
  score: number;
  distance: number;
  opponentDensity: number;
  tacticalAlignment: number;
  styleMatch: number;
  aiPreference: number;
}

export interface Formation {
  name: string;
  positions: Array<{
    position: string;
    x: number;
    y: number;
  }>;
}

export interface SimulationState {
  phase: 'setup' | 'playing' | 'pressure' | 'finished';
  players: Player[];
  ballHolder: Player | null;
  passOptions: PassOption[];
  pressureOpponents: Player[];
}
