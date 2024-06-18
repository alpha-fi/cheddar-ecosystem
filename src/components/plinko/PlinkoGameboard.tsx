import { Button } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';

interface PinkoBoardProps {
  numDrops: number;
}

export const PinkoBoard: React.FC<PinkoBoardProps> = ({ numDrops }) => {
  // Gameboard configuration
  const boardWidth = 300;
  const boardHeight = 400;
  const pinRadius = 5;
  const rows = numDrops;
  const pinSpacing = boardWidth / rows;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ballPosition, setBallPosition] = useState({ x: 150, y: pinSpacing });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, boardWidth, boardHeight);

    // Draw pins
    for (let row = 1; row <= rows; row++) {
      for (let col = 0; col < row; col++) {
        const x =
          boardWidth / 2 - ((row - 1) * pinSpacing) / 2 + col * pinSpacing;
        const y = row * pinSpacing;

        if (row > 1) {
          // First line should be even
          context.beginPath();
          context.arc(x, y, pinRadius, 0, Math.PI * 2);
          context.fillStyle = 'black';
          context.fill();
        }
      }
    }

    // Draw ball
    const getBall = () => ({
      x: ballPosition.x,
      y: ballPosition.y,
      ballSize: pinSpacing / 2.5, // Adjusted ball size
      startAngle: 0,
      endAngle: Math.PI * 2,
      color: 'red',

      draw() {
        context.beginPath();
        context.arc(
          this.x,
          this.y,
          this.ballSize,
          this.startAngle,
          this.endAngle
        );
        context.fillStyle = this.color;
        context.fill();
      },
    });

    const ball = getBall();

    const update = () => {
      context.clearRect(0, 0, boardWidth, boardHeight);
      // Redraw pins
      for (let row = 1; row <= rows; row++) {
        for (let col = 0; col < row; col++) {
          const x =
            boardWidth / 2 - ((row - 1) * pinSpacing) / 2 + col * pinSpacing;
          const y = row * pinSpacing;

          if (row > 1) {
            context.beginPath();
            context.arc(x, y, pinRadius, 0, Math.PI * 2);
            context.fillStyle = 'black';
            context.fill();
          }
        }
      }
      // Redraw ball
      ball.draw();
      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }, [ballPosition, pinSpacing, rows, boardWidth, boardHeight, pinRadius]);

  const dropBall = () => {};

  return (
    <div>
      <canvas ref={canvasRef} width={boardWidth} height={boardHeight} />
      <Button onClick={dropBall}>Drop Ball</Button>
    </div>
  );
};

export default PinkoBoard;
