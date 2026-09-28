export const MOVE_DESCRIPTIONS: Record<string, string> = {
  // Single face moves
  U: '顶面 (Up) 顺时针旋转 90°',
  "U'": '顶面 (Up) 逆时针旋转 90°',
  U2: '顶面 (Up) 旋转 180°',
  D: '底面 (Down) 顺时针旋转 90°',
  "D'": '底面 (Down) 逆时针旋转 90°',
  D2: '底面 (Down) 旋转 180°',
  L: '左面 (Left) 顺时针旋转 90°',
  "L'": '左面 (Left) 逆时针旋转 90°',
  L2: '左面 (Left) 旋转 180°',
  R: '右面 (Right) 顺时针旋转 90°',
  "R'": '右面 (Right) 逆时针旋转 90°',
  R2: '右面 (Right) 旋转 180°',
  F: '前面 (Front) 顺时针旋转 90°',
  "F'": '前面 (Front) 逆时针旋转 90°',
  F2: '前面 (Front) 旋转 180°',
  B: '后面 (Back) 顺时针旋转 90°',
  "B'": '后面 (Back) 逆时针旋转 90°',
  B2: '后面 (Back) 旋转 180°',

  // Wide moves (CFOP)
  d: '底两层 (Down Wide) 顺时针旋转 90°',
  "d'": '底两层 (Down Wide) 逆时针旋转 90°',
  d2: '底两层 (Down Wide) 旋转 180°',
  b: '后两层 (Back Wide) 顺时针旋转 90°',
  "b'": '后两层 (Back Wide) 逆时针旋转 90°',
  b2: '后两层 (Back Wide) 旋转 180°',
  r: '右两层 (Right Wide) 顺时针旋转 90°',
  "r'": '右两层 (Right Wide) 逆时针旋转 90°',
  r2: '右两层 (Right Wide) 旋转 180°',
  u: '顶两层 (Up Wide) 顺时针旋转 90°',
  "u'": '顶两层 (Up Wide) 逆时针旋转 90°',
  u2: '顶两层 (Up Wide) 旋转 180°',
  l: '左两层 (Left Wide) 顺时针旋转 90°',
  "l'": '左两层 (Left Wide) 逆时针旋转 90°',
  l2: '左两层 (Left Wide) 旋转 180°',
  f: '前两层 (Front Wide) 顺时针旋转 90°',
  "f'": '前两层 (Front Wide) 逆时针旋转 90°',
  f2: '前两层 (Front Wide) 旋转 180°',
};

export function getMoveDescription(move: string): string {
  return MOVE_DESCRIPTIONS[move] || `${move} 旋转`;
}
