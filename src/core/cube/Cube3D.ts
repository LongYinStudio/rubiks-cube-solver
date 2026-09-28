import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { FaceKey } from './types';
import { FACE_COLORS, PLASTIC_COLOR } from './types';

// Standard 6 face directions in local cubie space
// 0: +X (Right / R), 1: -X (Left / L), 2: +Y (Up / U), 3: -Y (Down / D), 4: +Z (Front / F), 5: -Z (Back / B)
const LOCAL_NORMALS: Record<number, { vector: THREE.Vector3; faceKey: FaceKey }> = {
  0: { vector: new THREE.Vector3(1, 0, 0), faceKey: 'R' },
  1: { vector: new THREE.Vector3(-1, 0, 0), faceKey: 'L' },
  2: { vector: new THREE.Vector3(0, 1, 0), faceKey: 'U' },
  3: { vector: new THREE.Vector3(0, -1, 0), faceKey: 'D' },
  4: { vector: new THREE.Vector3(0, 0, 1), faceKey: 'F' },
  5: { vector: new THREE.Vector3(0, 0, -1), faceKey: 'B' },
};

export class Cube3D {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private cubeGroup: THREE.Group;
  private cubies: THREE.Mesh[] = [];
  private isDestroyed = false;
  private animationQueue: Array<{
    move: string;
    duration: number;
    resolve: () => void;
  }> = [];
  private animating = false;
  private baseMoveDuration = 250; // ms
  private speed = 1.0;

  // Drag interaction
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private dragStartData: {
    point: THREE.Vector3;
    normal: THREE.Vector3;
    cubie: THREE.Mesh;
    screenX: number;
    screenY: number;
  } | null = null;
  private isDraggingCubeFace = false;

  private onStateChangeCallback?: (stateString: string) => void;

  constructor(container: HTMLElement) {
    this.container = container;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    this.camera.position.set(4.5, 4.0, 5.5);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    container.appendChild(this.renderer.domElement);

    // OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 3.5;
    this.controls.maxDistance = 12;
    this.controls.enablePan = false;

    // Lights
    this.setupLighting();

    // Main group
    this.cubeGroup = new THREE.Group();
    this.scene.add(this.cubeGroup);

    // Create 27 cubies
    this.createCubies();

    // Event listeners
    this.bindEvents();

    // Start render loop
    this.animate();
  }

