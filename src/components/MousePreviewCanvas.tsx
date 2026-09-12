import React, { useEffect, useRef } from 'react';
import { drawMouse3D } from '../game/mouse3D';
import { Player } from '../types';

interface MousePreviewCanvasProps {
  size?: number;
}

export const MousePreviewCanvas: React.FC<MousePreviewCanvasProps> = ({ size = 120 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const mockPlayer: Player = {
      x: size / 2 - 20,
      y: size - 36,
      width: 40,
      height: 36,
      vx: 4,
      vy: 0,
      isGrounded: true,
      isSliding: false,
      slideTimer: 0,
      animFrame: 0,
      animState: 'running',
      invincibleTimer: 0,
      divineBlessingTimer: 0,
      magnetTimer: 0,
      boostTimer: 0,
      trailTimer: 0,
      trailSpawnTimer: 0,
    };

    const render = () => {
      time += 0.025;
      mockPlayer.animFrame += 0.18;
      ctx.clearRect(0, 0, size, size);

      ctx.save();
      // Center the 3D mouse inside the circle
      ctx.translate(size / 2, size * 0.72);
      ctx.scale(0.85, 0.85);

      drawMouse3D(ctx, mockPlayer, time);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="block select-none pointer-events-none"
    />
  );
};
