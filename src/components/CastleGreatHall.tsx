import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Scroll, 
  BookOpen, 
  Shield, 
  Flame, 
  Sparkles, 
  HelpCircle, 
  X,
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Maximize2
} from 'lucide-react';

interface CastleGreatHallProps {
  onOpenTapestry: () => void;
  onOpenPoems: () => void;
  onOpenHousehold: () => void;
  onOpenOC: () => void;
  onOpenBastionGate: () => void;
}

interface InteractiveObject {
  id: string;
  name: string;
  type: 'tapestry' | 'bookshelf' | 'armor' | 'altar' | 'throne' | 'door' | 'standard' | 'portrait';
  x: number;
  y: number;
  width: number;
  height: number;
  prompt: string;
  hint: string;
  action: () => void;
}

export default function CastleGreatHall({ 
  onOpenTapestry, 
  onOpenPoems, 
  onOpenHousehold, 
  onOpenOC,
  onOpenBastionGate 
}: CastleGreatHallProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Active interaction near player
  const [activeInteractable, setActiveInteractable] = useState<InteractiveObject | null>(null);
  const [loreNotification, setLoreNotification] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  // Player position and state in world coordinates
  const playerRef = useRef({
    x: 600,
    y: 560,
    vx: 0,
    vy: 0,
    speed: 3.2,
    direction: 'down' as 'up' | 'down' | 'left' | 'right',
    animFrame: 0,
    animTimer: 0,
    isMoving: false,
    width: 24,
    height: 32
  });

  // Target position for click-to-move / touch-to-move
  const moveTargetRef = useRef<{ x: number; y: number } | null>(null);

  // Camera coordinates (top-left of view)
  const cameraRef = useRef({ x: 0, y: 0 });

  // Input states
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const joystickVector = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isTouchingJoystick = useRef(false);

  // World dimensions
  const WORLD_WIDTH = 1200;
  const WORLD_HEIGHT = 800;

  // Static collision boxes (Walls, Pillars, Tables, Relics, Throne, Bookcase)
  const collisionBoxes: { x: number; y: number; width: number; height: number }[] = [
    // Outer walls boundary
    { x: 40, y: 30, width: WORLD_WIDTH - 80, height: 85 }, // North wall
    { x: 40, y: 30, width: 45, height: WORLD_HEIGHT - 60 }, // West wall
    { x: WORLD_WIDTH - 85, y: 30, width: 45, height: WORLD_HEIGHT - 60 }, // East wall
    { x: 40, y: WORLD_HEIGHT - 80, width: 440, height: 60 }, // South wall left
    { x: WORLD_WIDTH - 480, y: WORLD_HEIGHT - 80, width: 440, height: 60 }, // South wall right

    // Castle Grand Pillars
    { x: 280, y: 220, width: 48, height: 56 },
    { x: 280, y: 440, width: 48, height: 56 },
    { x: 870, y: 220, width: 48, height: 56 },
    { x: 870, y: 440, width: 48, height: 56 },

    // The Obsidian High Throne Dais (Top center - moved down to y: 80)
    { x: 520, y: 75, width: 160, height: 75 },

    // Scriptorum Bookshelf (North wall next to tapestry on the left)
    { x: 120, y: 40, width: 75, height: 75 },

    // The War Table (Moved all the way right against the east wall)
    { x: 925, y: 330, width: 170, height: 75 },

    // Relic Armor Stand flanking south entrance on left
    { x: 450, y: 660, width: 45, height: 60 },

    // Household Standard flanking south entrance on right
    { x: 710, y: 660, width: 45, height: 60 }
  ];

  // Interactive Objects definitions
  const interactablesRef = useRef<InteractiveObject[]>([]);
  interactablesRef.current = [
    {
      id: 'throne',
      name: 'The Obsidian High Throne',
      type: 'throne',
      x: 600,
      y: 150,
      width: 100,
      height: 70,
      prompt: 'Ascend the High Throne',
      hint: 'The grand seat of authority atop the marble dais',
      action: () => {
        setLoreNotification(
          "The gilded throne of ancient stone,\nIs not for thee to claim alone;\nThy deeds are few, thy blade untried,\nReturn when glory breaks thy pride."
        );
      }
    },
    {
      id: 'tapestry',
      name: 'The Great Tapestry of Exile',
      type: 'tapestry',
      x: 320,
      y: 110,
      width: 170,
      height: 60,
      prompt: 'Examine Tapestry Scroll',
      hint: 'The grand embroidered chronicle of the Freeblade Knight',
      action: onOpenTapestry
    },
    {
      id: 'bookshelf',
      name: 'The Canticles',
      type: 'bookshelf',
      x: 155,
      y: 115,
      width: 75,
      height: 65,
      prompt: 'Read The Canticles',
      hint: 'Ancient illuminated tomes containing poems and battle hymns',
      action: onOpenPoems
    },
    {
      id: 'portrait',
      name: 'The Current Lord',
      type: 'portrait',
      x: 820,
      y: 110,
      width: 70,
      height: 70,
      prompt: 'Inspect Current Lord',
      hint: 'Illuminated oil portrait and folio of the Lord of the Keep',
      action: onOpenOC
    },
    {
      id: 'door',
      name: 'Iron-Bound Bastion Gate',
      type: 'door',
      x: 1040,
      y: 110,
      width: 80,
      height: 60,
      prompt: 'Access Bastion Gate (Waypoints)',
      hint: 'Heavy arched oak gate leading to the Barracks, Stables, and Treasury',
      action: onOpenBastionGate
    },
    {
      id: 'table',
      name: 'Crusade Strategy Table',
      type: 'altar',
      x: 1005,
      y: 370,
      width: 170,
      height: 70,
      prompt: 'Study War Maps',
      hint: 'Parchment sector maps of Hive World Tertium and surrounding sub-sectors.',
      action: () => {
        setLoreNotification(
          "The strategic map charts the fall of Hive Tertium and the silent path taken by the Blank Shield across the toxic wastes."
        );
      }
    },
    {
      id: 'armor',
      name: 'Relic Knight Cuirass',
      type: 'armor',
      x: 470,
      y: 690,
      width: 60,
      height: 60,
      prompt: 'Inspect Relic Armor',
      hint: 'Scorched ceramite bearing the glory of past deeds',
      action: () => {
        setLoreNotification(
          "Upon this steel mine eyes are cast,\nTo weigh the glories of the past.\n\n⚜ Current Glory: 100\n⚔ Current Force: 100%"
        );
      }
    },
    {
      id: 'standard',
      name: 'Household Battle Standard',
      type: 'standard',
      x: 730,
      y: 690,
      width: 60,
      height: 60,
      prompt: 'Inspect Household Standard',
      hint: 'The heraldic battle standard and lineage history',
      action: onOpenHousehold
    }
  ];

  // Clear lore notification timer
  useEffect(() => {
    if (loreNotification) {
      const timer = setTimeout(() => {
        setLoreNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loreNotification]);

  // Handle Keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling on arrow keys and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      keysPressed.current[e.code] = true;
      keysPressed.current[e.key.toLowerCase()] = true;

      // Interaction trigger: E, Space, or Enter
      if (e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter') {
        if (activeInteractable) {
          activeInteractable.action();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeInteractable]);

  // Click / Tap to move logic
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickCanvasX = (e.clientX - rect.x) * scaleX;
    const clickCanvasY = (e.clientY - rect.y) * scaleY;

    // Convert to world coordinates
    const worldX = clickCanvasX + cameraRef.current.x;
    const worldY = clickCanvasY + cameraRef.current.y;

    // Check if clicked near an interactable object directly
    const clickedInteractable = interactablesRef.current.find(obj => {
      const dx = Math.abs(worldX - obj.x);
      const dy = Math.abs(worldY - obj.y);
      return dx < obj.width / 2 + 30 && dy < obj.height / 2 + 30;
    });

    if (clickedInteractable) {
      // Set target to walk towards it
      moveTargetRef.current = { x: clickedInteractable.x, y: clickedInteractable.y + 35 };
      const player = playerRef.current;
      const dist = Math.hypot(player.x - clickedInteractable.x, player.y - clickedInteractable.y);
      if (dist < 80) {
        clickedInteractable.action();
      }
    } else {
      moveTargetRef.current = { x: worldX, y: worldY };
    }
  };

  // Main Game Loop
  useEffect(() => {
    let animationFrameId: number;
    let torchTick = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Responsive Canvas Resize
    const updateCanvasSize = () => {
      if (containerRef.current && canvas) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      }
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Collision check helper
    const checkCollision = (newX: number, newY: number, radius: number = 12) => {
      for (const box of collisionBoxes) {
        if (
          newX + radius > box.x &&
          newX - radius < box.x + box.width &&
          newY + radius > box.y &&
          newY - radius < box.y + box.height
        ) {
          return true; // Collision detected
        }
      }
      return false;
    };

    // Game loop tick
    const loop = () => {
      if (!canvas || canvas.width <= 0 || canvas.height <= 0) {
        updateCanvasSize();
        animationFrameId = requestAnimationFrame(loop);
        return;
      }

      torchTick += 0.08;
      const player = playerRef.current;

      // 1. Calculate Input Directions
      let inputX = 0;
      let inputY = 0;

      const keys = keysPressed.current;
      if (keys['KeyW'] || keys['ArrowUp'] || keys['w']) inputY -= 1;
      if (keys['KeyS'] || keys['ArrowDown'] || keys['s']) inputY += 1;
      if (keys['KeyA'] || keys['ArrowLeft'] || keys['a']) inputX -= 1;
      if (keys['KeyD'] || keys['ArrowRight'] || keys['d']) inputX += 1;

      // Joystick input override if active
      if (isTouchingJoystick.current && (joystickVector.current.x !== 0 || joystickVector.current.y !== 0)) {
        inputX = joystickVector.current.x;
        inputY = joystickVector.current.y;
      }

      // Click to move resolution
      if (moveTargetRef.current && inputX === 0 && inputY === 0) {
        const dx = moveTargetRef.current.x - player.x;
        const dy = moveTargetRef.current.y - player.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 5) {
          inputX = dx / dist;
          inputY = dy / dist;
        } else {
          moveTargetRef.current = null;
        }
      } else if (inputX !== 0 || inputY !== 0) {
        // Cancel target if user pressed manual keys
        moveTargetRef.current = null;
      }

      // Normalize diagonal speed
      const len = Math.hypot(inputX, inputY);
      if (len > 0) {
        inputX = (inputX / len) * player.speed;
        inputY = (inputY / len) * player.speed;
        player.isMoving = true;

        // Set facing direction
        if (Math.abs(inputX) > Math.abs(inputY)) {
          player.direction = inputX > 0 ? 'right' : 'left';
        } else {
          player.direction = inputY > 0 ? 'down' : 'up';
        }

        // Animation cycling
        player.animTimer += 0.2;
        if (player.animTimer > 1) {
          player.animFrame = (player.animFrame + 1) % 4;
          player.animTimer = 0;
        }
      } else {
        player.isMoving = false;
        player.animFrame = 0;
      }

      // 2. Perform Movement with sliding collision
      const newX = player.x + inputX;
      const newY = player.y + inputY;

      if (!checkCollision(newX, player.y)) {
        player.x = newX;
      }
      if (!checkCollision(player.x, newY)) {
        player.y = newY;
      }

      // Clamp player within world bounds
      player.x = Math.max(70, Math.min(WORLD_WIDTH - 70, player.x));
      player.y = Math.max(120, Math.min(WORLD_HEIGHT - 70, player.y));

      // 3. Smooth Camera Follow
      const targetCamX = player.x - canvas.width / 2;
      const targetCamY = player.y - canvas.height / 2;

      // Max camera bounds
      const maxCamX = Math.max(0, WORLD_WIDTH - canvas.width);
      const maxCamY = Math.max(0, WORLD_HEIGHT - canvas.height);

      const clampedCamX = Math.max(0, Math.min(maxCamX, targetCamX));
      const clampedCamY = Math.max(0, Math.min(maxCamY, targetCamY));

      // Camera lerp
      cameraRef.current.x += (clampedCamX - cameraRef.current.x) * 0.1;
      cameraRef.current.y += (clampedCamY - cameraRef.current.y) * 0.1;

      const camX = cameraRef.current.x;
      const camY = cameraRef.current.y;

      // 4. Check Nearest Interactable Object
      let nearest: InteractiveObject | null = null;
      let minDistance = 75; // Activation radius

      for (const obj of interactablesRef.current) {
        const dist = Math.hypot(player.x - obj.x, player.y - obj.y);
        if (dist < minDistance) {
          nearest = obj;
          minDistance = dist;
        }
      }
      setActiveInteractable(nearest);

      // ==========================================
      // RENDER PASSES
      // ==========================================
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Enable crisp pixel-art styling
      ctx.imageSmoothingEnabled = false;

      ctx.save();
      ctx.translate(-Math.floor(camX), -Math.floor(camY));

      // --- LAYER 1: FLOOR & ARCHITECTURE ---
      // Base Floor
      ctx.fillStyle = '#141216';
      ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

      // Flagstone grid tiles
      const tileSize = 48;
      for (let x = 60; x < WORLD_WIDTH - 60; x += tileSize) {
        for (let y = 100; y < WORLD_HEIGHT - 60; y += tileSize) {
          const pseudoRandom = ((x * 13 + y * 37) % 7);
          
          if (pseudoRandom === 0) ctx.fillStyle = '#19161c';
          else if (pseudoRandom === 1) ctx.fillStyle = '#161318';
          else if (pseudoRandom === 2) ctx.fillStyle = '#1c1822';
          else ctx.fillStyle = '#17141a';

          ctx.fillRect(x, y, tileSize - 2, tileSize - 2);

          // Subtle mortar border
          ctx.strokeStyle = '#0d0b0f';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, tileSize, tileSize);
        }
      }

      // Grand Center Carpet / Runner leading to the Great Tapestry
      const carpetGrad = ctx.createLinearGradient(530, 0, 670, 0);
      carpetGrad.addColorStop(0, '#3a1215');
      carpetGrad.addColorStop(0.5, '#5c191e');
      carpetGrad.addColorStop(1, '#3a1215');
      ctx.fillStyle = carpetGrad;
      ctx.fillRect(530, 110, 140, WORLD_HEIGHT - 170);

      // Gold stitching on carpet
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.strokeRect(536, 112, 128, WORLD_HEIGHT - 174);
      ctx.setLineDash([]);

      // Imperial Aquila / Freeblade Crest painted on central carpet
      ctx.fillStyle = 'rgba(212, 175, 55, 0.25)';
      ctx.beginPath();
      ctx.arc(600, 480, 45, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.stroke();

      // --- LAYER 2: WALLS & STRUCTURES ---
      // Outer North Wall
      const wallGrad = ctx.createLinearGradient(0, 0, 0, 110);
      wallGrad.addColorStop(0, '#0c0a0e');
      wallGrad.addColorStop(0.7, '#1b1720');
      wallGrad.addColorStop(1, '#2a2432');
      ctx.fillStyle = wallGrad;
      ctx.fillRect(40, 30, WORLD_WIDTH - 80, 85);

      // Upper Stone Wall Moldings & Battlements
      ctx.fillStyle = '#352e3d';
      ctx.fillRect(40, 25, WORLD_WIDTH - 80, 12);
      ctx.fillStyle = '#0f0c13';
      ctx.fillRect(40, 110, WORLD_WIDTH - 80, 6);

      // West Wall
      ctx.fillStyle = '#17131c';
      ctx.fillRect(40, 30, 40, WORLD_HEIGHT - 60);

      // East Wall
      ctx.fillStyle = '#17131c';
      ctx.fillRect(WORLD_WIDTH - 80, 30, 40, WORLD_HEIGHT - 60);

      // South Entry Hall Walls
      ctx.fillStyle = '#1b1720';
      ctx.fillRect(40, WORLD_HEIGHT - 80, 440, 40);
      ctx.fillRect(WORLD_WIDTH - 480, WORLD_HEIGHT - 80, 440, 40);

      // South Grand Archway Exit (Gate to the Bastion)
      ctx.fillStyle = '#080709';
      ctx.fillRect(480, WORLD_HEIGHT - 70, 240, 40);
      ctx.strokeStyle = '#3e3223';
      ctx.lineWidth = 4;
      ctx.strokeRect(480, WORLD_HEIGHT - 70, 240, 40);

      // --- LAYER 3: INTERACTIVE OBJECT SPRITES ---
      
      // A. THE OBSIDIAN HIGH THRONE & DAIS (North Wall Center - Top of Red Carpet)
      const thX = 600;
      const thY = 85;

      // Dais Stone Steps (3 tiers)
      ctx.fillStyle = '#110e14';
      ctx.fillRect(thX - 80, thY + 45, 160, 26); // Bottom step
      ctx.strokeStyle = '#3e3223';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(thX - 80, thY + 45, 160, 26);
      
      ctx.fillStyle = '#17131b';
      ctx.fillRect(thX - 65, thY + 30, 130, 20); // Middle step
      ctx.strokeRect(thX - 65, thY + 30, 130, 20);

      ctx.fillStyle = '#201b26';
      ctx.fillRect(thX - 50, thY + 15, 100, 20); // Top step
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1;
      ctx.strokeRect(thX - 50, thY + 15, 100, 20);

      // Crossed ceremonial relic broadswords behind the throne on wall
      ctx.strokeStyle = '#7c8394';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(thX - 35, thY - 5);
      ctx.lineTo(thX + 35, thY + 35);
      ctx.moveTo(thX + 35, thY - 5);
      ctx.lineTo(thX - 35, thY + 35);
      ctx.stroke();

      // Sword gold hilts
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(thX - 38, thY - 8, 8, 4);
      ctx.fillRect(thX + 30, thY - 8, 8, 4);

      // Throne High Backrest (Gothic Spire Arch)
      const throneGrad = ctx.createLinearGradient(thX - 26, thY, thX + 26, thY);
      throneGrad.addColorStop(0, '#151218');
      throneGrad.addColorStop(0.5, '#2e2636');
      throneGrad.addColorStop(1, '#151218');
      ctx.fillStyle = throneGrad;
      
      // Gothic pointed arch back
      ctx.beginPath();
      ctx.moveTo(thX - 24, thY + 40);
      ctx.lineTo(thX - 24, thY + 5);
      ctx.lineTo(thX, thY - 12);
      ctx.lineTo(thX + 24, thY + 5);
      ctx.lineTo(thX + 24, thY + 40);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Crimson Velvet Back Cushion
      ctx.fillStyle = '#5c1017';
      ctx.beginPath();
      ctx.moveTo(thX - 16, thY + 38);
      ctx.lineTo(thX - 16, thY + 10);
      ctx.lineTo(thX, thY - 2);
      ctx.lineTo(thX + 16, thY + 10);
      ctx.lineTo(thX + 16, thY + 38);
      ctx.closePath();
      ctx.fill();

      // Gold Tufting buttons on velvet
      ctx.fillStyle = '#e5c158';
      ctx.fillRect(thX - 8, thY + 14, 2, 2);
      ctx.fillRect(thX + 6, thY + 14, 2, 2);
      ctx.fillRect(thX - 8, thY + 24, 2, 2);
      ctx.fillRect(thX + 6, thY + 24, 2, 2);

      // Solid Obsidian Seat & Armrests
      ctx.fillStyle = '#1c1722';
      ctx.fillRect(thX - 28, thY + 32, 56, 16); // Seat base
      ctx.strokeStyle = '#5a462b';
      ctx.lineWidth = 2;
      ctx.strokeRect(thX - 28, thY + 32, 56, 16);

      // Armrests with carved gold lion heads
      ctx.fillStyle = '#2b2333';
      ctx.fillRect(thX - 30, thY + 24, 8, 22);
      ctx.fillRect(thX + 22, thY + 24, 8, 22);
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(thX - 31, thY + 22, 10, 5); // Left finial
      ctx.fillRect(thX + 21, thY + 22, 10, 5); // Right finial

      // Seat Crimson Cushion
      ctx.fillStyle = '#6b131c';
      ctx.fillRect(thX - 20, thY + 32, 40, 10);

      // Throne Dais Hover Highlight
      if (nearest?.id === 'throne') {
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.85)';
        ctx.lineWidth = 3;
        ctx.strokeRect(thX - 52, thY - 14, 104, 86);
      }

      // B. THE GRAND TAPESTRY (North Wall - Above Left Pillars, x: 230 to 410)
      const tapX = 235;
      const tapY = 40;
      const tapW = 170;
      const tapH = 64;

      // Tapestry Suspension Rod (Forged dark iron with gold finials)
      ctx.fillStyle = '#111014';
      ctx.fillRect(tapX - 10, tapY - 4, tapW + 20, 6);
      ctx.fillStyle = '#d4af37';
      ctx.beginPath();
      ctx.arc(tapX - 10, tapY - 1, 5, 0, Math.PI * 2); // Left rod finial
      ctx.arc(tapX + tapW + 10, tapY - 1, 5, 0, Math.PI * 2); // Right rod finial
      ctx.fill();

      // Hanging Brass / Iron Rings
      ctx.strokeStyle = '#c5a046';
      ctx.lineWidth = 2;
      for (let r = 0; r < 7; r++) {
        const ringX = tapX + 15 + r * ((tapW - 30) / 6);
        ctx.beginPath();
        ctx.arc(ringX, tapY - 1, 3.5, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Woven Linen / Burlap Fabric Background
      const clothGrad = ctx.createLinearGradient(tapX, tapY + 2, tapX, tapY + tapH);
      clothGrad.addColorStop(0, '#dfceb4');
      clothGrad.addColorStop(0.5, '#ceb998');
      clothGrad.addColorStop(1, '#b8a07c');
      ctx.fillStyle = clothGrad;
      ctx.fillRect(tapX, tapY + 2, tapW, tapH - 6);

      // Woven Fabric Texture (Subtle vertical threads / warp lines)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      for (let tx = tapX + 3; tx < tapX + tapW; tx += 4) {
        ctx.fillRect(tx, tapY + 2, 1.5, tapH - 6);
      }

      // Authentic Bayeux-Style Cross-Stitch Borders (Top & Bottom)
      // Top Border
      ctx.fillStyle = '#6b1c22'; // Burgundy thread
      ctx.fillRect(tapX, tapY + 2, tapW, 5);
      ctx.fillStyle = '#2b4759'; // Indigo thread
      ctx.fillRect(tapX, tapY + 7, tapW, 3);
      
      // Bottom Border
      ctx.fillStyle = '#2b4759';
      ctx.fillRect(tapX, tapY + tapH - 12, tapW, 3);
      ctx.fillStyle = '#6b1c22';
      ctx.fillRect(tapX, tapY + tapH - 9, tapW, 5);

      // Gold cross stitches along top and bottom
      ctx.fillStyle = '#d4af37';
      for (let s = 0; s < tapW - 8; s += 8) {
        ctx.fillRect(tapX + 4 + s, tapY + 4, 3, 2);
        ctx.fillRect(tapX + 4 + s, tapY + tapH - 7, 3, 2);
      }

      // Embroidered Medieval Scene on Fabric (Knight, Mount, Banner, Monster)
      // 1. Knight Errant with Lance & Shield
      ctx.fillStyle = '#3c2415'; // Horse brown thread
      ctx.fillRect(tapX + 22, tapY + 26, 24, 14);
      ctx.fillRect(tapX + 18, tapY + 18, 10, 16); // Horse neck
      ctx.fillStyle = '#5c141c'; // Saddle red
      ctx.fillRect(tapX + 28, tapY + 22, 10, 8);
      
      ctx.fillStyle = '#363b47'; // Armored rider
      ctx.fillRect(tapX + 30, tapY + 12, 8, 14);
      ctx.fillStyle = '#c5a046'; // Helm
      ctx.fillRect(tapX + 31, tapY + 9, 6, 6);

      // Lance / Spear
      ctx.strokeStyle = '#221911';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(tapX + 24, tapY + 22);
      ctx.lineTo(tapX + 68, tapY + 14);
      ctx.stroke();

      // Lance Pennon (Forked heraldic banner)
      ctx.fillStyle = '#8f232b';
      ctx.beginPath();
      ctx.moveTo(tapX + 60, tapY + 15);
      ctx.lineTo(tapX + 72, tapY + 12);
      ctx.lineTo(tapX + 66, tapY + 17);
      ctx.lineTo(tapX + 72, tapY + 22);
      ctx.closePath();
      ctx.fill();

      // 2. Central Feudal Heraldic Tree / Shrine
      ctx.fillStyle = '#2f452a'; // Green embroidery
      ctx.fillRect(tapX + 82, tapY + 14, 16, 24);
      ctx.fillStyle = '#422818';
      ctx.fillRect(tapX + 88, tapY + 26, 4, 14);

      // 3. Embroidered Great Dragon / Monster
      ctx.fillStyle = '#1e3328';
      ctx.fillRect(tapX + 115, tapY + 20, 26, 16); // Beast body
      ctx.fillRect(tapX + 135, tapY + 15, 12, 12); // Beast head
      ctx.fillStyle = '#9e2b2b';
      ctx.fillRect(tapX + 144, tapY + 19, 6, 3); // Fiery tongue

      // 4. Latin Titulus Banner on Tapestry
      ctx.fillStyle = '#221811';
      ctx.font = 'bold 7px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText('HIC EXSILIVM EQVITIS PRAEDICATVR', tapX + tapW / 2, tapY + 16);

      // Scalloped Cloth Bottom with Gold Thread Tassels & Fringes
      ctx.fillStyle = '#b8a07c';
      for (let f = 0; f < tapW; f += 10) {
        ctx.beginPath();
        ctx.moveTo(tapX + f, tapY + tapH - 4);
        ctx.lineTo(tapX + f + 5, tapY + tapH + 4);
        ctx.lineTo(tapX + f + 10, tapY + tapH - 4);
        ctx.closePath();
        ctx.fill();

        // Little gold thread fringe at tip
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(tapX + f + 4, tapY + tapH + 4, 2, 4);
        ctx.fillStyle = '#b8a07c';
      }

      // Tapestry Label Placard above
      ctx.fillStyle = '#140f0a';
      ctx.fillRect(tapX + 15, tapY - 16, tapW - 30, 14);
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1;
      ctx.strokeRect(tapX + 15, tapY - 16, tapW - 30, 14);
      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 8.5px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText('✦ THE TAPESTRY OF EXILE ✦', tapX + tapW / 2, tapY - 6);

      // Tapestry Glow on Proximity
      if (nearest?.id === 'tapestry') {
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.85)';
        ctx.lineWidth = 3;
        ctx.strokeRect(tapX - 6, tapY - 8, tapW + 12, tapH + 20);
      }

      // C. THE SCRIPTORUM BOOKCASE (North Wall Left - Next to Tapestry, x: 120 to 195)
      const bkX = 125;
      const bkY = 40;
      const bkW = 70;
      const bkH = 74;

      // Dark Carved Walnut Cabinet
      ctx.fillStyle = '#1f130a';
      ctx.fillRect(bkX, bkY, bkW, bkH);
      ctx.strokeStyle = '#4a301a';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(bkX, bkY, bkW, bkH);

      // Gothic Pointed Arch Cresting atop bookcase
      ctx.fillStyle = '#2d1a0d';
      ctx.beginPath();
      ctx.moveTo(bkX - 2, bkY);
      ctx.lineTo(bkX + bkW / 2, bkY - 10);
      ctx.lineTo(bkX + bkW + 2, bkY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Shelves with books and scrolls
      for (let s = 0; s < 3; s++) {
        const shelfY = bkY + 8 + s * 21;
        
        // Wood shelf plank
        ctx.fillStyle = '#3d2514';
        ctx.fillRect(bkX + 3, shelfY + 16, bkW - 6, 3);

        // Books on shelf
        const colors = ['#872424', '#204761', '#856f24', '#285e34', '#4b2563', '#9c5223'];
        for (let b = 0; b < 7; b++) {
          ctx.fillStyle = colors[(s * 3 + b) % colors.length];
          const bookHeight = 12 + ((b * 7 + s) % 4);
          ctx.fillRect(bkX + 5 + b * 8.5, shelfY + 16 - bookHeight, 6.5, bookHeight);
          
          // Gold title line on spine
          ctx.fillStyle = '#d4af37';
          ctx.fillRect(bkX + 6.5 + b * 8.5, shelfY + 16 - bookHeight + 3, 3.5, 1.5);
        }
      }

      // Brass Candlestick with flickering flame on bookcase
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(bkX + bkW - 18, bkY - 4, 6, 4); // Brass base
      ctx.fillStyle = '#e8dec8';
      ctx.fillRect(bkX + bkW - 16, bkY - 14, 2.5, 10); // Wax candle
      
      // Candle Flame
      const candleFlicker = Math.sin(torchTick * 3 + bkX) * 1.5;
      ctx.fillStyle = '#ff9900';
      ctx.beginPath();
      ctx.arc(bkX + bkW - 14.5, bkY - 16 + candleFlicker, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffff66';
      ctx.beginPath();
      ctx.arc(bkX + bkW - 14.5, bkY - 16 + candleFlicker, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Bookshelf Label
      ctx.fillStyle = '#140f0a';
      ctx.fillRect(bkX, bkY + bkH + 2, bkW, 13);
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1;
      ctx.strokeRect(bkX, bkY + bkH + 2, bkW, 13);
      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 7.5px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText('THE CANTICLES', bkX + bkW / 2, bkY + bkH + 11);

      if (nearest?.id === 'bookshelf') {
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.85)';
        ctx.lineWidth = 3;
        ctx.strokeRect(bkX - 4, bkY - 12, bkW + 8, bkH + 28);
      }

      // D. ILLUMINATED OIL PORTRAIT OF THE CURRENT LORD (North Wall - Between Throne & Door, x: 805 to 865)
      const portX = 808;
      const portY = 36;
      const portW = 58;
      const portH = 70;

      // Wall Hanging Wire & Gilded Rosette Mount (Above Frame)
      ctx.fillStyle = '#b89738';
      ctx.beginPath();
      ctx.arc(portX + portW / 2, portY - 10, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#856f4d';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(portX + portW / 2, portY - 10);
      ctx.lineTo(portX + 8, portY - 4);
      ctx.moveTo(portX + portW / 2, portY - 10);
      ctx.lineTo(portX + portW - 8, portY - 4);
      ctx.stroke();

      // Ornate Heavy Gilded Baroque Frame with Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(portX - 4, portY - 2, portW + 12, portH + 12);

      // Outer Frame (Deep Gold / Antique Bronze)
      ctx.fillStyle = '#261b0d';
      ctx.fillRect(portX - 5, portY - 5, portW + 10, portH + 10);
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(portX - 5, portY - 5, portW + 10, portH + 10);
      
      // Carved Corner Cornerpieces / Rosettes on Frame
      ctx.fillStyle = '#f0c75e';
      ctx.fillRect(portX - 6, portY - 6, 4, 4);
      ctx.fillRect(portX + portW + 2, portY - 6, 4, 4);
      ctx.fillRect(portX - 6, portY + portH + 2, 4, 4);
      ctx.fillRect(portX + portW + 2, portY + portH + 2, 4, 4);

      // Inner Frame Beveled Lip
      ctx.strokeStyle = '#856f4d';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(portX - 1.5, portY - 1.5, portW + 3, portH + 3);

      // Rich Aged Oil Canvas Background (Chiaroscuro Umber to Warm Light)
      const portCanvasGrad = ctx.createRadialGradient(
        portX + 18, portY + 22, 2,
        portX + portW / 2, portY + portH / 2, portW * 0.8
      );
      portCanvasGrad.addColorStop(0, '#4a2c1d'); // Warm torchlit glow in background
      portCanvasGrad.addColorStop(0.4, '#24140c'); // Rich burnt umber
      portCanvasGrad.addColorStop(1, '#0c0705'); // Deep shadowed edge
      ctx.fillStyle = portCanvasGrad;
      ctx.fillRect(portX, portY, portW, portH);

      // Fine Canvas Texture Grid Lines (Subtle oil weave)
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      for (let cy = portY + 3; cy < portY + portH; cy += 3) {
        ctx.fillRect(portX, cy, portW, 0.5);
      }

      // --- PAINTED LORD OIL BUST ---
      const bustCenterX = portX + portW / 2;
      const headCenterY = portY + 23;

      // 1. Mantle & Shoulders (Dark Velvet & Ermine Trim)
      // Dark Blue-Black Noble Doublet
      ctx.fillStyle = '#141219';
      ctx.beginPath();
      ctx.moveTo(bustCenterX - 22, portY + portH - 4);
      ctx.lineTo(bustCenterX - 14, portY + 35);
      ctx.lineTo(bustCenterX + 14, portY + 35);
      ctx.lineTo(bustCenterX + 22, portY + portH - 4);
      ctx.closePath();
      ctx.fill();

      // White / Cream Ermine Fur Collar Trim
      ctx.fillStyle = '#eae3d5';
      ctx.beginPath();
      ctx.ellipse(bustCenterX, portY + 36, 15, 6, 0, 0, Math.PI);
      ctx.fill();
      // Ermine black tails
      ctx.fillStyle = '#1c1512';
      ctx.fillRect(bustCenterX - 8, portY + 37, 2, 3);
      ctx.fillRect(bustCenterX, portY + 38, 2, 3);
      ctx.fillRect(bustCenterX + 7, portY + 37, 2, 3);

      // Crimson Chivalric Sash draped from right shoulder to left hip
      ctx.strokeStyle = '#852129';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(bustCenterX + 13, portY + 35);
      ctx.lineTo(bustCenterX - 12, portY + portH - 5);
      ctx.stroke();

      // Gold Embroidered Sash Border
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Golden Chivalric Chain of Office / Collar of Estate across chest
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(bustCenterX, portY + 34, 11, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();
      // Pendant Medallion
      ctx.fillStyle = '#d4af37';
      ctx.beginPath();
      ctx.arc(bustCenterX, portY + 45, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // 2. Neck & Stiff Lace Gorget
      ctx.fillStyle = '#c7b299'; // Neck skin
      ctx.fillRect(bustCenterX - 4, portY + 28, 8, 7);
      ctx.fillStyle = '#e8dec8'; // High white collar
      ctx.fillRect(bustCenterX - 6, portY + 30, 12, 3);

      // 3. Head & Face (Noble 3/4 Profile)
      // Head base skin tone
      ctx.fillStyle = '#b89476';
      ctx.beginPath();
      ctx.ellipse(bustCenterX, headCenterY, 8.5, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Face Shadow (Chiaroscuro on right side)
      ctx.fillStyle = 'rgba(38, 20, 10, 0.45)';
      ctx.beginPath();
      ctx.ellipse(bustCenterX + 3, headCenterY + 1, 5, 8.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Chiseled Jaw & Chin Highlight
      ctx.fillStyle = '#d4b494';
      ctx.beginPath();
      ctx.arc(bustCenterX - 2, headCenterY + 5, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Facial Features
      // Eyes & Brow line
      ctx.fillStyle = '#1c120c';
      ctx.fillRect(bustCenterX - 6, headCenterY - 2, 4, 1.2); // Left eyebrow
      ctx.fillRect(bustCenterX + 1, headCenterY - 2, 4, 1.2); // Right eyebrow
      
      // Intense Noble Eyes
      ctx.fillStyle = '#261b14';
      ctx.fillRect(bustCenterX - 5, headCenterY, 2.5, 1.5);
      ctx.fillRect(bustCenterX + 1.5, headCenterY, 2.5, 1.5);
      // Eye White & Torchlight Catchlight
      ctx.fillStyle = '#e0edf8';
      ctx.fillRect(bustCenterX - 4.5, headCenterY + 0.2, 1, 1);
      ctx.fillRect(bustCenterX + 2, headCenterY + 0.2, 1, 1);

      // Aquiline Noble Nose
      ctx.fillStyle = '#8f6848';
      ctx.beginPath();
      ctx.moveTo(bustCenterX - 1, headCenterY - 1);
      ctx.lineTo(bustCenterX - 1, headCenterY + 3);
      ctx.lineTo(bustCenterX + 1, headCenterY + 3);
      ctx.stroke();

      // Stern Mouth & Mustache
      ctx.fillStyle = '#2a1a12';
      ctx.fillRect(bustCenterX - 3.5, headCenterY + 5.5, 7, 1.2);

      // 4. Dark Regal Hair with Grey Temples
      ctx.fillStyle = '#1a1412';
      // Main hair volume
      ctx.beginPath();
      ctx.arc(bustCenterX, headCenterY - 4, 9, Math.PI, 0, false);
      ctx.fill();
      // Flowing side locks
      ctx.fillRect(bustCenterX - 9, headCenterY - 4, 3, 10);
      ctx.fillRect(bustCenterX + 6, headCenterY - 4, 3, 9);
      // Silver touch on temple
      ctx.fillStyle = '#9c938a';
      ctx.fillRect(bustCenterX - 8.5, headCenterY - 1, 1.5, 4);

      // 5. Subtle Oil Varnish Sheen (Diagonal glaze highlight)
      const sheenGrad = ctx.createLinearGradient(portX, portY, portX + portW, portY + portH);
      sheenGrad.addColorStop(0, 'rgba(255,255,255,0.08)');
      sheenGrad.addColorStop(0.4, 'rgba(255,255,255,0.14)');
      sheenGrad.addColorStop(0.55, 'rgba(255,255,255,0.0)');
      ctx.fillStyle = sheenGrad;
      ctx.fillRect(portX, portY, portW, portH);

      // 6. Gilded Brass Nameplate Placard Below Frame
      ctx.fillStyle = '#18120a';
      ctx.fillRect(portX - 4, portY + portH + 6, portW + 8, 13);
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(portX - 4, portY + portH + 6, portW + 8, 13);
      
      // Brass Corner Screws
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(portX - 2.5, portY + portH + 7.5, 1.5, 1.5);
      ctx.fillRect(portX + portW + 1, portY + portH + 7.5, 1.5, 1.5);
      ctx.fillRect(portX - 2.5, portY + portH + 15.5, 1.5, 1.5);
      ctx.fillRect(portX + portW + 1, portY + portH + 15.5, 1.5, 1.5);

      // Nameplate Inscription Text
      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 7.5px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText('CURRENT LORD', portX + portW / 2, portY + portH + 15.5);

      if (nearest?.id === 'portrait') {
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.9)';
        ctx.lineWidth = 3;
        ctx.strokeRect(portX - 8, portY - 8, portW + 16, portH + 30);
      }

      // E. HEAVY IRON-BOUND BASTION GATE (North Wall Right Hand Side, x: 1000 to 1080)
      const gateX = 1000;
      const gateY = 32;
      const gateW = 80;
      const gateH = 82;

      // Stone Archway Frame (Gothic pointed ashlar stones)
      ctx.fillStyle = '#1e1824';
      ctx.fillRect(gateX - 8, gateY, gateW + 16, gateH);
      ctx.strokeStyle = '#4a3d54';
      ctx.lineWidth = 3;
      ctx.strokeRect(gateX - 8, gateY, gateW + 16, gateH);

      // Keystone Arch Top
      ctx.fillStyle = '#2c2336';
      ctx.beginPath();
      ctx.moveTo(gateX - 10, gateY + 20);
      ctx.lineTo(gateX + gateW / 2, gateY - 6);
      ctx.lineTo(gateX + gateW + 10, gateY + 20);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Heavy Dark Oak Double Doors
      ctx.fillStyle = '#1a100a';
      ctx.fillRect(gateX, gateY + 10, gateW, gateH - 10);

      // Vertical Oak Planks
      ctx.strokeStyle = '#0d0805';
      ctx.lineWidth = 1.5;
      for (let px = gateX + 10; px < gateX + gateW; px += 10) {
        ctx.beginPath();
        ctx.moveTo(px, gateY + 10);
        ctx.lineTo(px, gateY + gateH);
        ctx.stroke();
      }

      // Heavy Horizontal Wrought-Iron Straps & Rivets
      ctx.fillStyle = '#28232c';
      ctx.fillRect(gateX, gateY + 22, gateW, 8); // Top iron band
      ctx.fillRect(gateX, gateY + 46, gateW, 8); // Middle iron band
      ctx.fillRect(gateX, gateY + 68, gateW, 8); // Bottom iron band

      // Iron Studs / Rivets
      ctx.fillStyle = '#8f8899';
      for (let rx = gateX + 5; rx < gateX + gateW; rx += 14) {
        ctx.fillRect(rx, gateY + 25, 3, 3);
        ctx.fillRect(rx, gateY + 49, 3, 3);
        ctx.fillRect(rx, gateY + 71, 3, 3);
      }

      // Massive Iron Lock Mechanism & Padlock Chain
      ctx.fillStyle = '#110e14';
      ctx.fillRect(gateX + gateW / 2 - 10, gateY + 42, 20, 16);
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1;
      ctx.strokeRect(gateX + gateW / 2 - 10, gateY + 42, 20, 16);
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(gateX + gateW / 2 - 2, gateY + 48, 4, 5); // Keyhole

      // Light glow leaking from underneath door threshold
      ctx.fillStyle = 'rgba(255, 170, 50, 0.45)';
      ctx.fillRect(gateX + 2, gateY + gateH - 2, gateW - 4, 3);

      // Door Inscription Lintel
      ctx.fillStyle = '#140f0a';
      ctx.fillRect(gateX + 6, gateY + 2, gateW - 12, 10);
      ctx.fillStyle = '#c5a046';
      ctx.font = 'bold 7px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText('PORTA PROFUNDIS', gateX + gateW / 2, gateY + 9);

      if (nearest?.id === 'door') {
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.85)';
        ctx.lineWidth = 3;
        ctx.strokeRect(gateX - 10, gateY - 8, gateW + 20, gateH + 16);
      }

      // F. THE WAR STRATEGY TABLE (Moved all the way to the East Wall, x: 930 to 1095)
      const tblX = 930;
      const tblY = 330;
      const tblW = 165;
      const tblH = 75;

      // Table Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(tblX + 6, tblY + 8, tblW, tblH);

      // Solid Oak Tabletop
      ctx.fillStyle = '#2a1a0f';
      ctx.fillRect(tblX, tblY, tblW, tblH);
      ctx.strokeStyle = '#4a301d';
      ctx.lineWidth = 3;
      ctx.strokeRect(tblX, tblY, tblW, tblH);

      // Parchment Maps scattered on table
      ctx.fillStyle = '#dfcead';
      ctx.fillRect(tblX + 15, tblY + 14, 65, 48);
      ctx.strokeStyle = '#856f4d';
      ctx.lineWidth = 1;
      ctx.strokeRect(tblX + 15, tblY + 14, 65, 48);

      // Map Grid and tactical lines
      ctx.strokeStyle = '#802626';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tblX + 22, tblY + 22);
      ctx.lineTo(tblX + 45, tblY + 38);
      ctx.lineTo(tblX + 70, tblY + 28);
      ctx.stroke();

      // Second map parchment
      ctx.fillStyle = '#c9b48f';
      ctx.fillRect(tblX + 90, tblY + 18, 55, 42);

      // Tactical Markers & Pewter Dagger
      ctx.fillStyle = '#9c2424'; // Red counter
      ctx.fillRect(tblX + 40, tblY + 30, 5, 5);
      ctx.fillStyle = '#204761'; // Blue counter
      ctx.fillRect(tblX + 60, tblY + 24, 5, 5);

      // Table Dagger
      ctx.fillStyle = '#7a8191';
      ctx.fillRect(tblX + 120, tblY + 28, 14, 3);
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(tblX + 117, tblY + 26, 4, 7);

      // Table Placard
      ctx.fillStyle = '#140f0a';
      ctx.fillRect(tblX + tblW / 2 - 45, tblY + tblH + 3, 90, 12);
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1;
      ctx.strokeRect(tblX + tblW / 2 - 45, tblY + tblH + 3, 90, 12);
      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 7px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText('CRUSADE MAPS', tblX + tblW / 2, tblY + tblH + 11);

      if (nearest?.id === 'table') {
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.85)';
        ctx.lineWidth = 3;
        ctx.strokeRect(tblX - 4, tblY - 4, tblW + 8, tblH + 8);
      }

      // G. RELIC ARMOR STAND (Flanking South Entrance Left, x: 450, y: 660)
      const armX = 450;
      const armY = 660;
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.beginPath();
      ctx.ellipse(armX + 22, armY + 54, 20, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Stone plinth pedestal
      ctx.fillStyle = '#1f1b24';
      ctx.fillRect(armX + 4, armY + 44, 36, 14);
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1;
      ctx.strokeRect(armX + 4, armY + 44, 36, 14);

      // Armor mannequin & carapace plating
      ctx.fillStyle = '#3b3842';
      ctx.fillRect(armX + 11, armY + 16, 22, 28); // Chestplate
      ctx.fillStyle = '#7a7685';
      ctx.fillRect(armX + 13, armY + 2, 18, 15); // Helm
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(armX + 13, armY + 1, 18, 2); // Helm crest
      ctx.fillStyle = '#a68b44';
      ctx.fillRect(armX + 20, armY + 18, 4, 24); // Blank shield stripe

      // Relic Armor Placard
      ctx.fillStyle = '#140f0a';
      ctx.fillRect(armX - 6, armY - 14, 56, 11);
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1;
      ctx.strokeRect(armX - 6, armY - 14, 56, 11);
      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 6.5px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText('RELIC ARMOR', armX + 22, armY - 6);

      if (nearest?.id === 'armor') {
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.85)';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(armX - 2, armY - 6, 48, 68);
      }

      // H. HOUSEHOLD BATTLE STANDARD (Flanking South Entrance Right, x: 710, y: 660)
      const stdX = 710;
      const stdY = 660;
      
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.beginPath();
      ctx.ellipse(stdX + 22, stdY + 54, 20, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Heavy Iron Base
      ctx.fillStyle = '#1e1824';
      ctx.fillRect(stdX + 6, stdY + 44, 32, 14);
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1;
      ctx.strokeRect(stdX + 6, stdY + 44, 32, 14);

      // Tall Forged Spear Staff
      ctx.fillStyle = '#3c2817';
      ctx.fillRect(stdX + 20, stdY - 18, 4, 62);
      
      // Gilded Imperial Eagle / Spearhead Finial
      ctx.fillStyle = '#d4af37';
      ctx.beginPath();
      ctx.moveTo(stdX + 22, stdY - 26);
      ctx.lineTo(stdX + 27, stdY - 18);
      ctx.lineTo(stdX + 17, stdY - 18);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(stdX + 16, stdY - 18, 12, 3); // Crossbar

      // Hanging Silk Heraldic Banner (Sable and Crimson quartered with gold cross)
      ctx.fillStyle = '#151319';
      ctx.fillRect(stdX + 24, stdY - 15, 24, 38);
      ctx.fillStyle = '#852129';
      ctx.fillRect(stdX + 36, stdY - 15, 12, 19);
      ctx.fillRect(stdX + 24, stdY + 4, 12, 19);
      
      // Gold Heraldic Crest Cross & Border
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(stdX + 24, stdY - 15, 24, 38);
      ctx.beginPath();
      ctx.moveTo(stdX + 36, stdY - 15);
      ctx.lineTo(stdX + 36, stdY + 23);
      ctx.moveTo(stdX + 24, stdY + 4);
      ctx.lineTo(stdX + 48, stdY + 4);
      ctx.stroke();

      // Gold Fringe Tassels at bottom of banner
      ctx.fillStyle = '#d4af37';
      for (let tf = stdX + 24; tf < stdX + 48; tf += 4) {
        ctx.fillRect(tf, stdY + 23, 2, 4);
      }

      // Standard Placard
      ctx.fillStyle = '#140f0a';
      ctx.fillRect(stdX - 6, stdY - 14, 56, 11);
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1;
      ctx.strokeRect(stdX - 6, stdY - 14, 56, 11);
      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 6.5px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText('HOUSEHOLD', stdX + 22, stdY - 6);

      if (nearest?.id === 'standard') {
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.85)';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(stdX - 2, stdY - 26, 54, 88);
      }

      // --- LAYER 4: GRAND PILLARS & STATUES ---
      const pillars = [
        { x: 280, y: 220 },
        { x: 280, y: 440 },
        { x: 870, y: 220 },
        { x: 870, y: 440 }
      ];

      for (const p of pillars) {
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.beginPath();
        ctx.ellipse(p.x + 24, p.y + 54, 26, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pillar Base
        ctx.fillStyle = '#211c26';
        ctx.fillRect(p.x - 4, p.y + 40, 56, 16);

        // Pillar Column
        const pGrad = ctx.createLinearGradient(p.x, p.y, p.x + 48, p.y);
        pGrad.addColorStop(0, '#1c1822');
        pGrad.addColorStop(0.5, '#3a3245');
        pGrad.addColorStop(1, '#1c1822');
        ctx.fillStyle = pGrad;
        ctx.fillRect(p.x, p.y, 48, 44);

        // Pillar Capital
        ctx.fillStyle = '#332a3d';
        ctx.fillRect(p.x - 6, p.y - 8, 60, 14);
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(p.x - 6, p.y - 8, 60, 14);
      }

      // --- LAYER 4B: WROUGHT-IRON WALL & PILLAR TORCH SCONCES ---
      // Defined torch positions across the Great Hall
      const wallTorches = [
        // North Wall Sconces
        { x: 75, y: 70, type: 'wall' },
        { x: 1125, y: 70, type: 'wall' },
        
        // West Wall Sconces
        { x: 60, y: 190, type: 'wall' },
        { x: 60, y: 360, type: 'wall' },
        { x: 60, y: 550, type: 'wall' },

        // East Wall Sconces
        { x: 1140, y: 190, type: 'wall' },
        { x: 1140, y: 360, type: 'wall' },
        { x: 1140, y: 550, type: 'wall' },

        // Pillar Sconces
        { x: 304, y: 235, type: 'pillar' },
        { x: 304, y: 455, type: 'pillar' },
        { x: 894, y: 235, type: 'pillar' },
        { x: 894, y: 455, type: 'pillar' }
      ];

      // Helper function to render a realistic wrought-iron torch sconce
      const drawTorchSconce = (tx: number, ty: number, isPillar: boolean) => {
        // 1. Wrought-Iron Backplate (Shield / Diamond shape)
        ctx.fillStyle = '#16131b';
        ctx.beginPath();
        ctx.moveTo(tx, ty - 10);
        ctx.lineTo(tx + 6, ty - 2);
        ctx.lineTo(tx, ty + 10);
        ctx.lineTo(tx - 6, ty - 2);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#3d3445';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 2. Forged Iron Arm / Curved Sconce Bracket
        ctx.strokeStyle = '#231d2a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(tx, ty + 2);
        ctx.quadraticCurveTo(tx, ty + 12, tx, ty + 4);
        ctx.stroke();

        // 3. Iron Basket / Torch Holder Cup
        ctx.fillStyle = '#2a2233';
        ctx.beginPath();
        ctx.moveTo(tx - 5, ty - 2);
        ctx.lineTo(tx + 5, ty - 2);
        ctx.lineTo(tx + 3, ty + 6);
        ctx.lineTo(tx - 3, ty + 6);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // 4. Wooden Torch Shaft & Pitch Wrap
        ctx.fillStyle = '#3c2817';
        ctx.fillRect(tx - 2, ty - 8, 4, 8);
        ctx.fillStyle = '#191410';
        ctx.fillRect(tx - 2.5, ty - 9, 5, 3); // Pitch cloth wrap

        // 5. Animated Multi-Layered Torch Fire with floating sparks
        const flameTick = torchTick * 3 + tx * 0.1;
        const flicker = Math.sin(flameTick) * 2;
        const flameY = ty - 11 + flicker * 0.7;

        // Outer Flame (Red/Orange)
        ctx.fillStyle = '#ff4d00';
        ctx.beginPath();
        ctx.arc(tx, flameY, 6.5 + Math.sin(flameTick * 1.5) * 1, 0, Math.PI * 2);
        ctx.fill();

        // Mid Flame (Amber Gold)
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.arc(tx, flameY - 1, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Inner Core (White/Yellow Hot)
        ctx.fillStyle = '#ffff99';
        ctx.beginPath();
        ctx.arc(tx, flameY - 1.5, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Rising ember spark
        const sparkY = flameY - 8 - ((torchTick * 20 + tx) % 18);
        const sparkX = tx + Math.sin(torchTick * 4 + ty) * 3;
        ctx.fillStyle = '#ffe066';
        ctx.fillRect(sparkX, sparkY, 1.5, 1.5);
      };

      for (const t of wallTorches) {
        drawTorchSconce(t.x, t.y, t.type === 'pillar');
      }

      // --- LAYER 5: CLICK-TO-MOVE TARGET INDICATOR ---
      if (moveTargetRef.current) {
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(moveTargetRef.current.x, moveTargetRef.current.y, 8 + Math.sin(torchTick * 4) * 2, 0, Math.PI * 2);
        ctx.stroke();
      }

      // --- LAYER 6: PLAYER SPRITE ---
      const px = Math.round(player.x);
      const py = Math.round(player.y);

      // Player Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.beginPath();
      ctx.ellipse(px, py + 12, 14, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw Pixel Knight
      const bob = player.isMoving ? Math.sin(torchTick * 5) * 2 : 0;
      const legOffset = player.isMoving ? (player.animFrame % 2 === 0 ? 3 : -3) : 0;

      // Legs / Sabatons
      ctx.fillStyle = '#2d2d38';
      ctx.fillRect(px - 7 + legOffset, py + 4 + bob, 5, 8);
      ctx.fillRect(px + 2 - legOffset, py + 4 + bob, 5, 8);

      // Cloak / Tabard (Burgundy)
      ctx.fillStyle = '#5c141c';
      ctx.fillRect(px - 9, py - 12 + bob, 18, 18);

      // Armor Torso (Silver / Dark Steel)
      ctx.fillStyle = '#4c4f5c';
      ctx.fillRect(px - 6, py - 14 + bob, 12, 16);

      // Blank Heraldic Stripe across armor (Gray/Silver)
      ctx.fillStyle = '#9e9ea6';
      ctx.fillRect(px - 2, py - 14 + bob, 4, 16);

      // Knight Great Helm
      ctx.fillStyle = '#686c7d';
      ctx.fillRect(px - 7, py - 26 + bob, 14, 13);

      // Gold Trim on Helm
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(px - 7, py - 27 + bob, 14, 2);

      // Visor Eye Slit (Glowing Amber)
      ctx.fillStyle = '#ffaa00';
      if (player.direction === 'down') {
        ctx.fillRect(px - 4, py - 21 + bob, 8, 2);
      } else if (player.direction === 'left') {
        ctx.fillRect(px - 6, py - 21 + bob, 4, 2);
      } else if (player.direction === 'right') {
        ctx.fillRect(px + 2, py - 21 + bob, 4, 2);
      } else {
        // Back of head (no eye visor)
        ctx.fillStyle = '#3d3f4a';
        ctx.fillRect(px - 5, py - 21 + bob, 10, 2);
      }

      // Knight Sword / Scabbard on Hip
      ctx.fillStyle = '#8f94a3';
      if (player.direction === 'left') {
        ctx.fillRect(px + 6, py - 8 + bob, 3, 16);
      } else {
        ctx.fillRect(px - 9, py - 8 + bob, 3, 16);
      }

      // --- LAYER 7: FLOATING INTERACTION PROMPT ---
      if (nearest) {
        const bubbleX = px;
        const bubbleY = py - 42 + bob;

        ctx.font = 'bold 11px "Cinzel", serif';
        const promptText = `[E] ${nearest.prompt}`;
        const textWidth = ctx.measureText(promptText).width;

        // Badge Box
        ctx.fillStyle = '#140f0a';
        ctx.fillRect(bubbleX - textWidth / 2 - 10, bubbleY - 14, textWidth + 20, 22);

        // Gold Trim Border
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bubbleX - textWidth / 2 - 10, bubbleY - 14, textWidth + 20, 22);

        // Text
        ctx.fillStyle = '#d4af37';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(promptText, bubbleX, bubbleY - 3);

        // Little down pointer
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.moveTo(bubbleX - 4, bubbleY + 8);
        ctx.lineTo(bubbleX + 4, bubbleY + 8);
        ctx.lineTo(bubbleX, bubbleY + 13);
        ctx.fill();
      }

      // --- LAYER 8: DYNAMIC LIGHTING & VIGNETTE OVERLAY ---
      // Darkness mask over entire world
      ctx.restore(); // Exit camera coordinate space

      // Screen-space Lighting calculation
      if (canvas.width > 0 && canvas.height > 0) {
        const screenLightCanvas = document.createElement('canvas');
        screenLightCanvas.width = canvas.width;
        screenLightCanvas.height = canvas.height;
        const sCtx = screenLightCanvas.getContext('2d');

        if (sCtx && screenLightCanvas.width > 0 && screenLightCanvas.height > 0) {
          // Base ambient ambient darkness
          sCtx.fillStyle = 'rgba(7, 5, 9, 0.45)';
          sCtx.fillRect(0, 0, canvas.width, canvas.height);

          sCtx.globalCompositeOperation = 'destination-out';

          // 1. Light from Player's lantern
          const pScreenX = player.x - camX;
          const pScreenY = player.y - camY;
          const pRadius = 140 + Math.sin(torchTick * 3) * 6;

          const playerLight = sCtx.createRadialGradient(pScreenX, pScreenY, 10, pScreenX, pScreenY, pRadius);
          playerLight.addColorStop(0, 'rgba(0,0,0,1)');
          playerLight.addColorStop(0.6, 'rgba(0,0,0,0.6)');
          playerLight.addColorStop(1, 'rgba(0,0,0,0)');
          sCtx.fillStyle = playerLight;
          sCtx.beginPath();
          sCtx.arc(pScreenX, pScreenY, pRadius, 0, Math.PI * 2);
          sCtx.fill();

          // 2. Light from Wall & Pillar Torch Sconces
          for (const t of wallTorches) {
            const tScreenX = t.x - camX;
            const tScreenY = t.y - camY;
            const tRadius = (t.type === 'wall' ? 140 : 125) + Math.sin(torchTick * 3.5 + t.x * 0.2) * 8;

            const tLight = sCtx.createRadialGradient(tScreenX, tScreenY, 6, tScreenX, tScreenY, tRadius);
            tLight.addColorStop(0, 'rgba(0,0,0,0.95)');
            tLight.addColorStop(0.45, 'rgba(0,0,0,0.5)');
            tLight.addColorStop(1, 'rgba(0,0,0,0)');
            sCtx.fillStyle = tLight;
            sCtx.beginPath();
            sCtx.arc(tScreenX, tScreenY, tRadius, 0, Math.PI * 2);
            sCtx.fill();
          }

          // 3. Ethereal High Dais & Throne Light Halo
          const thScreenX = thX - camX;
          const thScreenY = thY + 25 - camY;
          const thRadius = 150 + Math.sin(torchTick * 2) * 6;
          const thLight = sCtx.createRadialGradient(thScreenX, thScreenY, 20, thScreenX, thScreenY, thRadius);
          thLight.addColorStop(0, 'rgba(0,0,0,0.85)');
          thLight.addColorStop(0.5, 'rgba(0,0,0,0.4)');
          thLight.addColorStop(1, 'rgba(0,0,0,0)');
          sCtx.fillStyle = thLight;
          sCtx.beginPath();
          sCtx.arc(thScreenX, thScreenY, thRadius, 0, Math.PI * 2);
          sCtx.fill();

          // 4. Soft halo above Tapestry of Exile
          const tapScreenX = tapX + tapW / 2 - camX;
          const tapScreenY = tapY + tapH / 2 - camY;
          const tapLight = sCtx.createRadialGradient(tapScreenX, tapScreenY, 30, tapScreenX, tapScreenY, 180);
          tapLight.addColorStop(0, 'rgba(0,0,0,0.9)');
          tapLight.addColorStop(0.6, 'rgba(0,0,0,0.4)');
          tapLight.addColorStop(1, 'rgba(0,0,0,0)');
          sCtx.fillStyle = tapLight;
          sCtx.beginPath();
          sCtx.arc(tapScreenX, tapScreenY, 180, 0, Math.PI * 2);
          sCtx.fill();

          // 5. Gate Threshold & Bookcase Candle illumination
          const gateScreenX = gateX + gateW / 2 - camX;
          const gateScreenY = gateY + gateH - camY;
          const gateLight = sCtx.createRadialGradient(gateScreenX, gateScreenY, 5, gateScreenX, gateScreenY, 90);
          gateLight.addColorStop(0, 'rgba(0,0,0,0.8)');
          gateLight.addColorStop(1, 'rgba(0,0,0,0)');
          sCtx.fillStyle = gateLight;
          sCtx.beginPath();
          sCtx.arc(gateScreenX, gateScreenY, 90, 0, Math.PI * 2);
          sCtx.fill();

          const bkCandleScreenX = bkX + bkW - 15 - camX;
          const bkCandleScreenY = bkY - 15 - camY;
          const bkLight = sCtx.createRadialGradient(bkCandleScreenX, bkCandleScreenY, 4, bkCandleScreenX, bkCandleScreenY, 80);
          bkLight.addColorStop(0, 'rgba(0,0,0,0.85)');
          bkLight.addColorStop(1, 'rgba(0,0,0,0)');
          sCtx.fillStyle = bkLight;
          sCtx.beginPath();
          sCtx.arc(bkCandleScreenX, bkCandleScreenY, 80, 0, Math.PI * 2);
          sCtx.fill();

          // Draw lighting mask onto main canvas safely
          ctx.drawImage(screenLightCanvas, 0, 0);
        }
      }

      // Vignette border
      const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.3,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.7
      );
      vignette.addColorStop(0, 'transparent');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [collisionBoxes, onOpenTapestry, onOpenPoems, onOpenHousehold, onOpenOC, onOpenBastionGate]);

  // Touch Virtual Joystick Handlers
  const handleJoystickTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isTouchingJoystick.current = true;
    handleJoystickTouchMove(e);
  };

  const handleJoystickTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const target = e.currentTarget.getBoundingClientRect();
    const centerX = target.left + target.width / 2;
    const centerY = target.top + target.height / 2;

    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const maxRadius = target.width / 2;

    if (dist > 0) {
      joystickVector.current = {
        x: (dx / Math.max(dist, maxRadius)),
        y: (dy / Math.max(dist, maxRadius))
      };
    }
  };

  const handleJoystickTouchEnd = () => {
    isTouchingJoystick.current = false;
    joystickVector.current = { x: 0, y: 0 };
  };

  return (
    <div 
      ref={containerRef}
      id="great-hall-container"
      className="relative w-full h-[620px] md:h-[680px] lg:h-[740px] bg-[#070508] overflow-hidden rounded-xl border-2 border-[#3e301d] shadow-[0_0_40px_rgba(0,0,0,0.9)] select-none"
    >
      {/* HTML5 Canvas Viewport */}
      <canvas
        ref={canvasRef}
        id="great-hall-canvas"
        onClick={handleCanvasClick}
        className="w-full h-full cursor-crosshair block"
      />

      {/* TOP HUD BAR: Room Shortcuts (Floating title removed) */}
      <div className="absolute top-4 right-4 flex justify-end items-center pointer-events-none z-30">
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setShowHelp(true)}
            className="bg-[#120d08]/90 hover:bg-[#26190f] text-[#d4af37] border border-[#d4af37]/40 rounded p-1.5 backdrop-blur-sm cursor-pointer transition shadow-lg"
            title="Controls & Hall Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DIRECT ACTION BAR (Bottom Center for quick inspection / mobile access) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
        {/* If near an interactable item, show large action button */}
        {activeInteractable ? (
          <button
            onClick={activeInteractable.action}
            className="bg-gradient-to-r from-[#5a1419] via-[#85232b] to-[#5a1419] hover:from-[#731c23] hover:to-[#731c23] text-[#fff4db] border-2 border-[#d4af37] px-6 py-2.5 rounded-lg font-serif font-bold tracking-widest text-xs md:text-sm uppercase shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center gap-2.5 cursor-pointer animate-pulse transition duration-200"
          >
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>{activeInteractable.prompt}</span>
          </button>
        ) : (
          <div className="bg-[#100c07]/80 border border-[#3e301d] rounded-full px-4 py-1.5 text-[11px] text-[#9c8e78] font-serif tracking-wider shadow-md backdrop-blur-xs flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Use WASD / Arrow Keys or Click floor to walk the Great Hall</span>
          </div>
        )}
      </div>

      {/* LORE DIALOG POPUP (For environmental inspection items) */}
      {loreNotification && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 max-w-md w-[90%] bg-[#150f0a]/95 border-2 border-[#d4af37]/60 rounded-lg p-4 shadow-[0_0_30px_rgba(0,0,0,0.9)] backdrop-blur-md z-40 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#d4af37] uppercase">
              <Scroll className="w-3.5 h-3.5" />
              <span>Imperial Chronicle Inscription</span>
            </div>
            <button 
              onClick={() => setLoreNotification(null)}
              className="text-[#8c7860] hover:text-[#e1d5c3] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs md:text-sm text-[#e3d8c8] font-serif leading-relaxed mt-2 italic whitespace-pre-line">
            &ldquo;{loreNotification}&rdquo;
          </p>
        </div>
      )}

      {/* TOUCH SCREEN VIRTUAL JOYSTICK (Visible on mobile/tablets) */}
      <div className="md:hidden absolute bottom-5 left-5 z-30">
        <div
          onTouchStart={handleJoystickTouchStart}
          onTouchMove={handleJoystickTouchMove}
          onTouchEnd={handleJoystickTouchEnd}
          className="w-24 h-24 bg-[#1b150f]/70 border-2 border-[#d4af37]/40 rounded-full flex items-center justify-center backdrop-blur-xs relative touch-none shadow-xl"
        >
          <div className="w-10 h-10 bg-[#d4af37]/40 border border-[#d4af37] rounded-full pointer-events-none"></div>
          <span className="absolute text-[8px] text-[#8e826f] font-serif font-bold uppercase tracking-widest pointer-events-none">
            MOVE
          </span>
        </div>
      </div>

      {/* HELP / GUIDE MODAL */}
      {showHelp && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#150f0a] border-2 border-[#d4af37] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#3e301d] pb-3">
              <h3 className="text-lg font-serif font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-5 h-5" />
                <span>Great Hall Navigation Guide</span>
              </h3>
              <button 
                onClick={() => setShowHelp(false)}
                className="text-[#8c7860] hover:text-[#e1d5c3] cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs md:text-sm text-[#dcd1be] font-serif leading-relaxed">
              <div className="p-3 bg-[#1e150d] rounded border border-[#3e301d] space-y-2">
                <p className="font-bold text-[#d4af37] uppercase tracking-wider">🎮 Movement Controls</p>
                <ul className="list-disc list-inside space-y-1 text-[#b5a793]">
                  <li><strong className="text-[#e8dac5]">WASD / Arrow Keys</strong>: Walk around the Great Hall</li>
                  <li><strong className="text-[#e8dac5]">E / Space / Enter</strong>: Inspect nearby objects</li>
                  <li><strong className="text-[#e8dac5]">Mouse Click / Touch</strong>: Tap any floor tile or object to walk toward it</li>
                </ul>
              </div>

              <div className="p-3 bg-[#1e150d] rounded border border-[#3e301d] space-y-2">
                <p className="font-bold text-[#d4af37] uppercase tracking-wider">🏛️ Hall Landmarks</p>
                <ul className="space-y-1.5 text-[#b5a793]">
                  <li>👑 <strong className="text-[#d4af37]">Obsidian High Throne</strong>: The sovereign dais at the head of the crimson carpet.</li>
                  <li>🖼️ <strong className="text-[#d4af37]">The Current Lord</strong>: On the north wall between throne and gate — opens the Lord's illuminated Folio.</li>
                  <li>📜 <strong className="text-[#d4af37]">Tapestry of Exile</strong>: Left wall above the pillars — interact to view the full chronicle.</li>
                  <li>📚 <strong className="text-[#d4af37]">The Canticles</strong>: Adjacent to the tapestry — read the 11th-century handwritten poems.</li>
                  <li>🚩 <strong className="text-[#d4af37]">Household Standard</strong>: Flanking the south entrance on the right — opens Household lore.</li>
                  <li>🛡️ <strong className="text-[#d4af37]">Relic Armor</strong>: Flanking the south entrance on the left — displays knightly glory & forces.</li>
                  <li>🗺️ <strong className="text-[#d4af37]">War Strategy Table</strong>: In the far east wing with battle maps and campaign orders.</li>
                  <li>🚪 <strong className="text-[#d4af37]">Porta Profundis Gate</strong>: The heavy iron-bound gate on the north-east wall — opens the Bastion Waypoints (Barracks, Stables, Treasury).</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full bg-[#301a11] hover:bg-[#4a2618] text-[#d4af37] border border-[#d4af37]/60 py-2 rounded font-serif font-bold text-xs uppercase tracking-widest cursor-pointer transition"
            >
              Return to Great Hall
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
