import React, { useState, useEffect } from 'react';
import type { FaceKey, CubeColor } from '../core/cube/types';
import { FACE_COLORS, COLOR_TO_FACE } from '../core/cube/types';
import { validateCubeState } from '../core/solver/validator';
import type { ValidationResult } from '../core/solver/validator';
import {
  X,
  Check,
  RefreshCw,
  AlertTriangle,
  ArrowDownToLine,
  Keyboard,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Palette,
  ListOrdered,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Info,
} from 'lucide-react';

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: string;
  onApplyState: (newState: string, autoSolve?: boolean) => void;
}

type InputTab = 'wizard' | 'cross';

interface FaceOrientationGuide {
  face: FaceKey;
  name: string;
  centerColorName: string;
  centerHex: string;
  turnInstruction: string;
  top: { label: string; hex: string };
  bottom: { label: string; hex: string };
  left: { label: string; hex: string };
  right: { label: string; hex: string };
}

const ORIENTATION_GUIDES: Record<FaceKey, FaceOrientationGuide> = {
  F: {
    face: 'F',
    name: '前面 (Front)',
    centerColorName: '绿色',
    centerHex: FACE_COLORS.F.hex,
    turnInstruction: '以【绿色中心】正对视线，【白色中心】朝向上方天花板。',
    top: { label: '上方：白色 (顶面)', hex: FACE_COLORS.U.hex },
    bottom: { label: '下方：黄色 (底面)', hex: FACE_COLORS.D.hex },
    left: { label: '左侧：橙色 (左面)', hex: FACE_COLORS.L.hex },
    right: { label: '右侧：红色 (右面)', hex: FACE_COLORS.R.hex },
  },
  R: {
    face: 'R',
    name: '右面 (Right)',
    centerColorName: '红色',
    centerHex: FACE_COLORS.R.hex,
    turnInstruction: '保持【白色中心】朝上不变，将魔方水平向左转 90°，使【红色中心】正对视线。',
    top: { label: '上方：白色 (顶面)', hex: FACE_COLORS.U.hex },
    bottom: { label: '下方：黄色 (底面)', hex: FACE_COLORS.D.hex },
    left: { label: '左侧：绿色 (前面)', hex: FACE_COLORS.F.hex },
    right: { label: '右侧：蓝色 (后面)', hex: FACE_COLORS.B.hex },
  },
  B: {
    face: 'B',
    name: '后面 (Back)',
    centerColorName: '蓝色',
    centerHex: FACE_COLORS.B.hex,
    turnInstruction: '保持【白色中心】朝上不变，继续水平向左转 90°，使【蓝色中心】正对视线。',
    top: { label: '上方：白色 (顶面)', hex: FACE_COLORS.U.hex },
    bottom: { label: '下方：黄色 (底面)', hex: FACE_COLORS.D.hex },
    left: { label: '左侧：红色 (右面)', hex: FACE_COLORS.R.hex },
    right: { label: '右侧：橙色 (左面)', hex: FACE_COLORS.L.hex },
  },
  L: {
    face: 'L',
    name: '左面 (Left)',
    centerColorName: '橙色',
    centerHex: FACE_COLORS.L.hex,
    turnInstruction: '保持【白色中心】朝上不变，继续水平向左转 90°，使【橙色中心】正对视线。',
    top: { label: '上方：白色 (顶面)', hex: FACE_COLORS.U.hex },
    bottom: { label: '下方：黄色 (底面)', hex: FACE_COLORS.D.hex },
    left: { label: '左侧：蓝色 (后面)', hex: FACE_COLORS.B.hex },
    right: { label: '右侧：绿色 (前面)', hex: FACE_COLORS.F.hex },
  },
  U: {
    face: 'U',
    name: '顶面 (Up) — 关键朝向！',
    centerColorName: '白色',
    centerHex: FACE_COLORS.U.hex,
    turnInstruction: '先回到初始姿势（绿前白上），然后将魔方向自己的胸前翻倒 90°，看到【白色中心】正对视线。',
    top: { label: '上方(远离胸口)：蓝色 (后面)', hex: FACE_COLORS.B.hex },
    bottom: { label: '下方(靠近胸口)：绿色 (前面)', hex: FACE_COLORS.F.hex },
    left: { label: '左侧：橙色 (左面)', hex: FACE_COLORS.L.hex },
    right: { label: '右侧：红色 (右面)', hex: FACE_COLORS.R.hex },
  },
  D: {
    face: 'D',
    name: '底面 (Down) — 关键朝向！',
    centerColorName: '黄色',
    centerHex: FACE_COLORS.D.hex,
    turnInstruction: '先回到初始姿势（绿前白上），然后将魔方向前（远离自己）翻倒 90°，看到【黄色中心】正对视线。',
    top: { label: '上方(靠近胸口)：绿色 (前面)', hex: FACE_COLORS.F.hex },
    bottom: { label: '下方(远离胸口)：蓝色 (后面)', hex: FACE_COLORS.B.hex },
    left: { label: '左侧：橙色 (左面)', hex: FACE_COLORS.L.hex },
    right: { label: '右侧：红色 (右面)', hex: FACE_COLORS.R.hex },
  },
};

