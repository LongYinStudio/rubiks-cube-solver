<div align="center">

  <img src="./public/favicon.svg" alt="Rubik's Cube Solver Logo" width="80" height="80" />

  # Rubik's Cube Solver

  <p>三阶魔方 3D 智能还原与人类教学系统</p>

  <p>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19.x-blue.svg?style=flat-square" alt="React" /></a>
    <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.x-3178c6.svg?style=flat-square" alt="TypeScript" /></a>
    <a href="https://threejs.org"><img src="https://img.shields.io/badge/Three.js-0.186-black.svg?style=flat-square" alt="Three.js" /></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg?style=flat-square" alt="TailwindCSS" /></a>
    <a href="https://vite.dev"><img src="https://img.shields.io/badge/Vite-8.x-646cff.svg?style=flat-square" alt="Vite" /></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="License" /></a>
  </p>

  <p>
    基于 <strong>React 19 + TypeScript + Three.js + Tailwind CSS v4</strong> 开发的现代化三阶魔方 Web 应用。<br />
    兼顾<b>计算机最优步数解法（Kociemba 两阶段算法）</b>与<b>人类分步教学法（CFOP / Fridrich Method）</b>。
  </p>

</div>

---

## 核心特性

- **3D 交互式魔方物理引擎**
  - 基于 Three.js 构建 27 个独立微块（Cubies），材质贴图与物理空间网格深度绑定。
  - 支持 360° 轨道自由旋转与平滑缩放。
  - **射线拾取（Raycasting）直接转动**：支持鼠标或触控按住任意表面色块，沿水平或垂直方向拖拽直接转动对应切片层。
  - 自动消除浮点数旋转误差（Coordinate Snapping），保证数百步连续高速转动后魔方网格结构依旧严丝合缝。

- **双算法引擎支持**
  - **Kociemba 最优两阶段算法**：现代化原生 ESM 重构，通常在 20 步以内（逼近上帝之数 20）给出全局最优解，毫秒级即时计算。
  - **CFOP 人类教学还原法**：严格按照魔方竞速还原四阶段（Cross 底面十字 -> F2L 前两层 -> OLL 顶面朝向 -> PLL 顶面复原）划分步骤，配备每一步的中文动作图解。

- **智能化状态录入与物理合法性校验**
  - **逐面防错引导向导 (Wizard)**：专为新手定制，提供标准物理持握姿态（前绿顶白）指引，四周配合相邻面颜色边界提示，彻底杜绝录入方向混乱。
  - **2D 十字展开图全景模式**：提供传统 6 面展开图，支持全局视图直观比对。
  - **画笔键盘极速切换**：支持字母快捷键（`U/W/1` 白色、`D/Y/2` 黄色、`F/G/3` 绿色、`B/4` 蓝色、`R/5` 红色、`L/O/6` 橙色）一键切换涂色画笔。
  - **多重物理合法性校验引擎**：自动校验各颜色块数量（9/9）、中心块防篡改、物理不可解的角块/棱块组合等异常状态。

- **高阶时间线播放器**
  - 自动连续播放、单步前进 / 后退（后退时自动执行逆时针/顺时针逆向回滚操作）。
  - 播放速度调节（0.5x, 1.0x, 1.5x, 2.0x）。
  - 步骤卡片横向平滑滚动同步，自动聚焦当前正在执行的步骤。
  - 复原达成庆祝动效（Canvas Confetti）。

- **全键盘快捷控制**
  - 针对魔方转动、步骤播放以及画笔调色盘，均提供原生键盘快捷键绑定。

---

## 技术选型

| 模块 | 技术栈 | 选型说明 |
| :--- | :--- | :--- |
| **基础框架** | React 19 + TypeScript | 现代化组件体系与全链路严格类型安全 |
| **构建工具** | Vite 8 + pnpm | 极速冷启动、Rollup/Rolldown 构建 |
| **3D 引擎** | Three.js + OrbitControls | 3D 场景、材质、层旋转分组与射线拾取交互 |
| **最优解算法** | Kociemba Algorithm (ESM) | Herbert Kociemba 两阶段最优步数算法（纯原生 ESM 重构版） |
| **教学向算法** | CFOP / Fridrich Method | 四阶段分步求解器，附带结构化阶段划分与动作解释 |
| **样式与系统** | Tailwind CSS v4 + Lucide Icons | 全新 CSS-first 编译架构，深度深色模式系统 |
| **动效支持** | canvas-confetti | 物理粒子礼花庆祝动效 |

---

## 项目结构

