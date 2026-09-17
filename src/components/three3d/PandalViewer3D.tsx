import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  ArrowLeft, 
  Sparkles, 
  Eye, 
  Compass, 
  Heart,
  Volume2,
  VolumeX,
  Layers
} from 'lucide-react';
import { buildGrandPandalEnvironment, GANESHA_BACKGROUND_IMAGE_URL } from './PandalEnvironment';
import { loadGanesha3DModel } from './GaneshaModel';
import { loadMushak3DModel, Mushak3DInstance } from './MushakModel';
import { soundManager } from '../../audio/soundManager';

interface PandalViewer3DProps {
  onClose?: () => void;
  className?: string;
  isStandalone?: boolean;
}

type CameraPreset = 'darshan' | 'singhasaan' | 'mushak' | 'canopy' | 'overview';

const CAMERA_PRESETS: Record<CameraPreset, { pos: THREE.Vector3; target: THREE.Vector3; label: string }> = {
  darshan: {
    pos: new THREE.Vector3(2.4, 2.6, 5.2),
    target: new THREE.Vector3(0, 2.1, -0.4),
    label: 'Grand Darshan',
  },
  singhasaan: {
    pos: new THREE.Vector3(0, 2.2, 4.0),
    target: new THREE.Vector3(0, 2.1, -0.5),
    label: 'Singhasaan',
  },
  mushak: {
    pos: new THREE.Vector3(1.9, 1.3, 1.9),
    target: new THREE.Vector3(1.15, 0.7, 0.4),
    label: 'Mushak Ji',
  },
  canopy: {
    pos: new THREE.Vector3(-2.6, 1.8, 4.8),
    target: new THREE.Vector3(0, 4.2, 0.5),
    label: 'Pandal & Torana',
  },
  overview: {
    pos: new THREE.Vector3(0, 3.8, 7.8),
    target: new THREE.Vector3(0, 1.8, 0),
    label: 'Temple Court',
  },
};

