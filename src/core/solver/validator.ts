import type { FaceKey } from '../cube/types';

export interface ValidationResult {
  valid: boolean;
  message?: string;
  counts: Record<FaceKey, number>;
}

const OPPOSITE_NAMES: Record<FaceKey, string> = {
  U: '白色',
  D: '黄色',
  F: '绿色',
  B: '蓝色',
  L: '橙色',
  R: '红色',
};

const OPPOSITES: Record<FaceKey, FaceKey> = {
  U: 'D',
  D: 'U',
  F: 'B',
  B: 'F',
  L: 'R',
  R: 'L',
};

// 12 Edges mapping to 54-string indices:
// U: 0..8, R: 9..17, F: 18..26, D: 27..35, L: 36..44, B: 45..53
const EDGES: Array<[number, number, string]> = [
  [5, 10, '顶-右 (U-R)'],
  [7, 19, '顶-前 (U-F)'],
  [3, 37, '顶-左 (U-L)'],
  [1, 46, '顶-后 (U-B)'],
  [32, 16, '底-右 (D-R)'],
  [28, 25, '底-前 (D-F)'],
  [30, 43, '底-左 (D-L)'],
  [34, 52, '底-后 (D-B)'],
  [23, 12, '前-右 (F-R)'],
  [21, 41, '前-左 (F-L)'],
  [48, 14, '后-右 (B-R)'],
  [50, 39, '后-左 (B-L)'],
];

// 8 Corners mapping to 54-string indices:
const CORNERS: Array<[number, number, number, string]> = [
  [8, 9, 20, '顶-右-前 (U-R-F)'],
  [6, 18, 38, '顶-前-左 (U-F-L)'],
  [0, 36, 47, '顶-左-后 (U-L-B)'],
  [2, 45, 11, '顶-后-右 (U-B-R)'],
  [29, 26, 15, '底-前-右 (D-F-R)'],
  [27, 44, 24, '底-左-前 (D-L-F)'],
  [33, 53, 42, '底-后-左 (D-B-L)'],
  [35, 17, 51, '底-右-后 (D-R-B)'],
];

export function validateCubeState(stateString: string): ValidationResult {
  const counts: Record<FaceKey, number> = {
    U: 0,
    R: 0,
    F: 0,
    D: 0,
    L: 0,
    B: 0,
  };

  if (stateString.length !== 54) {
    return {
      valid: false,
      message: `色块总数不正确：当前 ${stateString.length} 个，应为 54 个。`,
      counts,
    };
  }

  for (let i = 0; i < 54; i++) {
    const char = stateString[i] as FaceKey;
    if (counts[char] !== undefined) {
      counts[char]++;
    } else {
      return {
        valid: false,
        message: `检测到未知面标号: "${char}"`,
        counts,
      };
    }
  }

  const faces: FaceKey[] = ['U', 'R', 'F', 'D', 'L', 'B'];
  for (const f of faces) {
    if (counts[f] !== 9) {
      return {
        valid: false,
        message: `每个面颜色必须刚好 9 个：面 ${f} 当前有 ${counts[f]} 个。`,
        counts,
      };
    }
  }

  // Validate centers: [4, 13, 22, 31, 40, 49]
  const centerIndices: Record<FaceKey, number> = {
    U: 4,
    R: 13,
    F: 22,
    D: 31,
    L: 40,
    B: 49,
  };

  const centerSet = new Set<string>();
  for (const [face, idx] of Object.entries(centerIndices)) {
    const centerChar = stateString[idx];
    if (centerChar !== face) {
      return {
        valid: false,
        message: `中心块必须固定：${face} 面中心块当前标为 ${centerChar}，应为 ${face}`,
        counts,
      };
    }
    centerSet.add(centerChar);
  }

  if (centerSet.size !== 6) {
    return {
      valid: false,
      message: '六个中心块颜色不能重复，必须各不相同。',
      counts,
    };
  }

  // Physical validation: Edges
  for (const [i1, i2, edgeName] of EDGES) {
    const c1 = stateString[i1] as FaceKey;
    const c2 = stateString[i2] as FaceKey;
    if (c1 === c2) {
      return {
        valid: false,
        message: `色块物理冲突：${edgeName} 棱块两面都是同一种颜色（${OPPOSITE_NAMES[c1]}），魔方不可能存在同色棱块。`,
        counts,
      };
    }
    if (OPPOSITES[c1] === c2) {
      return {
        valid: false,
        message: `色块物理冲突：${edgeName} 棱块上包含了相对色（${OPPOSITE_NAMES[c1]} 与 ${OPPOSITE_NAMES[c2]} 永远不可能在同一个块上）。`,
        counts,
      };
    }
  }

  // Physical validation: Corners
  for (const [i1, i2, i3, cornerName] of CORNERS) {
    const c1 = stateString[i1] as FaceKey;
    const c2 = stateString[i2] as FaceKey;
    const c3 = stateString[i3] as FaceKey;
    if (c1 === c2 || c1 === c3 || c2 === c3) {
      return {
        valid: false,
        message: `色块物理冲突：${cornerName} 角块包含重复颜色，魔方角块三面颜色必须互不相同。`,
        counts,
      };
    }
    if (OPPOSITES[c1] === c2 || OPPOSITES[c1] === c3 || OPPOSITES[c2] === c3) {
      return {
        valid: false,
        message: `色块物理冲突：${cornerName} 角块包含了相对色（如白与黄、绿与蓝、红与橙不可能共存同一角块），请检查此处涂色。`,
        counts,
      };
    }
  }

  return { valid: true, counts };
}