  private setupLighting(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    // Key light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(5, 8, 6);
    this.scene.add(keyLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
    fillLight.position.set(-6, -4, -5);
    this.scene.add(fillLight);

    // Rim light
    const rimLight = new THREE.DirectionalLight(0x93c5fd, 0.6);
    rimLight.position.set(0, -6, 6);
    this.scene.add(rimLight);
  }

  private createCubies(): void {
    // Clear existing
    while (this.cubeGroup.children.length > 0) {
      this.cubeGroup.remove(this.cubeGroup.children[0]);
    }
    this.cubies = [];

    const cubieSize = 0.94;
    const geometry = new THREE.BoxGeometry(cubieSize, cubieSize, cubieSize);

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue; // Skip core

          const materials: THREE.MeshStandardMaterial[] = [];

          // 0: +X (Right / R), 1: -X (Left / L)
          // 2: +Y (Up / U),    3: -Y (Down / D)
          // 4: +Z (Front / F), 5: -Z (Back / B)
          for (let f = 0; f < 6; f++) {
            let color = PLASTIC_COLOR;
            let roughness = 0.7;

            let faceKey: FaceKey = LOCAL_NORMALS[f].faceKey;

            if (f === 0 && x === 1) {
              color = FACE_COLORS.R.hex;
              roughness = 0.25;
              faceKey = 'R';
            } else if (f === 1 && x === -1) {
              color = FACE_COLORS.L.hex;
              roughness = 0.25;
              faceKey = 'L';
            } else if (f === 2 && y === 1) {
              color = FACE_COLORS.U.hex;
              roughness = 0.25;
              faceKey = 'U';
            } else if (f === 3 && y === -1) {
              color = FACE_COLORS.D.hex;
              roughness = 0.25;
              faceKey = 'D';
            } else if (f === 4 && z === 1) {
              color = FACE_COLORS.F.hex;
              roughness = 0.25;
              faceKey = 'F';
            } else if (f === 5 && z === -1) {
              color = FACE_COLORS.B.hex;
              roughness = 0.25;
              faceKey = 'B';
            }

            const mat = new THREE.MeshStandardMaterial({
              color: new THREE.Color(color),
              roughness,
              metalness: 0.1,
            });
            mat.userData = { faceKey };
            materials.push(mat);
          }

          const mesh = new THREE.Mesh(geometry, materials);
          mesh.position.set(x, y, z);
          mesh.userData = { initial: { x, y, z } };
          this.cubeGroup.add(mesh);
          this.cubies.push(mesh);
        }
      }
    }
  }

  public setSpeed(multiplier: number): void {
    this.speed = Math.max(0.2, Math.min(multiplier, 5));
  }

  public onStateChange(cb: (stateString: string) => void): void {
    this.onStateChangeCallback = cb;
  }

  public notifyStateChange(): void {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(this.getStateString());
    }
  }

  public isBusy(): boolean {
    return this.animating || this.animationQueue.length > 0;
  }

  public executeMove(move: string, duration?: number): Promise<void> {
    return new Promise<void>((resolve) => {
      this.animationQueue.push({
        move,
        duration: (duration ?? this.baseMoveDuration) / this.speed,
        resolve,
      });
      this.processQueue();
    });
  }

  public async executeMoves(
    moves: string[],
    onProgress?: (index: number) => void
  ): Promise<void> {
    for (let i = 0; i < moves.length; i++) {
      if (this.isDestroyed) break;
      await this.executeMove(moves[i]);
      onProgress?.(i);
    }
  }

  private processQueue(): void {
    if (this.animating || this.animationQueue.length === 0) return;

    const item = this.animationQueue.shift();
    if (!item) return;

    this.animating = true;
    this.animateMove(item.move, item.duration, () => {
      item.resolve();
      this.animating = false;
      this.notifyStateChange();
      this.processQueue();
    });
  }

  private getLayerFilter(move: string): {
    cubies: THREE.Mesh[];
    axis: THREE.Vector3;
    angle: number;
  } {
    const rawFace = move.charAt(0);
    const isPrime = move.includes("'") || move.includes('prime');
    const isDouble = move.includes('2');

    let axis = new THREE.Vector3(0, 1, 0);
    let baseAngle = -Math.PI / 2;
    let filter: (c: THREE.Mesh) => boolean = () => false;

    switch (rawFace) {
      case 'U':
        axis = new THREE.Vector3(0, 1, 0);
        baseAngle = -Math.PI / 2;
        filter = (c) => Math.round(c.position.y) === 1;
        break;
      case 'D':
        axis = new THREE.Vector3(0, 1, 0);
        baseAngle = Math.PI / 2;
        filter = (c) => Math.round(c.position.y) === -1;
        break;
      case 'R':
        axis = new THREE.Vector3(1, 0, 0);
        baseAngle = -Math.PI / 2;
        filter = (c) => Math.round(c.position.x) === 1;
        break;
      case 'L':
        axis = new THREE.Vector3(1, 0, 0);
        baseAngle = Math.PI / 2;
        filter = (c) => Math.round(c.position.x) === -1;
        break;
      case 'F':
        axis = new THREE.Vector3(0, 0, 1);
        baseAngle = -Math.PI / 2;
        filter = (c) => Math.round(c.position.z) === 1;
        break;
      case 'B':
        axis = new THREE.Vector3(0, 0, 1);
        baseAngle = Math.PI / 2;
        filter = (c) => Math.round(c.position.z) === -1;
        break;

      // Wide moves
      case 'd':
        axis = new THREE.Vector3(0, 1, 0);
        baseAngle = Math.PI / 2;
        filter = (c) => Math.round(c.position.y) <= 0;
        break;
      case 'u':
        axis = new THREE.Vector3(0, 1, 0);
        baseAngle = -Math.PI / 2;
        filter = (c) => Math.round(c.position.y) >= 0;
        break;
      case 'r':
        axis = new THREE.Vector3(1, 0, 0);
        baseAngle = -Math.PI / 2;
        filter = (c) => Math.round(c.position.x) >= 0;
        break;
      case 'l':
        axis = new THREE.Vector3(1, 0, 0);
        baseAngle = Math.PI / 2;
        filter = (c) => Math.round(c.position.x) <= 0;
        break;
      case 'b':
        axis = new THREE.Vector3(0, 0, 1);
        baseAngle = Math.PI / 2;
        filter = (c) => Math.round(c.position.z) <= 0;
        break;
      case 'f':
        axis = new THREE.Vector3(0, 0, 1);
        baseAngle = -Math.PI / 2;
        filter = (c) => Math.round(c.position.z) >= 0;
        break;
      default:
        break;
    }

    let angle = baseAngle;
    if (isPrime) angle = -angle;
    if (isDouble) angle = angle * 2;

    const layerCubies = this.cubies.filter(filter);
    return { cubies: layerCubies, axis, angle };
  }

  private animateMove(move: string, duration: number, onComplete: () => void): void {
    const { cubies, axis, angle } = this.getLayerFilter(move);

    if (cubies.length === 0 || duration <= 0) {
      onComplete();
      return;
    }

    const pivot = new THREE.Group();
    this.scene.add(pivot);

    // Attach target cubies to pivot
    cubies.forEach((cubie) => pivot.attach(cubie));

    const startTime = performance.now();
    let prevAngle = 0;

    const step = (now: number) => {
      if (this.isDestroyed) return;

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-in-out cubic
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const currentAngle = angle * ease;
      const delta = currentAngle - prevAngle;
      prevAngle = currentAngle;

      pivot.rotateOnAxis(axis, delta);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Complete rotation
        pivot.updateMatrixWorld(true);

        cubies.forEach((cubie) => {
          this.cubeGroup.attach(cubie);
          // Snap position to exact integer coordinates to eliminate float rounding errors
          cubie.position.x = Math.round(cubie.position.x);
          cubie.position.y = Math.round(cubie.position.y);
          cubie.position.z = Math.round(cubie.position.z);
        });

        this.scene.remove(pivot);
        onComplete();
      }
    };

    requestAnimationFrame(step);
  }

  // Generate 54-char Kociemba state string: U(9) R(9) F(9) D(9) L(9) B(9)
  public getStateString(): string {
    const faceOrder: FaceKey[] = ['U', 'R', 'F', 'D', 'L', 'B'];
    let result = '';

    for (const faceKey of faceOrder) {
      result += this.getFaceString(faceKey);
    }

    return result;
  }

  private getFaceString(face: FaceKey): string {
    // 9 facelets per face, ordered row-by-row
    const faceletsCoords = this.getFaceCoords(face);
    let faceStr = '';

    for (const target of faceletsCoords) {
      const cubie = this.cubies.find(
        (c) =>
          Math.round(c.position.x) === target.x &&
          Math.round(c.position.y) === target.y &&
          Math.round(c.position.z) === target.z
      );

      if (!cubie) {
        faceStr += face;
        continue;
      }

      // Find which material index on this cubie is currently pointing along worldNormal
      const worldTargetNormal = this.getFaceNormal(face);
      let matchedFaceKey: FaceKey = face;
      let maxDot = -Infinity;
      const mats = cubie.material as THREE.MeshStandardMaterial[];

      for (let i = 0; i < 6; i++) {
        const localNormal = LOCAL_NORMALS[i].vector.clone();
        // Transform local normal to world space
        const worldNormal = localNormal.applyQuaternion(cubie.quaternion);
        const dot = worldNormal.dot(worldTargetNormal);

        if (dot > maxDot) {
          maxDot = dot;
          matchedFaceKey = mats[i]?.userData?.faceKey ?? LOCAL_NORMALS[i].faceKey;
        }
      }

      faceStr += matchedFaceKey;
    }

    return faceStr;
  }

  private getFaceNormal(face: FaceKey): THREE.Vector3 {
    switch (face) {
      case 'U':
        return new THREE.Vector3(0, 1, 0);
      case 'D':
        return new THREE.Vector3(0, -1, 0);
      case 'R':
        return new THREE.Vector3(1, 0, 0);
      case 'L':
        return new THREE.Vector3(-1, 0, 0);
      case 'F':
        return new THREE.Vector3(0, 0, 1);
      case 'B':
        return new THREE.Vector3(0, 0, -1);
    }
  }

  private getFaceCoords(face: FaceKey): Array<{ x: number; y: number; z: number }> {
    const coords: Array<{ x: number; y: number; z: number }> = [];

    switch (face) {
      case 'U': // y = 1. Looking down from top: z goes from -1 to 1 (top to bottom), x goes from -1 to 1 (left to right)
        for (let z = -1; z <= 1; z++) {
          for (let x = -1; x <= 1; x++) {
            coords.push({ x, y: 1, z });
          }
        }
        break;
      case 'R': // x = 1. Looking at R face: y goes 1 to -1 (top to bottom), z goes 1 to -1 (left to right)
        for (let y = 1; y >= -1; y--) {
          for (let z = 1; z >= -1; z--) {
            coords.push({ x: 1, y, z });
          }
        }
        break;
      case 'F': // z = 1. Looking at F face: y goes 1 to -1 (top to bottom), x goes -1 to 1 (left to right)
        for (let y = 1; y >= -1; y--) {
          for (let x = -1; x <= 1; x++) {
            coords.push({ x, y, z: 1 });
          }
        }
        break;
      case 'D': // y = -1. Looking from bottom with F up: z goes 1 to -1 (top to bottom), x goes -1 to 1 (left to right)
        for (let z = 1; z >= -1; z--) {
          for (let x = -1; x <= 1; x++) {
            coords.push({ x, y: -1, z });
          }
        }
        break;
      case 'L': // x = -1. Looking at L face: y goes 1 to -1 (top to bottom), z goes -1 to 1 (left to right)
        for (let y = 1; y >= -1; y--) {
          for (let z = -1; z <= 1; z++) {
            coords.push({ x: -1, y, z });
          }
        }
        break;
      case 'B': // z = -1. Looking at B face: y goes 1 to -1 (top to bottom), x goes 1 to -1 (left to right)
        for (let y = 1; y >= -1; y--) {
          for (let x = 1; x >= -1; x--) {
            coords.push({ x, y, z: -1 });
          }
        }
        break;
    }

    return coords;
  }

  // Directly skin the cubies with a 54-char string: U(9) R(9) F(9) D(9) L(9) B(9)
  public applyStateString(state: string): void {
    if (state.length !== 54) return;

    // Reset all cubies orientation to identity
    this.resetOrientation();

    const faces: FaceKey[] = ['U', 'R', 'F', 'D', 'L', 'B'];

    faces.forEach((face, faceIdx) => {
      const faceSlice = state.slice(faceIdx * 9, (faceIdx + 1) * 9);
      const coords = this.getFaceCoords(face);
      const faceNormal = this.getFaceNormal(face);

      coords.forEach((coord, i) => {
        const cubie = this.cubies.find(
          (c) =>
            Math.round(c.position.x) === coord.x &&
            Math.round(c.position.y) === coord.y &&
            Math.round(c.position.z) === coord.z
        );

        if (!cubie) return;

        const char = faceSlice[i].toUpperCase() as FaceKey;
        const colorHex = FACE_COLORS[char]?.hex ?? PLASTIC_COLOR;

        // Find which material index corresponds to this face normal
        for (let f = 0; f < 6; f++) {
          if (LOCAL_NORMALS[f].vector.dot(faceNormal) > 0.9) {
            const mats = cubie.material as THREE.MeshStandardMaterial[];
            if (mats[f]) {
              mats[f].color.set(colorHex);
              mats[f].userData = { faceKey: char };
            }
          }
        }
      });
    });

    this.notifyStateChange();
  }

  public reset(): void {
    this.animationQueue = [];
    this.animating = false;
    this.createCubies();
    this.notifyStateChange();
  }

  private resetOrientation(): void {
    this.cubies.forEach((cubie) => {
      const init = cubie.userData.initial;
      cubie.position.set(init.x, init.y, init.z);
      cubie.quaternion.identity();
      cubie.rotation.set(0, 0, 0);
    });
  }

  public generateScramble(length = 20): string[] {
    const faces = ['U', 'D', 'L', 'R', 'F', 'B'];
    const modifiers = ['', "'", '2'];
    const scramble: string[] = [];
    let lastFace = '';

    for (let i = 0; i < length; i++) {
      let face = faces[Math.floor(Math.random() * faces.length)];
      while (face === lastFace) {
        face = faces[Math.floor(Math.random() * faces.length)];
      }
      lastFace = face;
      const mod = modifiers[Math.floor(Math.random() * modifiers.length)];
      scramble.push(`${face}${mod}`);
    }

    return scramble;
  }

  private bindEvents(): void {
    const dom = this.renderer.domElement;

    // Window resize
    window.addEventListener('resize', this.onResize);

    // Mouse / touch interaction on the cube faces
    dom.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
  }

  private onResize = (): void => {
    if (this.isDestroyed || !this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private onPointerDown = (event: PointerEvent): void => {
    if (this.animating || event.button !== 0) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.cubies, false);

    if (intersects.length > 0) {
      const hit = intersects[0];
      if (hit.face) {
        // Disable orbit controls while initiating potential face drag
        const worldNormal = hit.face.normal
          .clone()
          .applyQuaternion(hit.object.quaternion)
          .normalize();

        this.dragStartData = {
          point: hit.point,
          normal: worldNormal,
          cubie: hit.object as THREE.Mesh,
          screenX: event.clientX,
          screenY: event.clientY,
        };
      }
    }
  };

  private onPointerMove = (event: PointerEvent): void => {
    if (!this.dragStartData || this.animating) return;

    const dx = event.clientX - this.dragStartData.screenX;
    const dy = event.clientY - this.dragStartData.screenY;
    const distSq = dx * dx + dy * dy;

    // Threshold for drag gesture: 25px
    if (distSq > 600 && !this.isDraggingCubeFace) {
      this.isDraggingCubeFace = true;
      this.controls.enabled = false;

      // Determine move based on cubie pos, face normal, and 2D drag direction
      this.handleFaceDrag(dx, dy);
      this.dragStartData = null;
    }
  };

  private onPointerUp = (): void => {
    this.dragStartData = null;
    this.isDraggingCubeFace = false;
    this.controls.enabled = true;
  };

  private handleFaceDrag(dx: number, dy: number): void {
    if (!this.dragStartData) return;
    const { normal, cubie } = this.dragStartData;
    const pos = cubie.position;

    // Compute dominant direction on screen vs 3D axes
    // A simplified intuitive mapping for user dragging:
    // If dragging mostly horizontal vs vertical:
    const isHorizontal = Math.abs(dx) > Math.abs(dy);

    // Front face (Z = 1)
    if (Math.abs(normal.z) > 0.8) {
      if (normal.z > 0) {
        // Front
        if (isHorizontal) {
          // Horizontal drag on Front face turns layer Y
          const move = Math.round(pos.y) === 1 ? (dx > 0 ? 'U' : "U'") : Math.round(pos.y) === -1 ? (dx > 0 ? "D'" : 'D') : null;
          if (move) this.executeMove(move);
        } else {
          // Vertical drag on Front face turns layer X
          const move = Math.round(pos.x) === 1 ? (dy < 0 ? 'R' : "R'") : Math.round(pos.x) === -1 ? (dy < 0 ? "L'" : 'L') : null;
          if (move) this.executeMove(move);
        }
      }
    } else if (Math.abs(normal.x) > 0.8) {
      // Right / Left face
      if (normal.x > 0) {
        // Right face
        if (isHorizontal) {
          const move = Math.round(pos.y) === 1 ? (dx > 0 ? 'U' : "U'") : Math.round(pos.y) === -1 ? (dx > 0 ? "D'" : 'D') : null;
          if (move) this.executeMove(move);
        } else {
          const move = Math.round(pos.z) === 1 ? (dy < 0 ? 'F' : "F'") : Math.round(pos.z) === -1 ? (dy < 0 ? "B'" : 'B') : null;
          if (move) this.executeMove(move);
        }
      }
    } else if (Math.abs(normal.y) > 0.8) {
      // Up / Down face
      if (normal.y > 0) {
        // Up face
        if (isHorizontal) {
          const move = Math.round(pos.z) === 1 ? (dx > 0 ? 'F' : "F'") : Math.round(pos.z) === -1 ? (dx > 0 ? "B'" : 'B') : null;
          if (move) this.executeMove(move);
        } else {
          const move = Math.round(pos.x) === 1 ? (dy < 0 ? 'R' : "R'") : Math.round(pos.x) === -1 ? (dy < 0 ? "L'" : 'L') : null;
          if (move) this.executeMove(move);
        }
      }
    }
  }

  private animate = (): void => {
    if (this.isDestroyed) return;
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  public dispose(): void {
    this.isDestroyed = true;
    window.removeEventListener('resize', this.onResize);
    const dom = this.renderer.domElement;
    dom.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    this.controls.dispose();
    this.renderer.dispose();
    if (dom.parentElement) {
      dom.parentElement.removeChild(dom);
    }
  }
}
