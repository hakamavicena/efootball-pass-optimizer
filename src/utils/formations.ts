
import { Formation } from '@/types/football';

export const FORMATIONS: Record<string, Formation> = {
  '4-3-3': {
    name: '4-3-3',
    positions: [
      { position: 'GK', x: 10, y: 50 },
      { position: 'RB', x: 25, y: 20 }, { position: 'CB', x: 25, y: 35 }, 
      { position: 'CB', x: 25, y: 65 }, { position: 'LB', x: 25, y: 80 },
      { position: 'CMF', x: 40, y: 35 }, { position: 'CMF', x: 40, y: 50 }, { position: 'CMF', x: 40, y: 65 },
      { position: 'RWF', x: 60, y: 20 }, { position: 'CF', x: 60, y: 50 }, { position: 'LWF', x: 60, y: 80 }
    ]
  },
  '4-4-2': {
    name: '4-4-2',
    positions: [
      { position: 'GK', x: 10, y: 50 },
      { position: 'RB', x: 25, y: 15 }, { position: 'CB', x: 25, y: 35 }, 
      { position: 'CB', x: 25, y: 65 }, { position: 'LB', x: 25, y: 85 },
      { position: 'RM', x: 45, y: 15 }, { position: 'CMF', x: 45, y: 40 }, 
      { position: 'CMF', x: 45, y: 60 }, { position: 'LM', x: 45, y: 85 },
      { position: 'CF', x: 65, y: 35 }, { position: 'CF', x: 65, y: 65 }
    ]
  },
  '4-3-2-1': {
    name: '4-3-2-1',
    positions: [
      { position: 'GK', x: 10, y: 50 },
      { position: 'RB', x: 25, y: 20 }, { position: 'CB', x: 25, y: 38 }, 
      { position: 'CB', x: 25, y: 62 }, { position: 'LB', x: 25, y: 80 },
      { position: 'CMF', x: 40, y: 35 }, { position: 'CMF', x: 40, y: 50 }, { position: 'CMF', x: 40, y: 65 },
      { position: 'AMF', x: 55, y: 38 }, { position: 'AMF', x: 55, y: 62 },
      { position: 'CF', x: 70, y: 50 }
    ]
  },
  '4-3-1-2': {
    name: '4-3-1-2',
    positions: [
      { position: 'GK', x: 10, y: 50 },
      { position: 'RB', x: 25, y: 20 }, { position: 'CB', x: 25, y: 38 }, 
      { position: 'CB', x: 25, y: 62 }, { position: 'LB', x: 25, y: 80 },
      { position: 'CMF', x: 40, y: 35 }, { position: 'CMF', x: 40, y: 50 }, { position: 'CMF', x: 40, y: 65 },
      { position: 'AMF', x: 55, y: 50 },
      { position: 'CF', x: 70, y: 38 }, { position: 'CF', x: 70, y: 62 }
    ]
  },
  '4-2-3-1': {
    name: '4-2-3-1',
    positions: [
      { position: 'GK', x: 10, y: 50 },
      { position: 'RB', x: 25, y: 18 }, { position: 'CB', x: 25, y: 38 }, 
      { position: 'CB', x: 25, y: 62 }, { position: 'LB', x: 25, y: 82 },
      { position: 'DMF', x: 38, y: 40 }, { position: 'DMF', x: 38, y: 60 },
      { position: 'RWF', x: 55, y: 25 }, { position: 'AMF', x: 55, y: 50 }, { position: 'LWF', x: 55, y: 75 },
      { position: 'CF', x: 70, y: 50 }
    ]
  },
  '4-2-1-3': {
    name: '4-2-1-3',
    positions: [
      { position: 'GK', x: 10, y: 50 },
      { position: 'RB', x: 25, y: 18 }, { position: 'CB', x: 25, y: 38 }, 
      { position: 'CB', x: 25, y: 62 }, { position: 'LB', x: 25, y: 82 },
      { position: 'DMF', x: 38, y: 40 }, { position: 'DMF', x: 38, y: 60 },
      { position: 'AMF', x: 50, y: 50 },
      { position: 'RWF', x: 65, y: 25 }, { position: 'CF', x: 65, y: 50 }, { position: 'LWF', x: 65, y: 75 }
    ]
  },
  '4-1-4-1': {
    name: '4-1-4-1',
    positions: [
      { position: 'GK', x: 10, y: 50 },
      { position: 'RB', x: 25, y: 18 }, { position: 'CB', x: 25, y: 38 }, 
      { position: 'CB', x: 25, y: 62 }, { position: 'LB', x: 25, y: 82 },
      { position: 'DMF', x: 35, y: 50 },
      { position: 'RMF', x: 48, y: 20 }, { position: 'CMF', x: 48, y: 40 }, 
      { position: 'CMF', x: 48, y: 60 }, { position: 'LMF', x: 48, y: 80 },
      { position: 'CF', x: 68, y: 50 }
    ]
  },
  '4-1-2-3': {
    name: '4-1-2-3',
    positions: [
      { position: 'GK', x: 10, y: 50 },
      { position: 'RB', x: 25, y: 18 }, { position: 'CB', x: 25, y: 38 }, 
      { position: 'CB', x: 25, y: 62 }, { position: 'LB', x: 25, y: 82 },
      { position: 'DMF', x: 35, y: 50 },
      { position: 'CMF', x: 48, y: 40 }, { position: 'CMF', x: 48, y: 60 },
      { position: 'RWF', x: 65, y: 25 }, { position: 'CF', x: 65, y: 50 }, { position: 'LWF', x: 65, y: 75 }
    ]
  },
  '3-4-3': {
    name: '3-4-3',
    positions: [
      { position: 'GK', x: 10, y: 50 },
      { position: 'CB', x: 20, y: 25 }, { position: 'CB', x: 20, y: 50 }, { position: 'CB', x: 20, y: 75 },
      { position: 'RWB', x: 40, y: 20 }, { position: 'CMF', x: 40, y: 40 }, 
      { position: 'CMF', x: 40, y: 60 }, { position: 'LWB', x: 40, y: 80 },
      { position: 'RWF', x: 65, y: 25 }, { position: 'CF', x: 65, y: 50 }, { position: 'LWF', x: 65, y: 75 }
    ]
  },
  '3-2-4-1': {
    name: '3-2-4-1',
    positions: [
      { position: 'GK', x: 10, y: 50 },
      { position: 'CB', x: 22, y: 28 }, { position: 'CB', x: 22, y: 50 }, { position: 'CB', x: 22, y: 72 },
      { position: 'DMF', x: 35, y: 40 }, { position: 'DMF', x: 35, y: 60 },
      { position: 'RMF', x: 50, y: 22 }, { position: 'CMF', x: 50, y: 40 }, 
      { position: 'CMF', x: 50, y: 60 }, { position: 'LMF', x: 50, y: 78 },
      { position: 'CF', x: 68, y: 50 }
    ]
  },
  '3-2-3-2': {
    name: '3-2-3-2',
    positions: [
      { position: 'GK', x: 10, y: 50 },
      { position: 'CB', x: 22, y: 28 }, { position: 'CB', x: 22, y: 50 }, { position: 'CB', x: 22, y: 72 },
      { position: 'DMF', x: 35, y: 40 }, { position: 'DMF', x: 35, y: 60 },
      { position: 'RWF', x: 50, y: 25 }, { position: 'AMF', x: 50, y: 50 }, { position: 'LWF', x: 50, y: 75 },
      { position: 'CF', x: 68, y: 38 }, { position: 'CF', x: 68, y: 62 }
    ]
  },
  '3-1-4-2': {
    name: '3-1-4-2',
    positions: [
      { position: 'GK', x: 10, y: 50 },
      { position: 'CB', x: 22, y: 28 }, { position: 'CB', x: 22, y: 50 }, { position: 'CB', x: 22, y: 72 },
      { position: 'DMF', x: 32, y: 50 },
      { position: 'RMF', x: 45, y: 22 }, { position: 'CMF', x: 45, y: 40 }, 
      { position: 'CMF', x: 45, y: 60 }, { position: 'LMF', x: 45, y: 78 },
      { position: 'CF', x: 65, y: 38 }, { position: 'CF', x: 65, y: 62 }
    ]
  },
  '5-3-2': {
    name: '5-3-2',
    positions: [
      { position: 'GK', x: 10, y: 50 },
      { position: 'RWB', x: 25, y: 15 }, { position: 'CB', x: 25, y: 30 }, 
      { position: 'CB', x: 25, y: 50 }, { position: 'CB', x: 25, y: 70 }, { position: 'LWB', x: 25, y: 85 },
      { position: 'CMF', x: 45, y: 35 }, { position: 'CMF', x: 45, y: 50 }, { position: 'CMF', x: 45, y: 65 },
      { position: 'CF', x: 70, y: 38 }, { position: 'CF', x: 70, y: 62 }
    ]
  },
  '5-2-2-1': {
    name: '5-2-2-1',
    positions: [
      { position: 'GK', x: 10, y: 50 },
      { position: 'RWB', x: 25, y: 15 }, { position: 'CB', x: 25, y: 30 }, 
      { position: 'CB', x: 25, y: 50 }, { position: 'CB', x: 25, y: 70 }, { position: 'LWB', x: 25, y: 85 },
      { position: 'CMF', x: 42, y: 40 }, { position: 'CMF', x: 42, y: 60 },
      { position: 'AMF', x: 58, y: 38 }, { position: 'AMF', x: 58, y: 62 },
      { position: 'CF', x: 72, y: 50 }
    ]
  },
  '5-2-1-2': {
    name: '5-2-1-2',
    positions: [
      { position: 'GK', x: 10, y: 50 },
      { position: 'RWB', x: 25, y: 15 }, { position: 'CB', x: 25, y: 30 }, 
      { position: 'CB', x: 25, y: 50 }, { position: 'CB', x: 25, y: 70 }, { position: 'LWB', x: 25, y: 85 },
      { position: 'CMF', x: 45, y: 40 }, { position: 'CMF', x: 45, y: 60 },
      { position: 'AMF', x: 55, y: 50 },
      { position: 'CF', x: 70, y: 35 }, { position: 'CF', x: 70, y: 65 }
    ]
  }
};

export const getAwayFormation = (homeFormation: Formation): Formation => {
  return {
    ...homeFormation,
    positions: homeFormation.positions.map(pos => ({
      ...pos,
      x: 100 - pos.x,
      y: 100 - pos.y
    }))
  };
};
