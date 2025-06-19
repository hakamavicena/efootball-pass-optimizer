
import { Player, PassOption, SimulationState } from '@/types/football';
import { FORMATIONS, getAwayFormation } from './formations';

const ROLE_PLAYING_STYLES = {
  // Attacking Roles
  'CF': ['Goal Poacher', 'Dummy Runner', 'Target Man', 'Deep Lying Forward'],
  'SS': ['Dummy Runner', 'Deep Lying Forward', 'Creative Playmaker', 'Classic No. 10', 'Hole Player'],
  'AMF': ['Dummy Runner', 'Creative Playmaker', 'Classic No. 10', 'Hole Player'],
  
  // Wide Roles
  'RWF': ['Creative Playmaker', 'Prolific Winger', 'Roaming Flank', 'Cross Specialist'],
  'LWF': ['Creative Playmaker', 'Prolific Winger', 'Roaming Flank', 'Cross Specialist'],
  'RMF': ['Creative Playmaker', 'Hole Player', 'Roaming Flank', 'Cross Specialist', 'Box-To-Box'],
  'LMF': ['Creative Playmaker', 'Hole Player', 'Roaming Flank', 'Cross Specialist', 'Box-To-Box'],
  'RM': ['Creative Playmaker', 'Hole Player', 'Roaming Flank', 'Cross Specialist', 'Box-To-Box'],
  'LM': ['Creative Playmaker', 'Hole Player', 'Roaming Flank', 'Cross Specialist', 'Box-To-Box'],
  
  // Midfield Roles
  'CMF': ['Hole Player', 'Box-To-Box', 'The Destroyer', 'Orchestrator'],
  'DMF': ['Box-To-Box', 'Anchor Man', 'The Destroyer', 'Orchestrator'],
  
  // Defensive Roles
  'CB': ['The Destroyer', 'Build Up', 'Extra Frontman'],
  'RB': ['Attacking Full Back', 'Defensive Full Back', 'Full Back Finisher'],
  'LB': ['Attacking Full Back', 'Defensive Full Back', 'Full Back Finisher'],
  
  // Goalkeeper Roles
  'GK': ['Attacking Goalkeeper', 'Defensive Goalkeeper']
};

const AI_STYLES = [
  'Trickster', 'Long Ball Expert', 'Early Crosser', 'Speeding Bullet', 'Incisive Run', 'Mazing Run', 'Long Ranger'
];

const getPlayingStyleForPosition = (position: string): string => {
  const styles = ROLE_PLAYING_STYLES[position];
  if (!styles || styles.length === 0) {
    return 'Standard';
  }
  return styles[Math.floor(Math.random() * styles.length)];
};