export const PandalViewer3D: React.FC<PandalViewer3DProps> = ({
  onClose,
  className = 'w-full h-full',
  isStandalone = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(15);
  const [activePreset, setActivePreset] = useState<CameraPreset>('darshan');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(!soundManager.settings.soundEnabled);
  const [isCustomGLB, setIsCustomGLB] = useState(false);

  // References for camera transition animation
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const transitionTargetRef = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);

  // Sound toggle
  const handleToggleSound = useCallback(() => {
    const nextSoundEnabled = !soundManager.settings.soundEnabled;
    soundManager.updateSettings({ 
      soundEnabled: nextSoundEnabled,
      musicEnabled: nextSoundEnabled
    });
    setIsMuted(!nextSoundEnabled);
    if (nextSoundEnabled) {
      soundManager.playTempleBell();
    }
  }, []);

  // Viewport Fullscreen toggle
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  // Switch camera viewpoint preset with smooth damping
  const applyPreset = useCallback((presetKey: CameraPreset) => {
    setActivePreset(presetKey);
    setHasInteracted(true);
    soundManager.playModakCollect();

    const preset = CAMERA_PRESETS[presetKey];
    transitionTargetRef.current = {
      pos: preset.pos.clone(),
      target: preset.target.clone(),
    };
  }, []);

  // Reset to default three-quarter cinematic darshan view
  const handleResetCamera = useCallback(() => {
    applyPreset('darshan');
  }, [applyPreset]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;
    const isMobile = width < 768;

    // 1. Scene & Atmosphere Setup
    const scene = new THREE.Scene();
    scene.background = null; // Transparent so the responsive WebP background image shows cleanly
    scene.fog = new THREE.FogExp2(0x0a0509, 0.038);

    // 2. Camera Setup (Cinematic 3/4 Darshan view)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const initialPreset = CAMERA_PRESETS.darshan;
    camera.position.copy(initialPreset.pos);
    cameraRef.current = camera;

    // 3. High-Performance PBR WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls with Strict Devotional & Temple Boundaries
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.copy(initialPreset.target);

    // Boundaries to ensure Ganesha is always framed and camera never penetrates walls/floors
    controls.minDistance = 2.4;
    controls.maxDistance = 10.5;
    controls.minPolarAngle = Math.PI / 6;       // 30 degrees (prevent ceiling blowout)
    controls.maxPolarAngle = Math.PI / 2.05;   // ~87 degrees (prevents underground clipping)
    controls.minAzimuthAngle = -Math.PI * 0.58; // Prevents viewing behind back jali wall
    controls.maxAzimuthAngle = Math.PI * 0.58;
    controls.enablePan = true;
    controls.panSpeed = 0.6;
    controls.rotateSpeed = 0.75;
    controls.zoomSpeed = 0.9;

    // Track user interaction to fade the instruction banner
    const onStartInteraction = () => {
      setHasInteracted(true);
    };
    controls.addEventListener('start', onStartInteraction);

    // 5. Cinematic Night Festival Lighting Setup
    // Key Light: Warm Altar Spotlight on Ganesha
    const keySpotLight = new THREE.SpotLight(0xffedd5, 3.5, 22, Math.PI / 4.5, 0.45, 1);
    keySpotLight.position.set(0, 8.5, 3.8);
    keySpotLight.target.position.set(0, 2.1, -0.4);
    keySpotLight.castShadow = true;
    keySpotLight.shadow.bias = -0.001;
    keySpotLight.shadow.mapSize.width = isMobile ? 1024 : 2048;
    keySpotLight.shadow.mapSize.height = isMobile ? 1024 : 2048;
    scene.add(keySpotLight);
    scene.add(keySpotLight.target);

    // Warm Ambient Light
    const ambientLight = new THREE.AmbientLight(0x27140b, 1.4);
    scene.add(ambientLight);

    // Moonlit Cool Fill from Court entrance
    const coolMoonLight = new THREE.DirectionalLight(0x7dd3fc, 0.45);
    coolMoonLight.position.set(-6, 8, 8);
    scene.add(coolMoonLight);

    // Soft Warm Fill from Front
    const warmFill = new THREE.DirectionalLight(0xf59e0b, 0.6);
    warmFill.position.set(4, 5, 6);
    scene.add(warmFill);

    // 6. Build the Complete Grand Indian Pandal Architecture & Decor
    const pandal = buildGrandPandalEnvironment(scene);

    // Update progress
    setLoadingProgress(45);

    // 7. Load Character Models (Lord Ganesha & Mushak)
    let ganeshaGroup: THREE.Group | null = null;
    let ganeshaMixer: THREE.AnimationMixer | undefined;
    let mushakInstance: Mushak3DInstance | null = null;

    let isMounted = true;

    Promise.all([
      loadGanesha3DModel().then((res) => {
        if (!isMounted) return;
        ganeshaGroup = res.scene;
        ganeshaMixer = res.mixer;
        setIsCustomGLB(res.isCustomGLB);

        // Position Ganesha majestically on the plush Singhasaan cushion
        ganeshaGroup.position.copy(pandal.ganeshaMountPoint);
        scene.add(ganeshaGroup);
        setLoadingProgress((prev) => Math.max(prev, 75));
      }),
      loadMushak3DModel().then((res) => {
        if (!isMounted) return;
        mushakInstance = res;

        // Position Mushak respectfully on the red velvet stage facing Ganesha
        mushakInstance.root.position.copy(pandal.mushakMountPoint);
        mushakInstance.root.rotation.y = -Math.PI / 3.2;
        scene.add(mushakInstance.root);
        setLoadingProgress((prev) => Math.max(prev, 90));
      }),
    ]).finally(() => {
      if (!isMounted) return;
      setLoadingProgress(100);
      setTimeout(() => {
        if (isMounted) {
          setIsLoading(false);
          soundManager.playTempleBell();
        }
      }, 400);
    });

    // 8. Animation & Render Loop
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth camera transition when preset is selected
      if (transitionTargetRef.current) {
        const { pos, target } = transitionTargetRef.current;
        camera.position.lerp(pos, 0.06);
        controls.target.lerp(target, 0.06);

        if (camera.position.distanceTo(pos) < 0.05 && controls.target.distanceTo(target) < 0.05) {
          camera.position.copy(pos);
          controls.target.copy(target);
          transitionTargetRef.current = null;
        }
      }

      controls.update();

      // Update Pandal particle animations & diya flame flickering
      pandal.update(delta, time);

      // Update animations
      if (ganeshaMixer) {
        ganeshaMixer.update(delta);
      }
      if (mushakInstance) {
        mushakInstance.update(delta, time, false);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. High-Precision Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 768 ? 1.5 : 2.0));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      controls.removeEventListener('start', onStartInteraction);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);

      controls.dispose();
      pandal.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden select-none bg-[#060308] text-amber-50 bg-cover bg-center bg-no-repeat ${className}`}
      style={{
        touchAction: 'none',
        backgroundImage: `url("${GANESHA_BACKGROUND_IMAGE_URL}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* 1. Cinematic Loading Experience */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#060308] px-6 text-center"
          >
            {/* Glowing Golden Aura Diya */}
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 blur-xl absolute inset-0 animate-pulse" />
              <div className="w-16 h-16 rounded-full border border-amber-400/40 flex items-center justify-center relative apple-liquid-glass">
                <Sparkles className="w-8 h-8 text-amber-300 animate-spin-slow" />
              </div>
            </div>

            <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-500 mb-2">
              ENTERING THE PANDAL
            </h2>

            <p className="font-marcellus text-xs sm:text-sm text-amber-200/80 tracking-wider mb-6">
              Vinayaka Chaturthi Grand 3D Darshan
            </p>

            {/* Subtle Progress Bar */}
            <div className="w-48 sm:w-64 h-1.5 rounded-full bg-amber-950/60 overflow-hidden border border-amber-500/20 p-[1px]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                style={{ width: `${loadingProgress}%` }}
                transition={{ ease: 'easeInOut', duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Top Minimal Apple-Style Floating Bar */}
      <header className="absolute top-3 sm:top-5 left-3 sm:left-6 right-3 sm:right-6 z-30 flex items-center justify-between pointer-events-none">
        {/* Left: Back / Title Badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {onClose && (
            <button
              onClick={() => {
                soundManager.userInteracted();
                onClose();
              }}
              className="apple-liquid-glass px-3 py-2 rounded-2xl border border-amber-500/30 text-amber-200 hover:text-amber-100 hover:border-amber-400 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-lg"
              aria-label="Back to Festival"
            >
              <ArrowLeft className="w-4 h-4 text-amber-300" />
              <span className="font-cinzel text-xs font-semibold tracking-wider uppercase hidden xs:inline">Back</span>
            </button>
          )}

          <div className="apple-liquid-glass px-3.5 py-1.5 rounded-2xl border border-amber-500/25 flex items-center gap-2 shadow-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <p className="font-cinzel text-xs font-bold text-amber-200 uppercase tracking-wider leading-none">
                Ganesh Pandal
              </p>
              <p className="text-[9px] text-amber-300/70 font-outfit uppercase tracking-widest mt-0.5">
                3D Stage Viewer
              </p>
            </div>
          </div>
        </div>

        {/* Right: Actions (Sound, Reset, Fullscreen) */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            onClick={handleResetCamera}
            className="apple-liquid-glass w-9 h-9 rounded-2xl border border-amber-500/30 flex items-center justify-center text-amber-300 hover:text-amber-100 transition-all cursor-pointer active:scale-95 shadow-md"
            title="Reset to Grand Darshan"
            aria-label="Reset Camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleSound}
            className="apple-liquid-glass w-9 h-9 rounded-2xl border border-amber-500/30 flex items-center justify-center text-amber-300 hover:text-amber-100 transition-all cursor-pointer active:scale-95 shadow-md"
            title={isMuted ? "Unmute sound" : "Mute sound"}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="apple-liquid-glass w-9 h-9 rounded-2xl border border-amber-500/30 hidden sm:flex items-center justify-center text-amber-300 hover:text-amber-100 transition-all cursor-pointer active:scale-95 shadow-md"
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 3. Subtle Initial Gesture Hint Banner (Fades out once user interacts) */}
      <AnimatePresence>
        {!hasInteracted && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6 }}
            className="absolute top-18 sm:top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          >
            <div className="apple-liquid-glass px-4 py-2 rounded-full border border-amber-400/30 shadow-2xl flex items-center gap-3 text-amber-200 text-[11px] sm:text-xs font-outfit font-medium">
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                DRAG TO EXPLORE
              </span>
              <span className="text-amber-500">•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                SCROLL / PINCH TO ZOOM
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Bottom Viewpoint Selector Dock (Cinematic Angles) */}
      <footer className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 w-[95%] sm:w-auto max-w-xl pointer-events-auto">
        <div className="apple-glass-dock rounded-2xl sm:rounded-full px-2 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between sm:justify-center gap-1 sm:gap-2 shadow-2xl border border-amber-500/30 overflow-x-auto no-scrollbar">
          {(Object.keys(CAMERA_PRESETS) as CameraPreset[]).map((key) => {
            const isSelected = activePreset === key;
            return (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl sm:rounded-full font-cinzel text-[10px] sm:text-xs font-semibold tracking-wider transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 font-bold shadow-md shadow-amber-500/30 ring-1 ring-amber-300'
                    : 'text-amber-200/80 hover:text-amber-100 hover:bg-white/5'
                }`}
              >
                {CAMERA_PRESETS[key].label}
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
};
