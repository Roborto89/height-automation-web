export interface InventoryItem {
  id: string;
  category: 'Robot' | 'Vision' | 'Safety' | 'Fabrication' | 'PCBA' | 'Assembly';
  model: string;
  price: number;
  icon: string;
  description: string;
  division: 'integration' | 'manufacturing';
}

export const inventory: InventoryItem[] = [
  // Systems Integration Division
  { id: 'r1', category: 'Robot', model: 'FANUC CRX-10iA', price: 35000, icon: '🤖', description: 'Collaborative robot, 10kg payload.', division: 'integration' },
  { id: 'r2', category: 'Robot', model: 'FANUC M-20iD/25', price: 42000, icon: '🏗️', description: 'Industrial robot, high speed.', division: 'integration' },
  { id: 'r3', category: 'Robot', model: 'Universal Robots UR10e', price: 38000, icon: '🦾', description: 'Easy setup cobot.', division: 'integration' },
  
  { id: 'v1', category: 'Vision', model: 'Cognex In-Sight 7000', price: 4500, icon: '👁️', description: 'High-res industrial camera.', division: 'integration' },
  { id: 'v2', category: 'Vision', model: 'Keyence CV-X', price: 5200, icon: '📸', description: 'Multi-camera support system.', division: 'integration' },
  
  { id: 's1', category: 'Safety', model: 'Sick MicroScan3', price: 2800, icon: '🛡️', description: 'Safety laser scanner.', division: 'integration' },
  { id: 's2', category: 'Safety', model: 'Keyence SZ-V', price: 3100, icon: '🚧', description: 'Premium safety scanner.', division: 'integration' },
  { id: 's3', category: 'Safety', model: 'Allen-Bradley GuardLogix', price: 1500, icon: '🎛️', description: 'Safety controller.', division: 'integration' },

  // Contract Manufacturing Division
  { id: 'm1', category: 'Fabrication', model: 'CNC Milling & Turning', price: 4500, icon: '⚙️', description: 'Precision multi-axis milling and turning for custom metallic and polymer parts.', division: 'manufacturing' },
  { id: 'm2', category: 'Fabrication', model: 'Sheet Metal Fabrication', price: 3200, icon: '✂️', description: 'High-speed laser cutting, precision bending, and forming for enclosures.', division: 'manufacturing' },
  
  { id: 'm3', category: 'PCBA', model: 'Surface Mount PCBA (SMT)', price: 7500, icon: '📟', description: 'Automated SMT placement, reflow soldering, and AOI inspection.', division: 'manufacturing' },
  { id: 'm4', category: 'PCBA', model: 'Through-Hole Soldering', price: 4200, icon: '🔌', description: 'Manual and wave soldering for ruggedized components and connectors.', division: 'manufacturing' },
  
  { id: 'm5', category: 'Assembly', model: 'Electromechanical Box Build', price: 9800, icon: '🗄️', description: 'Chassis design, sub-panel wiring, full electromechanical build-out, and functional testing.', division: 'manufacturing' },
  { id: 'm6', category: 'Assembly', model: 'Custom Wire Harnesses', price: 2400, icon: '🪢', description: 'Custom multi-wire looms, cable shielding, splicing, and termination.', division: 'manufacturing' }
];
