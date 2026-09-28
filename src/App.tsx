import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Cube3D } from './core/cube/Cube3D';
import type { MoveStep, SolverMode } from './core/cube/types';
import { solveKociemba, ensureKociembaInitialized } from './core/solver/kociemba';
import { solveCfop } from './core/solver/cfop';
import type { CfopStageResult } from './core/solver/cfop';
import { Navbar } from './components/Navbar';
import { CubeCanvas } from './components/CubeCanvas';
import { Controller } from './components/Controller';
import { StepViewer } from './components/StepViewer';
import { ColorPickerModal } from './components/ColorPickerModal';
import { HelpModal } from './components/HelpModal';

export const App: React.FC = () => {
  const cubeRef = useRef<Cube3D | null>(null);

  const [mode, setMode] = useState<SolverMode>('optimal');
  const [isBusy, setIsBusy] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSolved, setIsSolved] = useState(true);
  const [moveCount, setMoveCount] = useState(0);
  const [speed, setSpeed] = useState(1.0);

  const [currentState, setCurrentState] = useState(
    'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB'
  );
  const [solutionSteps, setSolutionSteps] = useState<MoveStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [cfopStages, setCfopStages] = useState<CfopStageResult[]>([]);

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Pre-initialize Kociemba solver tables in background
  useEffect(() => {
    ensureKociembaInitialized();
  }, []);

  const handleCubeReady = useCallback((cube: Cube3D) => {
    cubeRef.current = cube;

    cube.onStateChange((stateStr) => {
      setCurrentState(stateStr);
      const isCurrentlySolved =
        stateStr === 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB';
      setIsSolved(isCurrentlySolved);
    });
  }, []);

  // Update speed
  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    cubeRef.current?.setSpeed(newSpeed);
  };

  // Helper to invert a move for "Previous Step"
  const invertMove = (move: string): string => {
    if (move.endsWith('2')) return move;
    if (move.endsWith("'")) return move.slice(0, -1);
    return `${move}'`;
  };

  // Manual move
  const handleManualMove = async (move: string) => {
    if (!cubeRef.current || isBusy) return;
    setIsBusy(true);
    await cubeRef.current.executeMove(move);
    setMoveCount((prev) => prev + 1);
    // Invalidate previous playback solution since user moved manually
    if (solutionSteps.length > 0) {
      setSolutionSteps([]);
      setCurrentStepIndex(0);
      setCfopStages([]);
      setIsPlaying(false);
    }
    setIsBusy(false);
  };

  // Random Scramble
  const handleScramble = async () => {
    if (!cubeRef.current || isBusy) return;
    setIsBusy(true);
    setIsPlaying(false);
    setSolutionSteps([]);
    setCurrentStepIndex(0);
    setCfopStages([]);

    const moves = cubeRef.current.generateScramble(20);
    for (const move of moves) {
      await cubeRef.current.executeMove(move, 120);
    }

    setMoveCount((c) => c + moves.length);
    setIsBusy(false);
  };

  // Reset to solved
  const handleReset = () => {
    if (!cubeRef.current || isBusy) return;
    setIsPlaying(false);
    setSolutionSteps([]);
    setCurrentStepIndex(0);
    setCfopStages([]);
    setMoveCount(0);
    cubeRef.current.reset();
  };

  // Solve Action
  const handleSolve = async (overrideState?: string | unknown) => {
    if (!cubeRef.current || isBusy) return;

    const state =
      typeof overrideState === 'string' && overrideState.length === 54
        ? overrideState
        : cubeRef.current.getStateString();

    if (state === 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB') {
      alert('魔方已经是完全复原状态！');
      return;
    }

    setIsBusy(true);
    setIsPlaying(false);

    try {
      if (mode === 'optimal') {
        const steps = await solveKociemba(state);
        setSolutionSteps(steps);
        setCurrentStepIndex(0);
        setCfopStages([]);
      } else {
        const { allSteps, stages } = solveCfop(state);
        setSolutionSteps(allSteps);
        setCurrentStepIndex(0);
        setCfopStages(stages);
      }
    } catch (err: any) {
      alert(err?.message || '计算还原方案失败，请确认魔方状态合法');
    } finally {
      setIsBusy(false);
    }
  };

  // Next Step Execution
  const executeNextStep = useCallback(async (): Promise<boolean> => {
    if (!cubeRef.current || currentStepIndex >= solutionSteps.length) {
      return false;
    }

    const step = solutionSteps[currentStepIndex];
    setIsBusy(true);
    await cubeRef.current.executeMove(step.move);
    setCurrentStepIndex((prev) => prev + 1);
    setMoveCount((prev) => prev + 1);
    setIsBusy(false);

    if (currentStepIndex + 1 === solutionSteps.length) {
      // Completed!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setIsPlaying(false);
      return false;
    }

    return true;
  }, [currentStepIndex, solutionSteps]);

  // Previous Step
  const handlePrevStep = async () => {
    if (!cubeRef.current || isBusy || currentStepIndex === 0) return;

    const prevStep = solutionSteps[currentStepIndex - 1];
    const inverted = invertMove(prevStep.move);

    setIsBusy(true);
    await cubeRef.current.executeMove(inverted);
    setCurrentStepIndex((prev) => prev - 1);
    setIsBusy(false);
  };

  // Play / Pause toggle
  const handlePlayPause = () => {
    if (currentStepIndex >= solutionSteps.length) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  // Reset playback to step 0
  const handleResetPlayback = async () => {
    if (!cubeRef.current || isBusy || currentStepIndex === 0) return;
    setIsPlaying(false);
    setIsBusy(true);

    // Rollback all performed steps
    for (let i = currentStepIndex - 1; i >= 0; i--) {
      const inv = invertMove(solutionSteps[i].move);
      await cubeRef.current.executeMove(inv, 80);
    }

    setCurrentStepIndex(0);
    setIsBusy(false);
  };

  // Auto-play loop effect
  useEffect(() => {
    if (!isPlaying) return;

    let isMounted = true;

    const runLoop = async () => {
      if (!isMounted || !isPlaying) return;
      const hasNext = await executeNextStep();
      if (hasNext && isMounted && isPlaying) {
        // Continue after brief pause
        setTimeout(runLoop, Math.max(50, 200 / speed));
      }
    };

    runLoop();

    return () => {
      isMounted = false;
    };
  }, [isPlaying, executeNextStep, speed]);

  // Apply state from 2D Color Picker
  const handleApplyCustomState = (newState: string, autoSolve = false) => {
    if (!cubeRef.current) return;
    cubeRef.current.applyStateString(newState);
    setCurrentState(newState);
    setIsSolved(newState === 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB');
    setSolutionSteps([]);
    setCurrentStepIndex(0);
    setCfopStages([]);
    setMoveCount(0);

    if (autoSolve) {
      setTimeout(() => {
        handleSolve(newState);
      }, 50);
    }
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when inside modals or inputs
      if (
        isColorPickerOpen ||
        isHelpOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key.toUpperCase();
      const isShift = e.shiftKey;

      if (['U', 'D', 'L', 'R', 'F', 'B'].includes(key)) {
        e.preventDefault();
        const move = isShift ? `${key}'` : key;
        handleManualMove(move);
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (solutionSteps.length > 0) {
          handlePlayPause();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (!isBusy && currentStepIndex < solutionSteps.length) {
          executeNextStep();
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (!isBusy && currentStepIndex > 0) {
          handlePrevStep();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isColorPickerOpen,
    isHelpOpen,
    isBusy,
    solutionSteps,
    currentStepIndex,
    executeNextStep,
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        mode={mode}
        onModeChange={(m) => {
          setMode(m);
          setSolutionSteps([]);
          setCurrentStepIndex(0);
          setCfopStages([]);
        }}
        onScramble={handleScramble}
        onReset={handleReset}
        onOpenColorPicker={() => setIsColorPickerOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        isBusy={isBusy}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        {/* Top 3D Viewport & Controller Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 3D Cube Canvas (7 Cols on large screen) */}
          <div className="lg:col-span-7 flex flex-col">
            <CubeCanvas
              onCubeReady={handleCubeReady}
              isSolved={isSolved}
              moveCount={moveCount}
            />
          </div>

          {/* Action Controller Panel (5 Cols on large screen) */}
          <div className="lg:col-span-5 flex flex-col">
            <Controller
              isBusy={isBusy}
              isPlaying={isPlaying}
              hasSolution={solutionSteps.length > 0}
              currentStepIndex={currentStepIndex}
              totalSteps={solutionSteps.length}
              speed={speed}
              solverMode={mode}
              onSolve={() => handleSolve()}
              onPlayPause={handlePlayPause}
              onPrevStep={handlePrevStep}
              onNextStep={executeNextStep}
              onResetPlayback={handleResetPlayback}
              onSpeedChange={handleSpeedChange}
              onManualMove={handleManualMove}
            />
          </div>
        </div>

        {/* Bottom Steps Viewer */}
        <StepViewer
          steps={solutionSteps}
          currentStepIndex={currentStepIndex}
          mode={mode}
          cfopStages={cfopStages}
        />
      </main>

      {/* 2D Unfolded Color Picker Modal */}
      <ColorPickerModal
        isOpen={isColorPickerOpen}
        onClose={() => setIsColorPickerOpen(false)}
        currentState={currentState}
        onApplyState={handleApplyCustomState}
      />

      {/* Notation & Keyboard Shortcuts Guide Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default App;
