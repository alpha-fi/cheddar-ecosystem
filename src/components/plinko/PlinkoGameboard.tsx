import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Engine, Render, Bodies, World, Events, Body } from 'matter-js';
import { color } from 'framer-motion';
import { Button } from '@chakra-ui/react';
import { sep } from 'path';
import { GameContext } from '@/contexts/maze/GameContextProvider';

export function PlinkoBoard() {
  const { onClosePlinkoModal, cheddarFound, setCheddarFound } =
    React.useContext(GameContext);

  const [rows, setRows] = useState(7); //This number should be odd to maximize the randomnes of the game
  const [cols, setCols] = useState(11);
  const [cw, setCw] = useState<number>(330);
  const [ch, setCh] = useState<number>(450); //If this get's changed don't forget to change the value on the reference "*change this if ch change*"

  const [pinSpacing, setPinSpacing] = useState<number>(cw / cols);
  const [pinRadius, setPinRadius] = useState(8);

  const [wallPositionAdjust, setWallPositionAdjust] = useState(8);

  const [maxBallsAmount, setMaxBallsAmount] = useState(3);
  const [ballRadius, setBallRadius] = useState(7);
  const [ballBouncines, setBallBouncines] = useState(1);
  const [ballFriction, setBallFriction] = useState(0.1);

  const [ballsQuantity, setBallsQuantity] = useState(0);
  const [ballsYPosition, setBallsYPosition] = useState<number[]>([0]);
  const [ballFinishLines, setBallFinishLines] = useState<
    number[] | undefined
  >();

  const scene = useRef() as React.LegacyRef<HTMLDivElement> | undefined;
  const engine = useRef(Engine.create());

  engine.current.world.gravity.y = 0.6;

  useEffect(() => {
    const balls = engine.current.world.bodies.filter(
      (body) => body.label === 'ball'
    );

    if (balls.length === 0) {
      setBallsYPosition([1 - ballsYPosition[0]]);
    } else {
      const currentBallYPositions = balls.map((ball) => ball.position.y);
      if (
        //If at least 1 ball is not in the end
        currentBallYPositions.filter((ballYPosition) => ballYPosition < 421) //*change this if ch change*
          .length > 0
      ) {
        const newYPositions = [] as number[];

        balls.forEach((ball, index) => {
          newYPositions.push(
            ballsYPosition[index] === ball?.position.y
              ? ballsYPosition[index] - 1
              : ball?.position.y
          );
        });

        setTimeout(() => {
          setBallsYPosition(newYPositions || [0]);
        }, 500);
      } else {
        const separatorArray = engine.current.world.bodies.filter(
          (body) => body.label === 'separator'
        );
        const ballInSeparators = [];
        for (let i = 0; i < balls.length; i++) {
          const ball = balls[i];

          const index = separatorArray.findIndex((separator) => {
            if (ball?.position.x < separator.position.x) {
              return true;
            }
          });

          ballInSeparators.push(index);
        }
        if (ballInSeparators !== ballFinishLines) {
          setBallFinishLines(ballInSeparators);
        }
      }
    }

    if (ballFinishLines && ballFinishLines.length === maxBallsAmount) {
      finishGame();
    }
  }, [ballsYPosition, ballsQuantity]);

  function getCheddarEarnedOnPlinko() {
    //TODO do this function
    return 0;
  }

  function finishGame() {
    setCheddarFound(cheddarFound + getCheddarEarnedOnPlinko());
    onClosePlinkoModal();
  }

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
        restitution: ballBouncines,
        friction: ballFriction,
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

    if (allBalls.length < maxBallsAmount) {
      const currentXPosition =
        e.clientX - document.body.clientWidth / 2 + cw / 2 - ballRadius;
      drawNewBall(currentXPosition);
      setBallsQuantity(ballsQuantity + 1);
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
      if (engine.current.world.bodies.length > 0) {
        World.clear(engine.current.world, false);
      }

      //Create world
      // Left wall
      World.add(engine.current.world, [
        Bodies.rectangle(
          -pinSpacing + wallPositionAdjust,
          0,
          pinSpacing,
          ch * 2,
          {
            isStatic: true,
            restitution: 1,
            render: { fillStyle: 'transparent' },
          }
        ),
        // Right wall
        Bodies.rectangle(
          cw + pinSpacing - wallPositionAdjust,
          0,
          pinSpacing,
          ch * 2,
          {
            isStatic: true,
            restitution: 1,
            render: { fillStyle: 'transparent' },
          }
        ),

        // Bottom wall
        Bodies.rectangle(cw / 2, ch + 30, cw, 100, {
          isStatic: true,
          render: { fillStyle: 'orange' },
        }),
      ]);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols + 1; col++) {
          let x = col * pinSpacing;
          if (row % 2 === 0) {
            x += pinSpacing / 2;
          }
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
  }, []);

  return (
    <div
      style={{
        height: '70%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'left' }}>
        <Button onClick={pushBall}>Hit machine</Button>
      </div>
      <div ref={scene} onClick={handleDropNewBall} />
    </div>
  );
}
