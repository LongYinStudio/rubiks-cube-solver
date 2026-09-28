import Cube from './cubeLib';
import type { MoveStep } from '../cube/types';
import { getMoveDescription } from './descriptions';

let solverInitialized = false;
let initPromise: Promise<void> | null = null;

export function ensureKociembaInitialized(): Promise<void> {
  if (solverInitialized) return Promise.resolve();
  if (initPromise) return initPromise;

  initPromise = new Promise<void>((resolve) => {
    // Run in next tick so it doesn't block immediate UI mount
    setTimeout(() => {
      try {
        Cube.initSolver();
        solverInitialized = true;
      } catch (err) {
        console.error('Failed to init Kociemba solver:', err);
      }
      resolve();
    }, 50);
  });

  return initPromise;
}

export async function solveKociemba(stateString: string): Promise<MoveStep[]> {
  await ensureKociembaInitialized();

  if (stateString.length !== 54) {
    throw new Error('魔方状态长度不符合要求（需54个色块）');
  }

  let cube: Cube;
  try {
    cube = Cube.fromString(stateString);
  } catch (e: any) {
    throw new Error('无效的魔方状态数据: ' + (e?.message || '解析失败'));
  }

  if (cube.isSolved()) {
    return [];
  }

  const solutionString = cube.solve();
  if (!solutionString) {
    return [];
  }

  const moves = solutionString.trim().split(/\s+/).filter(Boolean);

  return moves.map((m, index) => ({
    move: m,
    notation: m,
    description: getMoveDescription(m),
    stage: 'optimal',
    subStepIndex: index + 1,
  }));
}
