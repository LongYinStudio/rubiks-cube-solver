declare module 'cubejs' {
  class Cube {
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
}

declare module 'rubiks-cube-solver' {
  export interface CfopPartitionedResult {
    cross: string[];
    f2l: string[];
    oll: string;
    pll: string;
  }
  function solver(state: string, options: { partitioned: true }): CfopPartitionedResult;
  function solver(state: string, options?: { partitioned?: false }): string;
  export default solver;
}
