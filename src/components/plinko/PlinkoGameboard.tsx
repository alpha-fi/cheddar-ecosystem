import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Engine, Render, Bodies, World } from 'matter-js';
import { color } from 'framer-motion';
import { Button } from '@chakra-ui/react';

interface Props {
  rows: number;
}

export function PlinkoBoard({ rows }: Props) {
  const scene = useRef() as React.LegacyRef<HTMLDivElement> | undefined;
  const engine = useRef(Engine.create());
  const [cw, setCw] = useState<number>(document.body.clientWidth);
  const [ch, setCh] = useState<number>(document.body.clientHeight);
  const [pinSpacing, setPinSpacing] = useState<number>(50);
  const ballRadius = useRef(7.5)
  const [cols, setCols] = useState<number>(6)

  const drawBall = () => {
    const ballXPos = Math.floor(Math.random() * cw / 2) + cw / 4
    const ball = Bodies.circle(ballXPos, pinSpacing, ballRadius.current, {
      restitution: 1,
      friction: 0.9,
      render: { fillStyle: 'red' },
    });
    World.add(engine.current.world, [ball]);
  }

  useEffect(() => {
    console.log("p", pinSpacing)
    if(ch === 0) {
      const currentCh = document.body.clientHeight;
      setCh(currentCh);
    }
    console.log(cw, ch, pinSpacing)
    if (scene) {
      const render = Render.create({
        element: scene!.current,
        engine: engine.current,
        options: {
          width: cw,
          height: ch,
          wireframes: false,
          background: 'transparent',
        },
      });

      //Create world
      World.add(engine.current.world, [
        Bodies.rectangle(0, 0, cw/2, 2*ch, { isStatic: true, render: { fillStyle: 'red' }}), // Left wall
        Bodies.rectangle(cw/2 + cols * pinSpacing, 0, cw / 2, 2*ch, { isStatic: true, render: { fillStyle: 'blue' } }), // Right wall
        Bodies.rectangle(0, (2 * rows - 2) * pinSpacing, 2 * cw, ch, { isStatic: true, render: { fillStyle: 'black' } }),// Bottom wall

        Bodies.rectangle(cw/2 + 6*pinSpacing, (2 * rows - 3) * pinSpacing, cw, ch, { isStatic: true, render: { fillStyle: 'orange' } }),// Section wall
        // Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true, render: { fillStyle: 'black' } }),
        // Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true, render: { fillStyle: 'black' } }),
      ]);

      //Create plinko pins
      const pinRadius = 10
      for (let row = 0; row < rows; row++) {
        // for (let col = 0; col < cw / pinSpacing / 2; col++) {
        for (let col = 0; col < cols + 1 - row % 2; col++) {
          
          const x = cw / 4 + row % 2 * pinSpacing / 2 + col * pinSpacing// - (row * pinSpacing) / 2 + col * pinSpacing;
          const y = (row + 2) * pinSpacing;

          const pin = Bodies.circle(x, y, pinRadius, {
            isStatic: true,
            render: {
              fillStyle: 'black',
            },
          });
          World.add(engine.current.world, [pin]);
          
        }
      }

      //Draw ball
      drawBall()

      //Start running and rendering
      Engine.run(engine.current);
      Render.run(render);

      return () => {
        Render.stop(render);
        World.clear(engine.current.world, true);
        Engine.clear(engine.current);
        render.canvas.remove();
      };
    }
  }, [document.body.clientWidth, document.body.clientHeight]);

  return (
    <>
      <Button onClick={drawBall}>Draw ball</Button>
      <div ref={scene} style={{ width: '100vw', height: '60vh' }} />
    </>
  )
}
