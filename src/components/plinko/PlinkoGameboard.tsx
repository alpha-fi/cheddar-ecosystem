import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Engine, Render, Bodies, World, Events } from 'matter-js';
import { color } from 'framer-motion';
import { Button } from '@chakra-ui/react';

export function PlinkoBoard() {
  const [points, setPoints] = useState(0);
  // const [onGoingGame, setOnGoingGame] = useState(true);

  const [rows, setRows] = useState(9);
  const [cols, setCols] = useState(11);
  const [pinRadius, setPinRadius] = useState(14);
  const [ballRadius, setBallRadius] = useState(10);
  const scene = useRef() as React.LegacyRef<HTMLDivElement> | undefined;
  const engine = useRef(Engine.create());
  engine.current.world.gravity.y = 0.5;
  // const [cw, setCw] = useState<number>(document.body.clientWidth);
  // const [ch, setCh] = useState<number>(document.body.clientHeight);
  const [cw, setCw] = useState<number>(600);
  const [ch, setCh] = useState<number>(700);
  const [pinSpacing, setPinSpacing] = useState<number>(cw / cols);

  // if (lastBody && lastBody.label === 'ball') {
  //   if (onGoingGame && lastBody.position.y >= 655) {
  //     setOnGoingGame(false);
  //   }
  // }

  function handleNewGameButton() {
    // if (onGoingGame) return;
    removeLastBall();
    drawNewBall();
  }

  function removeLastBall() {
    const lastBodyAddedInWorldIndex = engine.current.world.bodies.length - 1;
    const lastBody = engine.current.world.bodies[lastBodyAddedInWorldIndex];
    if (lastBody.label === 'ball') {
      World.remove(engine.current.world, lastBody);
    }
  }

  const drawNewBall = () => {
    const ballXPos = Math.floor(Math.random() * (cw + 1));
    const ball = Bodies.circle(ballXPos, pinSpacing, ballRadius, {
      restitution: 1,
      friction: 0.9,
      label: 'ball',
      render: { fillStyle: 'red' },
    });
    World.add(engine.current.world, [ball]);
  };

  useEffect(() => {
    if (ch === 0) {
      const currentCh = document.body.clientHeight;
      setCh(currentCh);
    }
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
      // Left wall
      World.add(engine.current.world, [
        Bodies.rectangle(-35, 0, pinSpacing, ch * 2, {
          isStatic: true,
          restitution: 1,
          render: { fillStyle: 'transparent' },
        }),
        // Right wall
        Bodies.rectangle(cw + 35, 0, pinSpacing, ch * 2, {
          isStatic: true,
          restitution: 1,
          render: { fillStyle: 'transparent' },
        }),
        // // Bodies.rectangle(0, (2 * rows - 2) * pinSpacing, 2 * cw, ch, {
        // //   isStatic: true,
        // //   render: { fillStyle: 'black' },
        // // }),

        // Bottom wall
        Bodies.rectangle(cw / 2, ch + 20, cw, 100, {
          isStatic: true,
          render: { fillStyle: 'orange' },
        }),
        // Section wall
        // Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true, render: { fillStyle: 'black' } }),
        // Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true, render: { fillStyle: 'black' } }),
      ]);

      for (let row = 0; row < rows; row++) {
        // for (let col = 0; col < cw / pinSpacing / 2; col++) {
        for (let col = 0; col < cols + 1; col++) {
          let x = col * pinSpacing;
          if (row % 2 === 0) {
            x += pinSpacing / 2;
          }
          // pinSpacing / 2 + ((row % 2) * pinSpacing) / 2 + col * pinSpacing; // - (row * pinSpacing) / 2 + col * pinSpacing;
          // const y = (row + 1) * pinSpacing;
          const y = pinSpacing + row * pinSpacing;

          const pin = Bodies.circle(x, y, pinRadius, {
            isStatic: true,
            render: {
              fillStyle: 'black',
            },
          });
          World.add(engine.current.world, [pin]);
        }
      }

      //Create finish boxes
      for (let i = 0; i < cols + 1; i++) {
        const separator = Bodies.rectangle(i * pinSpacing, ch - 50, 10, 100, {
          isStatic: true,
          render: { fillStyle: 'black' },
        });
        World.add(engine.current.world, [separator]);
      }

      //Draw ball
      drawNewBall();

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
    <div style={{ height: '80vh' }}>
      <div style={{ display: 'flex' }}>
        <Button
          onClick={handleNewGameButton}
          // disabled={onGoingGame}
        >
          New game
        </Button>
        <div style={{ display: 'flex' }}>
          <h3>Points: </h3>
          <span>{points}</span>
        </div>
      </div>
      <div ref={scene} />
    </div>
  );
}