export const createTeams = (formationName: string): Player[] => {
  const homeFormation = FORMATIONS[formationName];
  const awayFormation = getAwayFormation(homeFormation);
  const players: Player[] = [];
  let playerId = 1;

  // Create home team
  homeFormation.positions.forEach((pos, index) => {
    const playingStyle = getPlayingStyleForPosition(pos.position);
    const aiStyle = AI_STYLES[index % AI_STYLES.length];
    
    players.push({
      id: `home_${playerId}`,
      name: `H${playerId}`,
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

  // Create away team
  awayFormation.positions.forEach((pos, index) => {
    const playingStyle = getPlayingStyleForPosition(pos.position);
    const aiStyle = AI_STYLES[index % AI_STYLES.length];
    
    players.push({
      id: `away_${playerId}`,
      name: `A${playerId}`,
      position: pos.position,
      x: pos.x,
      y: pos.y,
      team: 'away',
      playingStyle,
      aiStyle,
      passingAccuracy: getPassingAccuracy(playingStyle, aiStyle)
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
  if (['Long Ball Expert', 'Early Crosser', 'Long Ranger'].includes(aiStyle)) {
    accuracy += 10;
  }

  return accuracy;
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

const calculateTacticalAlignment = (ballHolder: Player, target: Player, tactic: string): number => {
  const forwardProgress = target.x > ballHolder.x ? 20 : 0;
  const distance = calculateDistance(ballHolder, target);
  
  switch (tactic) {
    case 'Possession Game':
      return Math.min(100, forwardProgress + (distance < 30 ? 30 : 10) + 20);
    case 'Quick Counter':
      return Math.min(100, forwardProgress * 2 + (distance > 40 ? 20 : 0) + 10);
    case 'Long Ball Counter':
      return Math.min(100, forwardProgress + (distance > 50 ? 40 : 0) + 10);
    case 'Out Wide':
      const isWidePosition = target.position.includes('WF') || target.position.includes('MF');
      return Math.min(100, forwardProgress + (isWidePosition ? 30 : 0) + 20);
    case 'Long Ball':
      return Math.min(100, forwardProgress + (distance > 60 ? 50 : 0) + 10);
    default:
      return Math.min(100, forwardProgress + (distance < 30 ? 30 : 10) + 20);
  }
};

const calculatePlayerStyleMatch = (ballHolder: Player, target: Player, tactic: string): number => {
  let boost = 50; // base score
  
  // Playing style boosts for target player
  if (['Creative Playmaker', 'Classic No. 10', 'Orchestrator'].includes(target.playingStyle)) {
    boost += 20;
  }
  if (['Prolific Winger', 'Cross Specialist'].includes(target.playingStyle) && tactic === 'Out Wide') {
    boost += 15;
  }
  if (['Deep Lying Forward', 'Target Man'].includes(target.playingStyle) && tactic === 'Long Ball') {
    boost += 15;
  }
  if (['Box-To-Box', 'Hole Player'].includes(target.playingStyle) && tactic === 'Possession Game') {
    boost += 15;
  }
  
  return Math.min(100, boost + Math.random() * 20);
};

const calculateAiPreference = (ballHolder: Player, target: Player, tactic: string): number => {
  const distance = calculateDistance(ballHolder, target);
  
  // AI style preferences for ball holder
  if (ballHolder.aiStyle === 'Long Ball Expert' && distance > 40) {
    return 80;
  }
  if (ballHolder.aiStyle === 'Early Crosser' && target.position.includes('WF')) {
    return 80;
  }
  if (ballHolder.aiStyle === 'Mazing Run' && distance < 20) {
    return 80;
  }
  if (ballHolder.aiStyle === 'Long Ranger' && distance > 50) {
    return 80;
  }
  
  // Tactic-based preferences
  if (tactic === 'Long Ball' && distance > 50) {
    return 75;
  }
  if (tactic === 'Possession Game' && distance < 25) {
    return 75;
  }
  
  return 50 + Math.random() * 30;
};

export const calculatePassOptions = (ballHolder: Player, teammates: Player[], opponents: Player[], tactic: string = 'Possession Game'): PassOption[] => {
  console.log('Calculating pass options for:', ballHolder.name, 'with tactic:', tactic);
  console.log('Number of teammates:', teammates.length);
  
  const passOptions = teammates.map(teammate => {
    // Formula: w1⋅Dij + w2⋅Oj + w3⋅(100-Tij) + w4⋅(100-Pi) + w5⋅(100-Ai)
    const w1 = 0.2, w2 = 0.2, w3 = 0.2, w4 = 0.2, w5 = 0.2;
    
    const distance = calculateDistance(ballHolder, teammate); // Dij
    const opponentDensity = calculateOpponentDensity(teammate, opponents); // Oj
    const tacticalAlignment = calculateTacticalAlignment(ballHolder, teammate, tactic); // Tij
    const playerStyleMatch = calculatePlayerStyleMatch(ballHolder, teammate, tactic); // Pi
    const aiPreference = calculateAiPreference(ballHolder, teammate, tactic); // Ai
    
    // Apply the correct formula: lower score = better pass
    const score = w1 * distance + w2 * opponentDensity + 
                  w3 * (100 - tacticalAlignment) + w4 * (100 - playerStyleMatch) + w5 * (100 - aiPreference);
    
    console.log(`Pass to ${teammate.name}: score=${score.toFixed(2)}`);
    
    return {
      targetPlayer: teammate,
      score,
      distance,
      opponentDensity,
      tacticalAlignment,
      styleMatch: playerStyleMatch,
      aiPreference
    };
  });
  
  console.log('Total pass options calculated:', passOptions.length);
  return passOptions;
};

export const findNearestOpponents = (ballHolder: Player, opponents: Player[]): Player[] => {
  const distances = opponents.map(opp => ({
    player: opp,
    distance: calculateDistance(ballHolder, opp)
  }));
  
  distances.sort((a, b) => a.distance - b.distance);
  return distances.slice(0, 2).map(d => d.player);
};

export const moveOpponentsTowardsBall = (ballHolder: Player, opponents: Player[]): Player[] => {
  return opponents.map(opp => {
    const dx = ballHolder.x - opp.x;
    const dy = ballHolder.y - opp.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 5) {
      const moveSpeed = 3;
      const moveX = (dx / distance) * moveSpeed;
      const moveY = (dy / distance) * moveSpeed;
      
      return {
        ...opp,
        x: Math.max(5, Math.min(95, opp.x + moveX)),
        y: Math.max(5, Math.min(95, opp.y + moveY))
      };
    }
    
    return opp;
  });
};