const WIZARD_FACES: FaceKey[] = ['F', 'R', 'B', 'L', 'U', 'D'];

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  isOpen,
  onClose,
  currentState,
  onApplyState,
}) => {
  const [activeTab, setActiveTab] = useState<InputTab>('wizard');
  const [wizardStep, setWizardStep] = useState(0); // 0 to 5 for WIZARD_FACES

  const [facelets, setFacelets] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<CubeColor>('white');
  const [validation, setValidation] = useState<ValidationResult>({
    valid: true,
    counts: { U: 9, R: 9, F: 9, D: 9, L: 9, B: 9 },
  });

  // When modal opens or currentState changes, load it
  useEffect(() => {
    if (isOpen) {
      const stateToLoad =
        currentState.length === 54
          ? currentState
          : 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB';
      const arr = stateToLoad.split('');
      setFacelets(arr);
      setValidation(validateCubeState(stateToLoad));
      setWizardStep(0);
    }
  }, [isOpen, currentState]);

  // Keyboard shortcut listener to switch brush colors via keys
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key.toUpperCase();
      switch (key) {
        case 'U':
        case 'W':
        case '1':
          e.preventDefault();
          setSelectedColor('white');
          break;
        case 'D':
        case 'Y':
        case '2':
          e.preventDefault();
          setSelectedColor('yellow');
          break;
        case 'F':
        case 'G':
        case '3':
          e.preventDefault();
          setSelectedColor('green');
          break;
        case 'B':
        case '4':
          e.preventDefault();
          setSelectedColor('blue');
          break;
        case 'R':
        case '5':
          e.preventDefault();
          setSelectedColor('red');
          break;
        case 'L':
        case 'O':
        case '6':
          e.preventDefault();
          setSelectedColor('orange');
          break;
        case 'ESCAPE':
          e.preventDefault();
          onClose();
          break;
        case 'ENTER':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleApply(true);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, facelets, selectedColor]);

  if (!isOpen) return null;

  // Facelet index mapping for the 6 faces in 54-char string:
  // U: 0..8, R: 9..17, F: 18..26, D: 27..35, L: 36..44, B: 45..53
  const faceOffsets: Record<FaceKey, number> = {
    U: 0,
    R: 9,
    F: 18,
    D: 27,
    L: 36,
    B: 45,
  };

  const handleFaceletClick = (globalIndex: number, isCenter: boolean) => {
    if (isCenter) return; // Keep centers invariant

    const newFacelets = [...facelets];
    const newFaceKey = COLOR_TO_FACE[selectedColor];
    newFacelets[globalIndex] = newFaceKey;
    setFacelets(newFacelets);

    const newStateStr = newFacelets.join('');
    setValidation(validateCubeState(newStateStr));
  };

  const handleResetToSolved = () => {
    const solved = 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB';
    setFacelets(solved.split(''));
    setValidation(validateCubeState(solved));
  };

  const handleApply = (autoSolve = false) => {
    const stateStr = facelets.join('');
    const val = validateCubeState(stateStr);
    if (!val.valid) {
      alert(val.message || '魔方状态不合法，无法应用');
      return;
    }
    onApplyState(stateStr, autoSolve);
    onClose();
  };

  const colorsList: Array<{
    key: CubeColor;
    face: FaceKey;
    primaryKey: string;
    aliasKey: string;
    hex: string;
    name: string;
  }> = [
    { key: 'white', face: 'U', primaryKey: 'U', aliasKey: 'W', hex: FACE_COLORS.U.hex, name: '白' },
    { key: 'yellow', face: 'D', primaryKey: 'D', aliasKey: 'Y', hex: FACE_COLORS.D.hex, name: '黄' },
    { key: 'green', face: 'F', primaryKey: 'F', aliasKey: 'G', hex: FACE_COLORS.F.hex, name: '绿' },
    { key: 'blue', face: 'B', primaryKey: 'B', aliasKey: '', hex: FACE_COLORS.B.hex, name: '蓝' },
    { key: 'red', face: 'R', primaryKey: 'R', aliasKey: '', hex: FACE_COLORS.R.hex, name: '红' },
    { key: 'orange', face: 'L', primaryKey: 'L', aliasKey: 'O', hex: FACE_COLORS.L.hex, name: '橙' },
  ];

  // Render 3x3 grid for any face
  const renderFaceGrid = (faceKey: FaceKey, size = 'normal') => {
    const offset = faceOffsets[faceKey];
    const isLarge = size === 'large';

    return (
      <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-950/90 rounded-xl border border-slate-800 shadow-inner">
        {Array.from({ length: 9 }).map((_, i) => {
          const globalIndex = offset + i;
          const currentFaceChar = (facelets[globalIndex] || faceKey) as FaceKey;
          const isCenter = i === 4;
          const colorHex = FACE_COLORS[currentFaceChar]?.hex || '#444';

          const btnSize = isLarge
            ? 'w-12 h-12 sm:w-14 sm:h-14 text-sm'
            : 'w-7 h-7 sm:w-8 sm:h-8 text-xs';

          return (
            <button
              key={i}
              onClick={() => handleFaceletClick(globalIndex, isCenter)}
              disabled={isCenter}
              title={
                isCenter
                  ? '中心块固定'
                  : `点击涂上 ${FACE_COLORS[COLOR_TO_FACE[selectedColor]].name}`
              }
              style={{ backgroundColor: colorHex }}
              className={`${btnSize} rounded-md border border-black/40 shadow-inner flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
                isCenter
                  ? 'ring-2 ring-white/60 cursor-not-allowed opacity-95'
                  : 'cursor-pointer hover:ring-2 hover:ring-indigo-400'
              }`}
            >
              {isCenter && (
                <span className="font-extrabold text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                  {faceKey}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const currentWizardFace = WIZARD_FACES[wizardStep];
  const guide = ORIENTATION_GUIDES[currentWizardFace];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 overflow-hidden flex flex-col gap-4 max-h-[95vh] overflow-y-auto">
        {/* Header & Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-indigo-400" />
              <span>手动输入魔方各面状态</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              支持按键切换画笔，专为新手设计了单面防错朝向指引
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('wizard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'wizard'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>逐面防错引导 (推荐)</span>
              </button>
              <button
                onClick={() => setActiveTab('cross')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'cross'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>展开图全景</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TAB 1: 逐面防错指引录入模式 (新手模式) */}
        {activeTab === 'wizard' && (
          <div className="flex flex-col gap-3 py-1">
            {/* Step Sequence Pills */}
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
              {WIZARD_FACES.map((f, idx) => {
                const g = ORIENTATION_GUIDES[f];
                const isActive = idx === wizardStep;
                return (
                  <button
                    key={f}
                    onClick={() => setWizardStep(idx)}
                    className={`flex-1 min-w-[70px] flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all border ${
                      isActive
                        ? 'bg-indigo-600/90 border-indigo-400 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: g.centerHex }}
                    />
                    <span>{f} ({g.centerColorName})</span>
                  </button>
                );
              })}
            </div>

            {/* Instruction Card */}
            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/25 flex flex-col gap-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                  <ListOrdered className="w-4 h-4 text-indigo-400" />
                  当前录入：第 {wizardStep + 1}/6 面 — {guide.name}
                </span>
                <span className="text-[11px] text-slate-400">
                  中心颜色：{guide.centerColorName} (固定)
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed font-medium bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 flex items-start gap-1">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold text-[11px] inline-flex items-center gap-1 flex-shrink-0 mt-0.5">
                  <Info className="w-3 h-3 text-indigo-400" />
                  持握手法
                </span>
                <span>{guide.turnInstruction}</span>
              </p>
            </div>

            {/* Main Interactive Grid surrounded by clear Direction Badges */}
            <div className="flex flex-col items-center justify-center gap-1.5 my-1">
              {/* TOP Indicator */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300 shadow-sm">
                <ArrowUp className="w-3.5 h-3.5 text-indigo-400" />
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: guide.top.hex }}
                />
                <span>{guide.top.label}</span>
              </div>

              {/* Middle Row: LEFT - GRID - RIGHT */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Left Indicator */}
                <div className="flex flex-col items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-medium text-slate-300 max-w-[85px] text-center shadow-sm">
                  <div className="flex items-center gap-1 text-slate-400">
                    <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: guide.left.hex }}
                    />
                  </div>
                  <span>{guide.left.label}</span>
                </div>

                {/* 3x3 Grid */}
                {renderFaceGrid(currentWizardFace, 'large')}

                {/* Right Indicator */}
                <div className="flex flex-col items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-medium text-slate-300 max-w-[85px] text-center shadow-sm">
                  <div className="flex items-center gap-1 text-slate-400">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: guide.right.hex }}
                    />
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <span>{guide.right.label}</span>
                </div>
              </div>

              {/* BOTTOM Indicator */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300 shadow-sm">
                <ArrowDown className="w-3.5 h-3.5 text-indigo-400" />
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: guide.bottom.hex }}
                />
                <span>{guide.bottom.label}</span>
              </div>
            </div>

            {/* Step Navigation Bar */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={() => setWizardStep((s) => Math.max(0, s - 1))}
                disabled={wizardStep === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium disabled:opacity-40 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>上一面</span>
              </button>

              <span className="text-xs text-slate-400 font-mono">
                {wizardStep + 1} / 6
              </span>

              {wizardStep < 5 ? (
                <button
                  onClick={() => setWizardStep((s) => Math.min(5, s + 1))}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-sm"
                >
                  <span>下一面：{WIZARD_FACES[wizardStep + 1]}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => handleApply(false)}
                  disabled={!validation.valid}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-all shadow-sm disabled:opacity-40"
                >
                  <Check className="w-4 h-4" />
                  <span>全部录入完成</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: 展开图全景模式 */}
        {activeTab === 'cross' && (
          <div className="flex flex-col items-center gap-3 my-1">
            {/* Holding Reference Box */}
            <div className="w-full p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  <strong>基准持握：</strong>绿色正对视线，白色朝上天花板，红色在右，橙色在左。
                </span>
              </span>
            </div>

            {/* 2D Cross Layout */}
            <div className="flex flex-col items-center gap-2">
              {/* Top: U */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                  <span>顶面 (U) 白色</span>
                  <span className="text-[10px] text-slate-500">(下方靠自己：绿)</span>
                </span>
                {renderFaceGrid('U')}
              </div>

              {/* Middle: L, F, R, B */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[11px] font-semibold text-slate-300">左 (L) 橙</span>
                  {renderFaceGrid('L')}
                </div>
                <div className="flex flex-col items-center gap-1 ring-1 ring-emerald-500/30 rounded-xl p-0.5">
                  <span className="text-[11px] font-semibold text-emerald-300">正面 (F) 绿</span>
                  {renderFaceGrid('F')}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[11px] font-semibold text-slate-300">右 (R) 红</span>
                  {renderFaceGrid('R')}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[11px] font-semibold text-slate-300">后 (B) 蓝</span>
                  {renderFaceGrid('B')}
                </div>
              </div>

              {/* Bottom: D */}
              <div className="flex flex-col items-center gap-1">
                {renderFaceGrid('D')}
                <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                  <span>底面 (D) 黄色</span>
                  <span className="text-[10px] text-slate-500">(上方靠自己：绿)</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Color Palette Selector with Shortcut Badges and Counts */}
        <div className="flex flex-col gap-2 p-3 bg-slate-950/70 border border-slate-800/90 rounded-xl mt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-300 flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-indigo-400" />
              画笔调色盘（点击选择，或按键盘字母直接切换）：
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              按 U/D/F/B/R/L 或 W/Y/G/B/R/O
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {colorsList.map((item) => {
              const count = validation.counts[item.face] || 0;
              const isFull = count === 9;
              const isSelected = selectedColor === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => setSelectedColor(item.key)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/15 ring-2 ring-indigo-500/50 shadow-md shadow-indigo-500/10'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
                  }`}
                >
                  {/* Color Circle / Check */}
                  <div
                    className="w-8 h-8 rounded-lg shadow border border-black/30 flex items-center justify-center transition-transform hover:scale-105"
                    style={{ backgroundColor: item.hex }}
                  >
                    {isSelected && (
                      <Check className="w-5 h-5 text-black font-extrabold drop-shadow" />
                    )}
                  </div>

                  {/* Name and Keyboard Shortcut Badge */}
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-slate-200">
                      {item.name}
                    </span>
                    <kbd className="px-1 py-0.5 rounded bg-slate-800 text-[10px] font-mono font-bold text-indigo-300 border border-slate-700">
                      {item.primaryKey}
                      {item.aliasKey && `/${item.aliasKey}`}
                    </kbd>
                  </div>

                  {/* 9-Count Badge */}
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      isFull
                        ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {count}/9
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Validation Warning */}
        {!validation.valid && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{validation.message}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <button
            onClick={handleResetToSolved}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>恢复默认解</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleApply(false)}
              disabled={!validation.valid}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs md:text-sm font-semibold transition-all disabled:opacity-40"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>应用到 3D 视图</span>
            </button>
            <button
              onClick={() => handleApply(true)}
              disabled={!validation.valid}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs md:text-sm font-semibold shadow-md shadow-indigo-600/30 transition-all disabled:opacity-40"
            >
              <Sparkles className="w-4 h-4" />
              <span>应用并开始求解</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
