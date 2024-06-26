import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Engine, Render, Bodies, World, Events, Body } from 'matter-js';
import { color } from 'framer-motion';
import { Button } from '@chakra-ui/react';
import { sep } from 'path';

export function PlinkoBoard() {
  const [points, setPoints] = useState(0);
  const [onGoingGame, setOnGoingGame] = useState(true);

  const [rows, setRows] = useState(9);
  const [cols, setCols] = useState(11);
  const [pinRadius, setPinRadius] = useState(9);
  const [ballRadius, setBallRadius] = useState(7);
  const [ballYPosition, setBallYPosition] = useState<number>(0);
  const scene = useRef() as React.LegacyRef<HTMLDivElement> | undefined;
  const engine = useRef(Engine.create());

  engine.current.world.gravity.y = 0.5;
  // const [cw, setCw] = useState<number>(document.body.clientWidth);
  // const [ch, setCh] = useState<number>(document.body.clientHeight);
  const [cw, setCw] = useState<number>(360);
  const [ch, setCh] = useState<number>(450);
  const [pinSpacing, setPinSpacing] = useState<number>(cw / cols);

  // const lastBody = engine.current.world.bodies[lastBodyAddedInWorldIndex];
  // const positionY = React.useMemo(() => {
  //   return lastBody?.position.y;
  // }, [lastBody?.position.y]);

  // if (lastBody) console.log('positionY: ', positionY);

  // if (lastBody && lastBody.label === 'ball') {
  //   if (onGoingGame && lastBody.position.y >= 655) {
  //     setOnGoingGame(false);
  //   }
  // }

  // function handleNewGameButton() {
  //   const ball = engine.current.world.bodies.find(
  //     (body) => body.label === 'ball'
  //   );
  //   if (ball && ball.position.y >= 655) {
  //     removeLastBall(ball);
  //     drawNewBall();
  //   }
  // }

  useEffect(() => {
    const ball = engine.current.world.bodies.find(
      (body) => body.label === 'ball'
    );
    if (!ball) {
      setBallYPosition(1 - ballYPosition);
    } else if (ball.position.y < 655) {
      const newYPosition =
        ballYPosition === ball?.position.y
          ? ballYPosition - 1
          : ball?.position.y;
      setTimeout(() => {
        setBallYPosition(newYPosition || 0);
      }, 500);
    } else {
      const separatorArray = engine.current.world.bodies.filter(
        (body) => body.label === 'separator'
      );
      const index = separatorArray.findIndex((separator, index) => {
        if (ball?.position.x < separator.position.x) {
          return true;
        }
      });
    }
  }, [ballYPosition]);

  function removeLastBall(ball: any) {
    World.remove(engine.current.world, ball);
  }

  const drawNewBall = (xPosition: number) => {
    const ballXPosDeviation = Math.floor(Math.random() * 11) - 5;
    const ball = Bodies.circle(
      xPosition + ballXPosDeviation,
      pinSpacing,
      ballRadius,
      {
        restitution: 1,
        friction: 0.9,
        label: 'ball',
        render: { fillStyle: 'red' },
      }
    );
    World.add(engine.current.world, [ball]);
  };

  function handleDropNewBall(e: React.MouseEvent<HTMLDivElement>) {
    const allBalls = engine.current.world.bodies.filter(
      (body) => body.label === 'ball'
    );

    if (allBalls.length < 3) {
      const currentXPosition = e.clientX;
      drawNewBall(currentXPosition);
    }
  }

  //This function aply a force in the balls. It's used to unstuck balls if necesary.
  const pushBall = () => {
    const allBalls = engine.current.world.bodies.filter(
      (body) => body.label === 'ball'
    );

    allBalls.forEach((ball) => {
      const forceMagnitude = 0.02;
      const forceDirection = Math.random() < 0.5 ? -0.05 : 0.05;
      Body.applyForce(ball, ball.position, {
        x: forceMagnitude * forceDirection,
        y: 0,
      });
    });
  };

  useEffect(
    () => {
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
        if (engine.current.world.bodies.length > 0) {
          World.clear(engine.current.world, false);
        }

        //Create world
        // Left wall
        World.add(engine.current.world, [
          Bodies.rectangle(-pinSpacing + 10, 0, pinSpacing, ch * 2, {
            isStatic: true,
            restitution: 1,
            render: { fillStyle: 'transparent' },
          }),
          // Right wall
          Bodies.rectangle(cw + pinSpacing - 10, 0, pinSpacing, ch * 2, {
            isStatic: true,
            restitution: 1,
            render: { fillStyle: 'transparent' },
          }),
          // // Bodies.rectangle(0, (2 * rows - 2) * pinSpacing, 2 * cw, ch, {
          // //   isStatic: true,
          // //   render: { fillStyle: 'black' },
          // // }),

          // Bottom wall
          Bodies.rectangle(cw / 2, ch + 30, cw, 100, {
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
            const y = pinSpacing + row * pinSpacing + ch / 20;

            const pin = Bodies.circle(x, y, pinRadius, {
              isStatic: true,
              render: {
                fillStyle: 'black',
              },
            });
            World.add(engine.current.world, [pin]);
          }
        }

        // pinSpacing (600/11)
        // 0 -> 5 --> 54.54
        //Create finish boxes
        for (let i = 0; i < cols + 1; i++) {
          const separator = Bodies.rectangle(i * pinSpacing, ch - 50, 10, 100, {
            isStatic: true,
            label: 'separator',
            render: { fillStyle: 'black' },
          });
          const triangle = Bodies.polygon(i * pinSpacing, ch - 103, 3, 6.1, {
            isStatic: true,
            angle: Math.PI / 2,
            label: 'tip-separator',
            render: { fillStyle: 'black' },
          });
          World.add(engine.current.world, [separator, triangle]);
        }

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
    },
    [] /*[document.body.clientWidth, document.body.clientHeight]*/
  );

  return (
    <div style={{ height: '80vh' }}>
      <div style={{ display: 'flex' }}>
        {
          //   <Button
          //   onClick={handleNewGameButton}
          //   // disabled={onGoingGame}
          // >
          //   New game
          // </Button>
        }
        <Button onClick={pushBall}>
          Hit machine
        </Button>
        <div style={{ display: 'flex' }}>
          <h3>Points: </h3>
          <span>{points}</span>
        </div>
      </div>
      <div ref={scene} onClick={handleDropNewBall} />
    </div>
  );
}
