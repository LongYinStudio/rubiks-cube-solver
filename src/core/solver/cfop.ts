import solver from 'rubiks-cube-solver';
import type { MoveStep } from '../cube/types';
import { getMoveDescription } from './descriptions';

export interface CfopStageResult {
  stage: 'cross' | 'f2l' | 'oll' | 'pll';
  stageName: string;
  stageDescription: string;
  steps: MoveStep[];
}

export function convertKociembaToCfopState(kociembaState: string): string {
  const U = kociembaState.slice(0, 9).toLowerCase();
  const R = kociembaState.slice(9, 18).toLowerCase();
  const F = kociembaState.slice(18, 27).toLowerCase();
  const D = kociembaState.slice(27, 36).toLowerCase();
  const L = kociembaState.slice(36, 45).toLowerCase();
  const B = kociembaState.slice(45, 54).toLowerCase();

  return `${F}${R}${U}${D}${L}${B}`;
}

function normalizeMoves(str: string): string[] {
  if (!str) return [];
  const normalized = str.replace(/prime/gi, "'").trim();
  return normalized.split(/\s+/).filter(Boolean);
}

function getSolverFn(): (state: string, opts?: any) => any {
  if (typeof solver === 'function') return solver;
  if (typeof (solver as any)?.default === 'function') return (solver as any).default;
  if (typeof (solver as any)?.rubiksCubeSolver === 'function') return (solver as any).rubiksCubeSolver;
  return solver;
}

export function solveCfop(kociembaState: string): {
  allSteps: MoveStep[];
  stages: CfopStageResult[];
} {
  const cfopState = convertKociembaToCfopState(kociembaState);

  let rawResult: any;
  try {
    const solve = getSolverFn();
    rawResult = solve(cfopState, { partitioned: true });
  } catch (err: any) {
    throw new Error('CFOP 求解失败: ' + (err?.message || '魔方可能包含非法状态'));
  }

  const stages: CfopStageResult[] = [];
  const allSteps: MoveStep[] = [];

  // Stage 1: Cross
  const crossMoves = (rawResult.cross || []).flatMap((c: string) => normalizeMoves(c));
  const crossSteps = crossMoves.map((m: string, i: number) => ({
    move: m,
    notation: m,
    description: getMoveDescription(m),
    stage: 'cross' as const,
    subStepIndex: i + 1,
  }));
  stages.push({
    stage: 'cross',
    stageName: '第一阶段：底面十字 (Cross)',
    stageDescription: '将底面的4个棱块归位，形成十字结构，并对齐相邻侧面中心色。',
    steps: crossSteps,
  });
  allSteps.push(...crossSteps);

  // Stage 2: F2L
  const f2lMoves = (rawResult.f2l || []).flatMap((f: string) => normalizeMoves(f));
  const f2lSteps = f2lMoves.map((m: string, i: number) => ({
    move: m,
    notation: m,
    description: getMoveDescription(m),
    stage: 'f2l' as const,
    subStepIndex: i + 1,
  }));
  stages.push({
    stage: 'f2l',
    stageName: '第二阶段：前两层归位 (F2L)',
    stageDescription: '同时将前两层的 4 组角块和棱块配对并复原到对应位置。',
    steps: f2lSteps,
  });
  allSteps.push(...f2lSteps);

  // Stage 3: OLL
  const ollMoves = normalizeMoves(rawResult.oll || '');
  const ollSteps = ollMoves.map((m: string, i: number) => ({
    move: m,
    notation: m,
    description: getMoveDescription(m),
    stage: 'oll' as const,
    subStepIndex: i + 1,
  }));
  stages.push({
    stage: 'oll',
    stageName: '第三阶段：顶面朝向 (OLL)',
    stageDescription: '调整顶层各块朝向，将顶面全部翻转为相同颜色（通常为黄色面）。',
    steps: ollSteps,
  });
  allSteps.push(...ollSteps);

  // Stage 4: PLL
  const pllMoves = normalizeMoves(rawResult.pll || '');
  const pllSteps = pllMoves.map((m: string, i: number) => ({
    move: m,
    notation: m,
    description: getMoveDescription(m),
    stage: 'pll' as const,
    subStepIndex: i + 1,
  }));
  stages.push({
    stage: 'pll',
    stageName: '第四阶段：顶层顺序复原 (PLL)',
    stageDescription: '置换顶层的角块和棱块顺序，完全复原整个魔方！',
    steps: pllSteps,
  });
  allSteps.push(...pllSteps);

  return { allSteps, stages };
}
