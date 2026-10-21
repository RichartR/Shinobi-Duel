export interface BoardNode {
  id: number;
  x: number;
  y: number;
  type: 'entry_p1' | 'entry_p2' | 'goal_p1' | 'goal_p2' | 'normal' | 'inner';
  label?: string;
}

export const BOARD_NODES: BoardNode[] = [
  // Top Outer Row (P2 Side - Akatsuki)
  { id: 0, x: 80, y: 58, type: 'entry_p2', label: 'INFILTRACIÓN' },
  { id: 1, x: 210, y: 58, type: 'normal' },
  { id: 2, x: 340, y: 52, type: 'goal_p2', label: 'BASE AKATSUKI' },
  { id: 3, x: 470, y: 58, type: 'normal' },
  { id: 4, x: 600, y: 58, type: 'entry_p2', label: 'INFILTRACIÓN' },

  // Left Outer Lane
  { id: 5, x: 80, y: 152, type: 'normal' },
  { id: 6, x: 80, y: 234, type: 'normal' },
  { id: 7, x: 80, y: 316, type: 'normal' },
  { id: 8, x: 80, y: 398, type: 'normal' },

  // Right Outer Lane
  { id: 9, x: 600, y: 152, type: 'normal' },
  { id: 10, x: 600, y: 234, type: 'normal' },
  { id: 11, x: 600, y: 316, type: 'normal' },
  { id: 12, x: 600, y: 398, type: 'normal' },

  // Bottom Outer Row (P1 Side - Konoha)
  { id: 13, x: 80, y: 492, type: 'entry_p1', label: 'INFILTRACIÓN' },
  { id: 14, x: 210, y: 492, type: 'normal' },
  { id: 15, x: 340, y: 498, type: 'goal_p1', label: 'MONUMENTO HOKAGE' },
  { id: 16, x: 470, y: 492, type: 'normal' },
  { id: 17, x: 600, y: 492, type: 'entry_p1', label: 'INFILTRACIÓN' },

  // Inner Sanctuary Ring (10 Tactical Nodes)
  { id: 18, x: 210, y: 165, type: 'inner' },
  { id: 19, x: 340, y: 165, type: 'inner' },
  { id: 20, x: 470, y: 165, type: 'inner' },
  { id: 21, x: 210, y: 238, type: 'inner' },
  { id: 22, x: 210, y: 312, type: 'inner' },
  { id: 23, x: 470, y: 238, type: 'inner' },
  { id: 24, x: 470, y: 312, type: 'inner' },
  { id: 25, x: 210, y: 385, type: 'inner' },
  { id: 26, x: 340, y: 385, type: 'inner' },
  { id: 27, x: 470, y: 385, type: 'inner' },
];

export const BOARD_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [13, 14], [14, 15], [15, 16], [16, 17],
  [0, 5], [5, 6], [6, 7], [7, 8], [8, 13],
  [4, 9], [9, 10], [10, 11], [11, 12], [12, 17],
  [18, 19], [19, 20], [20, 23], [23, 24], [24, 27],
  [27, 26], [26, 25], [25, 22], [22, 21], [21, 18],
  [0, 18], [4, 20], [13, 25], [17, 27],
  [2, 19], [15, 26],
  [6, 21], [7, 22], [10, 23], [11, 24],
];

export const ADJACENCY_LIST: Record<number, number[]> = BOARD_NODES.reduce((acc, node) => {
  acc[node.id] = [];
  return acc;
}, {} as Record<number, number[]>);

BOARD_EDGES.forEach(([a, b]) => {
  ADJACENCY_LIST[a].push(b);
  ADJACENCY_LIST[b].push(a);
});

export const P1_ENTRY_NODES = [13, 17];
export const P2_ENTRY_NODES = [0, 4];
export const P1_GOAL_NODE = 15;
export const P2_GOAL_NODE = 2;
