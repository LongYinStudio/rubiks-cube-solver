declare class Cube {
  constructor();
  static initSolver(): void;
  static fromString(str: string): Cube;
  static inverse(alg: string): string;
  identity(): void;
  toJSON(): unknown;
  asString(): string;
  move(algorithm: string): void;
  solve(maxDepth?: number): string;
  isSolved(): boolean;
  clone(): Cube;
}

export default Cube;
