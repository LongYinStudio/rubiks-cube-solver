export type FaceKey = 'U' | 'R' | 'F' | 'D' | 'L' | 'B';

export type CubeColor = 'white' | 'yellow' | 'green' | 'blue' | 'red' | 'orange';

export const FACE_NAMES: Record<FaceKey, string> = {
  U: '顶面 (Up)',
  D: '底面 (Down)',
  F: '前面 (Front)',
  B: '后面 (Back)',
  L: '左面 (Left)',
  R: '右面 (Right)',
};

export const FACE_COLORS: Record<FaceKey, { name: string; hex: string; colorKey: CubeColor }> = {
  U: { name: '白色', hex: '#f8fafc', colorKey: 'white' },
  D: { name: '黄色', hex: '#eab308', colorKey: 'yellow' },
  F: { name: '绿色', hex: '#16a34a', colorKey: 'green' },
  B: { name: '蓝色', hex: '#2563eb', colorKey: 'blue' },
  L: { name: '橙色', hex: '#ea580c', colorKey: 'orange' },
  R: { name: '红色', hex: '#dc2626', colorKey: 'red' },
};

export const COLOR_TO_FACE: Record<CubeColor, FaceKey> = {
  white: 'U',
  yellow: 'D',
  green: 'F',
  blue: 'B',
  orange: 'L',
  red: 'R',
};

export const PLASTIC_COLOR = '#18181b'; // Dark matte plastic for inner faces

export type MoveNotation =
  | 'U' | "U'" | 'U2'
  | 'D' | "D'" | 'D2'
  | 'L' | "L'" | 'L2'
  | 'R' | "R'" | 'R2'
  | 'F' | "F'" | 'F2'
  | 'B' | "B'" | 'B2'
  | 'd' | "d'" | 'd2'
  | 'b' | "b'" | 'b2'
  | 'r' | "r'" | 'r2';

export interface MoveStep {
  move: string;
  notation: string;
  description: string;
  stage?: 'cross' | 'f2l' | 'oll' | 'pll' | 'optimal' | 'scramble';
  subStepIndex?: number;
}

export type SolverMode = 'optimal' | 'cfop';
