import React, { useEffect, useRef, useState } from 'react';

const GridBackground = ({ 
  cellSize = 24,
  gridColor = '99, 102, 241',
  gridOpacity = 0.3,
  glowColor = '167, 137, 250',
  glowSize = 4,
  glowSpeed = 0.002,
  trailLength = 8,
  spawnInterval = 500 // ms between new light spawns
}) => {
  const canvasRef = useRef(null);
  const [lights, setLights] = useState([]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let spawnIntervalId;
    let cols = 0;
    let rows = 0;

    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      cols = Math.ceil(canvas.width / cellSize);
      rows = Math.ceil(canvas.height / cellSize);
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const spawnNewLight = () => {
      const edgeType = Math.random() > 0.5 ? 'vertical' : 'horizontal';
      const position = edgeType === 'vertical' 
        ? Math.floor(Math.random() * (cols + 1))
        : Math.floor(Math.random() * (rows + 1));
      
      setLights(prev => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          edgeType,
          position,
          progress: 0,
          speed: glowSpeed * (0.8 + Math.random() * 0.4) // Random speed variation
        }
      ]);
    };

    const drawGrid = () => {
      if (!ctx) return;
      
      // Clear with dark background
      ctx.fillStyle = 'rgba(15, 15, 20, 0.8)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw permanent faint grid
      ctx.strokeStyle = `rgba(${gridColor}, ${gridOpacity})`;
      ctx.lineWidth = 1;
      
      // Vertical lines
      for (let x = 0; x <= cols; x++) {
        ctx.beginPath();
        ctx.moveTo(x * cellSize, 0);
        ctx.lineTo(x * cellSize, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = 0; y <= rows; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * cellSize);
        ctx.lineTo(canvas.width, y * cellSize);
        ctx.stroke();
      }
      
      // Update and draw lights
      setLights(prev => {
        const updatedLights = prev.map(light => {
          const newProgress = light.progress + light.speed;
          
          // Draw the light
          if (light.edgeType === 'vertical') {
            const y = canvas.height * (newProgress % 1);
            
            // Main glow
            const gradient = ctx.createRadialGradient(
              light.position * cellSize, y, 0,
              light.position * cellSize, y, glowSize
            );
            gradient.addColorStop(0, `rgba(${glowColor}, 1)`);
            gradient.addColorStop(1, `rgba(${glowColor}, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(light.position * cellSize, y, glowSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Trail
            for (let t = 1; t <= trailLength; t++) {
              const trailY = (y - t * 5 + canvas.height) % canvas.height;
              const alpha = 1 - (t / trailLength);
              ctx.fillStyle = `rgba(${glowColor}, ${alpha * 0.7})`;
              ctx.beginPath();
              ctx.arc(light.position * cellSize, trailY, glowSize * 0.7, 0, Math.PI * 2);
              ctx.fill();
            }
          } else {
            const x = canvas.width * (newProgress % 1);
            
            // Main glow
            const gradient = ctx.createRadialGradient(
              x, light.position * cellSize, 0,
              x, light.position * cellSize, glowSize
            );
            gradient.addColorStop(0, `rgba(${glowColor}, 1)`);
            gradient.addColorStop(1, `rgba(${glowColor}, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, light.position * cellSize, glowSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Trail
            for (let t = 1; t <= trailLength; t++) {
              const trailX = (x - t * 5 + canvas.width) % canvas.width;
              const alpha = 1 - (t / trailLength);
              ctx.fillStyle = `rgba(${glowColor}, ${alpha * 0.7})`;
              ctx.beginPath();
              ctx.arc(trailX, light.position * cellSize, glowSize * 0.7, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          
          return { ...light, progress: newProgress };
        });
        
        // Remove lights that have completed many cycles
        return updatedLights.filter(light => light.progress < 10);
      });
      
      animationFrameId = requestAnimationFrame(drawGrid);
    };
    
    drawGrid();
    spawnIntervalId = setInterval(spawnNewLight, spawnInterval);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(spawnIntervalId);
      resizeObserver.disconnect();
    };
  }, [cellSize, gridColor, gridOpacity, glowColor, glowSize, glowSpeed, trailLength, spawnInterval]);
  
  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 -z-10"
      aria-hidden="true"
    />
  );
};

export default GridBackground;