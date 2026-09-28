import React, { useEffect, useRef } from 'react';
import { Cube3D } from '../core/cube/Cube3D';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface CubeCanvasProps {
  onCubeReady: (cube: Cube3D) => void;
  isSolved: boolean;
  moveCount: number;
}

export const CubeCanvas: React.FC<CubeCanvasProps> = ({
  onCubeReady,
  isSolved,
  moveCount,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cube = new Cube3D(containerRef.current);
    onCubeReady(cube);

    return () => {
      cube.dispose();
    };
  }, [onCubeReady]);

  return (
    <div className="relative w-full h-[380px] md:h-[460px] lg:h-[500px] rounded-2xl bg-gradient-to-b from-slate-900/50 via-slate-900/30 to-slate-950/70 border border-slate-800/80 shadow-2xl overflow-hidden flex items-center justify-center select-none">
      {/* Three.js Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Badges */}
      <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
        {isSolved ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium backdrop-blur-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>已完全复原</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium backdrop-blur-md">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>打乱状态 (待复原)</span>
          </div>
        )}

        {moveCount > 0 && (
          <div className="px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs font-mono backdrop-blur-md">
            已执行 {moveCount} 步
          </div>
        )}
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-3 text-center pointer-events-none w-full px-4">
        <p className="text-[11px] text-slate-400/90 tracking-wide flex items-center justify-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          <span>鼠标按住空白处可 360° 旋转视角 / 按住魔方面拖动可直接旋转对应层</span>
        </p>
      </div>
    </div>
  );
};
