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
  'Trickster', 'Long Ball Expert', 'Early Crosser', 'Speeding Bullet', 'Incisive Run'
];

const getPlayingStyleForPosition = (position: string): string => {
  const styles = ROLE_PLAYING_STYLES[position];
  if (!styles || styles.length === 0) {
    return 'Standard'; // fallback
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
  if (['Long Ball Expert', 'Early Crosser'].includes(aiStyle)) {
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

export const calculatePassOptions = (ballHolder: Player, teammates: Player[], opponents: Player[]): PassOption[] => {
  console.log('Calculating pass options for:', ballHolder.name);
  console.log('Number of teammates:', teammates.length);
  
  const passOptions = teammates.map(teammate => {
    const distance = calculateDistance(ballHolder, teammate);
    const opponentDensity = calculateOpponentDensity(teammate, opponents);
    const tacticalAlignment = calculateTacticalAlignment(ballHolder, teammate);
    const styleMatch = calculateStyleMatch(ballHolder, teammate);
    const aiPreference = calculateAiPreference(ballHolder, teammate);
    
    // Fixed formula: Lower score = better pass
    const score = 0.2 * distance + 0.2 * opponentDensity + 
                  0.2 * (100 - tacticalAlignment) + 0.2 * (100 - styleMatch) + 0.2 * (100 - aiPreference);
    
    console.log(`Pass to ${teammate.name}: score=${score.toFixed(2)}`);
    
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
    
    if (distance > 5) { // Changed from 1 to 5 for easier testing
      const moveSpeed = 3; // Increased speed
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
