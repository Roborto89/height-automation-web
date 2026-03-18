export interface InventoryItem {
  id: string;
  category: 'Robot' | 'Vision' | 'Safety';
  model: string;
  price: number;
  icon: string;
  description: string;
}

export const inventory: InventoryItem[] = [
  { id: 'r1', category: 'Robot', model: 'FANUC CRX-10iA', price: 35000, icon: '🤖', description: 'Collaborative robot, 10kg payload.' },
  { id: 'r2', category: 'Robot', model: 'FANUC M-20iD/25', price: 42000, icon: '🏗️', description: 'Industrial robot, high speed.' },
  { id: 'r3', category: 'Robot', model: 'Universal Robots UR10e', price: 38000, icon: '🦾', description: 'Easy setup cobot.' },
  
  { id: 'v1', category: 'Vision', model: 'Cognex In-Sight 7000', price: 4500, icon: '👁️', description: 'High-res industrial camera.' },
  { id: 'v2', category: 'Vision', model: 'Keyence CV-X', price: 5200, icon: '📸', description: 'Multi-camera support system.' },
  
  { id: 's1', category: 'Safety', model: 'Sick MicroScan3', price: 2800, icon: '🛡️', description: 'Safety laser scanner.' },
  { id: 's2', category: 'Safety', model: 'Keyence SZ-V', price: 3100, icon: '🚧', description: 'Premium safety scanner.' },
  { id: 's3', category: 'Safety', model: 'Allen-Bradley GuardLogix', price: 1500, icon: '🎛️', description: 'Safety controller.' }
];
