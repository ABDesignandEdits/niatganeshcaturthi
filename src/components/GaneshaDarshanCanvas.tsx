import React, { useEffect, useRef } from 'react';
import { drawLordGaneshaEndpoint } from '../game/ganeshaEndpoint';
import { drawMouse3D } from '../game/mouse3D';
import { Player } from '../types';

interface GaneshaDarshanCanvasProps {
  width?: number;
  height?: number;
}

export const GaneshaDarshanCanvas: React.FC<GaneshaDarshanCanvasProps> = ({
  width = 380,
  height = 230,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const mockPlayer: Player = {
      x: width * 0.22 - 20,
      y: height - 42,
      width: 40,
      height: 36,
      vx: 0,
      vy: 0,
      isGrounded: true,
      isSliding: false,
      slideTimer: 0,
      animFrame: 0,
      animState: 'pranam',
      invincibleTimer: 0,
      divineBlessingTimer: 10,
      magnetTimer: 0,
      boostTimer: 0,
      trailTimer: 0,
      trailSpawnTimer: 0,
    };

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // Night festival background with subtle gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#1c0a06');
      bgGrad.addColorStop(0.5, '#2e0f09');
      bgGrad.addColorStop(1, '#0c0705');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const shrineX = width * 0.62;
      const groundY = height - 20;

      // Draw Standing Bal Ganesha Endpoint (Photo match!)
      drawLordGaneshaEndpoint(
        ctx,
        shrineX,
        groundY,
        time,
        true, // isAtAltar
        mockPlayer.x,
        false // no large banner in mini card
      );

      // Draw Mushak in Pranam Mudra (Photo match!)
      ctx.save();
      ctx.translate(mockPlayer.x + mockPlayer.width / 2, groundY);
      drawMouse3D(ctx, mockPlayer, time);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [width, height]);

  return (
    <div className="relative rounded-xl overflow-hidden border-2 border-amber-400/50 shadow-xl shadow-amber-950/60 my-2 mx-auto bg-black/40">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="block max-w-full h-auto mx-auto"
      />
    </div>
  );
};
