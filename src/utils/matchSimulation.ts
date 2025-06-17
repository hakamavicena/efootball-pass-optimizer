
import { Player, PassOption, MatchState, MatchResult } from '@/types/football';

const FORMATION_433 = {
  home: [
    { position: 'GK', x: 10, y: 50 },
    { position: 'RB', x: 25, y: 20 }, { position: 'CB', x: 25, y: 35 }, 
    { position: 'CB', x: 25, y: 65 }, { position: 'LB', x: 25, y: 80 },
    { position: 'CMF', x: 40, y: 35 }, { position: 'CMF', x: 40, y: 50 }, { position: 'CMF', x: 40, y: 65 },
    { position: 'RWF', x: 60, y: 20 }, { position: 'CF', x: 60, y: 50 }, { position: 'LWF', x: 60, y: 80 }
  ],
  away: [
    { position: 'GK', x: 90, y: 50 },
    { position: 'LB', x: 75, y: 80 }, { position: 'CB', x: 75, y: 65 }, 
    { position: 'CB', x: 75, y: 35 }, { position: 'RB', x: 75, y: 20 },
    { position: 'CMF', x: 60, y: 65 }, { position: 'CMF', x: 60, y: 50 }, { position: 'CMF', x: 60, y: 35 },
    { position: 'LWF', x: 40, y: 80 }, { position: 'CF', x: 40, y: 50 }, { position: 'RWF', x: 40, y: 20 }
  ]
};

const PLAYING_STYLES = [
  'Goal Poacher', 'Target Man', 'Creative Playmaker', 'Classic No. 10', 'Cross Specialist',
  'Box-To-Box', 'Anchor Man', 'Orchestrator', 'Build Up', 'Attacking Full Back'
];

const AI_STYLES = [
  'Trickster', 'Long Ball Expert', 'Early Crosser', 'Speeding Bullet', 'Incisive Run'
];

export const generatePlayers = (): Player[] => {
  const players: Player[] = [];
  let playerId = 1;

  // Generate home team
  FORMATION_433.home.forEach((pos, index) => {
    const playingStyle = PLAYING_STYLES[index % PLAYING_STYLES.length];
    const aiStyle = AI_STYLES[index % AI_STYLES.length];
    
    players.push({
      id: `home_${playerId}`,
      name: `Player ${playerId}`,
      position: pos.position,
      x: pos.x,
      y: pos.y,
      team: 'home',
      playingStyle,
      aiStyle,
      passingAccuracy: getPassingAccuracy(playingStyle, aiStyle)
    });
    playerId++;
  });

  // Generate away team
  FORMATION_433.away.forEach((pos, index) => {
    players.push({
      id: `away_${playerId}`,
      name: `Player ${playerId}`,
      position: pos.position,
      x: pos.x,
      y: pos.y,
      team: 'away',
      playingStyle: 'Standard',
      aiStyle: 'Standard',
      passingAccuracy: 70
    });
    playerId++;
  });

  return players;
};

const getPassingAccuracy = (playingStyle: string, aiStyle: string): number => {
  let accuracy = 70; // base accuracy

  // Playing style boosts
  if (['Creative Playmaker', 'Classic No. 10', 'Cross Specialist', 'Orchestrator', 'Build Up'].includes(playingStyle)) {
    accuracy += 15;
  }

  // AI style boosts
  if (['Long Ball Expert', 'Early Crosser'].includes(aiStyle)) {
    accuracy += 10;
  }

  return accuracy;
};

export const simulateMatch = (currentState: MatchState): MatchResult => {
  const { players, ballHolder } = currentState;
  
  // Calculate pass options
  const teammates = players.filter(p => p.team === ballHolder.team && p.id !== ballHolder.id);
  const opponents = players.filter(p => p.team !== ballHolder.team);
  
  const passOptions: PassOption[] = teammates.map(teammate => {
    const distance = calculateDistance(ballHolder, teammate);
    const opponentDensity = calculateOpponentDensity(teammate, opponents);
    const tacticalAlignment = calculateTacticalAlignment(ballHolder, teammate);
    const styleMatch = calculateStyleMatch(ballHolder, teammate);
    const aiPreference = calculateAiPreference(ballHolder, teammate);
    
    // Scorepass formula: w1⋅Dij + w2⋅Oj + w3⋅Tij + w4⋅Pi + w5⋅Ai
    const score = 0.2 * (100 - distance) + 0.2 * (100 - opponentDensity) + 
                  0.2 * tacticalAlignment + 0.2 * styleMatch + 0.2 * aiPreference;
    
    return {
      targetPlayer: teammate,
      score,
      distance,
      opponentDensity,
      tacticalAlignment,
      styleMatch,
      aiPreference
    };
  });

  // Sort by score and pick best pass
  passOptions.sort((a, b) => b.score - a.score);
  const bestPass = passOptions[0];
  
  // Check if goal is scored (if pass reaches CF near goal)
  const goalScored = bestPass && bestPass.targetPlayer.position === 'CF' && bestPass.targetPlayer.x > 80;
  
  if (goalScored) {
    return { goalScored: true, newState: currentState };
  }

  // Execute pass - update ball holder and move players slightly
  const newPlayers = players.map(player => {
    if (player.id === bestPass.targetPlayer.id) {
      return { ...player }; // New ball holder
    }
    // Simple movement simulation
    return {
      ...player,
      x: Math.max(5, Math.min(95, player.x + (Math.random() - 0.5) * 3)),
      y: Math.max(5, Math.min(95, player.y + (Math.random() - 0.5) * 3))
    };
  });

  const newState: MatchState = {
    players: newPlayers,
    ballHolder: newPlayers.find(p => p.id === bestPass.targetPlayer.id)!,
    passOptions,
    currentPass: currentState.currentPass + 1
  };

  return { goalScored: false, newState };
};

const calculateDistance = (player1: Player, player2: Player): number => {
  const dx = player1.x - player2.x;
  const dy = player1.y - player2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const calculateOpponentDensity = (player: Player, opponents: Player[]): number => {
  const nearbyOpponents = opponents.filter(opp => calculateDistance(player, opp) < 15);
  return nearbyOpponents.length * 20; // 0-100 scale
};

const calculateTacticalAlignment = (ballHolder: Player, target: Player): number => {
  // Possession game favors safe, forward passes
  const forwardProgress = target.x > ballHolder.x ? 20 : 0;
  const safeDistance = calculateDistance(ballHolder, target) < 30 ? 30 : 10;
  return Math.min(100, forwardProgress + safeDistance + 20);
};

const calculateStyleMatch = (ballHolder: Player, target: Player): number => {
  const boost = target.passingAccuracy > 80 ? 20 : 0;
  return Math.min(100, 50 + boost + Math.random() * 20);
};

const calculateAiPreference = (ballHolder: Player, target: Player): number => {
  const distance = calculateDistance(ballHolder, target);
  
  if (ballHolder.aiStyle === 'Long Ball Expert' && distance > 40) {
    return 80;
  }
  if (ballHolder.aiStyle === 'Early Crosser' && target.position.includes('WF')) {
    return 80;
  }
  
  return 50 + Math.random() * 30;
};