```text
rubiks-cube-solver/
├── public/
│   └── favicon.svg              # 3D 等轴测魔方矢量图标 (Favicon)
├── src/
│   ├── components/
│   │   ├── Logo.tsx             # 3D 等轴测魔方矢量组件
│   │   ├── Navbar.tsx           # 顶部导航、解法切换与快速操作
│   │   ├── CubeCanvas.tsx       # Three.js 3D 魔方视口与 HUD 状态层
│   │   ├── Controller.tsx       # 播放器控制条、倍速与手动转动面板
│   │   ├── StepViewer.tsx       # 还原步骤时间线、公式卡片与阶段统计
│   │   ├── ColorPickerModal.tsx # 新手逐面防错向导 / 2D 十字展开图录入
│   │   └── HelpModal.tsx        # 键盘快捷键与国际标准转动记号指南
│   ├── core/
│   │   ├── cube/
│   │   │   ├── Cube3D.ts        # 3D 魔方建模、层拾取、平滑缓动转动与状态同步
│   │   │   └── types.ts         # 颜色、面（U/D/L/R/F/B）与数据类型定义
│   │   └── solver/
│   │       ├── cubeLib.js       # 原生 ESM 版 Kociemba 核心算法库
│   │       ├── cubeLib.d.ts     # 算法库类型声明
│   │       ├── kociemba.ts      # 最优步数解法适配器与预初始化
│   │       ├── cfop.ts          # CFOP 四阶段分步提取与动作格式化
│   │       ├── validator.ts     # 物理合法性与色块计数校验引擎
│   │       └── descriptions.ts  # WCA 转动记号中文动作解析映射
│   ├── types/
│   │   └── modules.d.ts         # 第三方模块类型补充声明
│   ├── App.tsx                  # 全局状态管理、解法调度与键盘总线
│   ├── main.tsx                 # 应用入口
│   └── index.css                # Tailwind CSS v4 样式基底
├── index.html                   # HTML 模板入口
├── package.json
└── vite.config.ts
```

---

## 本地运行与开发

### 1. 克隆仓库并安装依赖

```bash
git clone https://github.com/LongYinStudio/rubiks-cube-solver.git
cd rubiks-cube-solver
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm dev
```

浏览器访问 `http://localhost:5173` 即可预览实时 3D 渲染效果。

### 3. 构建生产版本

```bash
pnpm build
```

打包构建物将输出至 `dist/` 目录，支持零配置直接部署到 Cloudflare Pages、Vercel 或 GitHub Pages。

---

## 快捷键与操作指南

### 3D 视图操作
- **旋转视角**：鼠标左键按住画布空白区域拖拽，或手机单指滑动屏幕。
- **旋转切片层**：鼠标按住魔方表面某个色块，沿水平或垂直方向拖拽即可旋转对应层。

### 魔方转动快捷键
| 按键 | 对应动作 | 按键 | 对应动作 |
| :--- | :--- | :--- | :--- |
| `U` | 顶面 (Up) 顺时针 90° | `Shift + U` | 顶面 (Up) 逆时针 90° |
| `D` | 底面 (Down) 顺时针 90° | `Shift + D` | 底面 (Down) 逆时针 90° |
| `F` | 前面 (Front) 顺时针 90° | `Shift + F` | 前面 (Front) 逆时针 90° |
| `B` | 后面 (Back) 顺时针 90° | `Shift + B` | 后面 (Back) 逆时针 90° |
| `L` | 左面 (Left) 顺时针 90° | `Shift + L` | 左面 (Left) 逆时针 90° |
| `R` | 右面 (Right) 顺时针 90° | `Shift + R` | 右面 (Right) 逆时针 90° |

### 播放控制快捷键
- `Space`：暂停 / 继续自动播放
- `←` / `→`：单步后退 / 单步前进

### 手动录入模式画笔快捷键
在手动录入弹窗中，可直接按下以下键切换当前画笔颜色：
- `U` / `W` / `1`：白色 (Up)
- `D` / `Y` / `2`：黄色 (Down)
- `F` / `G` / `3`：绿色 (Front)
- `B` / `4`：蓝色 (Back)
- `R` / `5`：红色 (Right)
- `L` / `O` / `6`：橙色 (Left)

---

## 国际标准魔方记号 (WCA) 速查

- **基本面定义**：
  - `U` (Up) - 顶面（白）
  - `D` (Down) - 底面（黄）
  - `F` (Front) - 前面（绿）
  - `B` (Back) - 后面（蓝）
  - `L` (Left) - 左面（橙）
  - `R` (Right) - 右面（红）
- **动作约定**：
  - **基础字母**（如 `R`）：从该面正视方向看，**顺时针**旋转 90°。
  - **带撇号**（如 `R'`）：从该面正视方向看，**逆时针**旋转 90°。
  - **带数字 2**（如 `U2`）：旋转 180°。

---

## 开源许可

本项目遵循 [MIT License](LICENSE) 开源协议。
