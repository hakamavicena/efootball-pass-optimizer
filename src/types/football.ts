
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

export interface MatchState {
  players: Player[];
  ballHolder: Player;
  passOptions: PassOption[];
  currentPass: number;
}

export interface MatchResult {
  goalScored: boolean;
  newState: MatchState;
}
