import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import Matter, { Engine, Render, Bodies, World, Body } from 'matter-js';
import { color } from 'framer-motion';
import { Button, useDisclosure } from '@chakra-ui/react';
import { sep } from 'path';
import { GameContext } from '@/contexts/maze/GameContextProvider';
import ModalRules from './ModalRules';

export function PlinkoBoard() {
  const { cheddarFound, setCheddarFound, isMobile } =
    React.useContext(GameContext);

  const [rows, setRows] = useState(7); //This number should be odd to maximize the randomnes of the game
  const [cols, setCols] = useState(8);
  const [cw, setCw] = useState<number>(330);
  const [ch, setCh] = useState<number>(450); //If this get's changed don't forget to change the value on the reference "*change this if ch change*"

  const [pinSpacing, setPinSpacing] = useState<number>(cw / cols);
  const [pinRadius, setPinRadius] = useState(8);

  const [wallPositionAdjust, setWallPositionAdjust] = useState(9);

  const [maxBallsAmount, setMaxBallsAmount] = useState(3);
  const [ballRadius, setBallRadius] = useState(12);
  const [ballBouncines, setBallBouncines] = useState(1);
  const [ballFriction, setBallFriction] = useState(0.1);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const [hitMachineForceMagnitude, setHitMachineForceMagnitude] = useState(0.05)

  const [thrownBallsQuantity, setThrownBallsQuantity] = useState(0);
  const [ballsYPosition, setBallsYPosition] = useState<number[]>(
    Array.from(Array(maxBallsAmount).keys()).fill(0)
  );
  const [ballFinishLines, setBallFinishLines] = useState<
    number[] | undefined
  >();

  const [currentXPreview, setCurrentXPreview] = useState<undefined | number>();

  const scene = useRef() as React.LegacyRef<HTMLDivElement> | undefined;
  const engine = useRef(Engine.create());

  engine.current.world.gravity.y = 0.3;

  const {
    isOpen: isOpenModalRules,
    onOpen: onOpenModalRules,
    onClose: onCloseModalRules,
  } = useDisclosure();

  useEffect(() => {
    const thrownBalls = engine.current.world.bodies.filter(
      (body) => body.label === 'ball'
    );

    const currentBallYPositions = thrownBalls.map((ball) => ball.position.y);
    if (
      //If at least 1 ball is not in the end
      currentBallYPositions.filter((ballYPosition) => ballYPosition < 350) // change this if ch change
        .length > 0
    ) {
      const newYPositions = [] as number[];

      ballsYPosition.forEach((ballYPosition, index) => {
        const ball = thrownBalls[index];
        newYPositions.push(
          ballYPosition === ball?.position.y
            ? ballYPosition - 1
            : ball?.position.y
        );
      });

      setTimeout(() => {
        setBallsYPosition(newYPositions);
      }, 500);
    } else {
      const separatorArray = engine.current.world.bodies.filter(
        (body) => body.label === 'separator'
      );
      const ballSeparatorIndexArray = [];
      for (let i = 0; i < thrownBalls.length; i++) {
        const ball = thrownBalls[i];

        const index = separatorArray.findIndex((separator) => {
          return ball?.position.x < separator.position.x;
        });

        ballSeparatorIndexArray.push(index);
      }
      if (ballSeparatorIndexArray !== ballFinishLines) {
        setBallFinishLines(ballSeparatorIndexArray);
      }
    }

    if (ballFinishLines && ballFinishLines.length === maxBallsAmount) {
      finishGame();
    }
  }, [ballsYPosition, thrownBallsQuantity]);

  function getCheddarEarnedOnPlinko() {
    //TODO do this function
    return 0;
  }

  function finishGame() {
    if (isGameFinished) return;
    setCheddarFound(cheddarFound + getCheddarEarnedOnPlinko());
    setIsGameFinished(true);
  }

  function removeLastBall(ball: any) {
    World.remove(engine.current.world, ball);
  }

  const drawBallPreview = (xPosition: number) => {
    const yPosition = pinSpacing;
    const ballPreview = Bodies.circle(xPosition, yPosition, ballRadius, {
      restitution: 0,
      friction: 0,
      isStatic: true,
      label: 'ballPreview',
      render: { fillStyle: '#FF0000AA' },
      collisionFilter: {
        group: -1,
        category: 0x0002,
        mask: 0x0002,
      },
    });
    World.add(engine.current.world, [ballPreview]);
  };

  const drawNewBall = (xPosition: number) => {
    const ballXPosDeviation = Math.floor(Math.random() * 17) - 5;
    const yPosition = pinSpacing;
    const ball = Bodies.circle(
      xPosition + ballXPosDeviation,
      yPosition,
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

  function getCurrentXPosition(x: number) {
    return x - document.body.clientWidth / 2 + cw / 2 + ballRadius;
  }

  function handleShowNewBallPreviewMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (thrownBallsQuantity >= maxBallsAmount) return;
    const mouseXPosition = getCurrentXPosition(e.clientX);
    setCurrentXPreview(mouseXPosition);

    handleShowNewBallPreview(mouseXPosition);
  }

  function handleShowNewBallPreviewTouch(e: React.TouchEvent<HTMLDivElement>) {
    const touchXPosition = e.touches[e.touches.length - 1].clientX;
    const previewBallXPosition = touchXPosition - pinSpacing;

    setCurrentXPreview(previewBallXPosition);

    handleShowNewBallPreview(previewBallXPosition);
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    const preview = engine.current.world.bodies.find(
      (body) => body.label === 'ballPreview'
    );

    if (preview) World.remove(engine.current.world, preview!);

    handleDropNewBall();
    setCurrentXPreview(undefined);
  }

  function handleShowNewBallPreview(x: number) {
    const allBalls = engine.current.world.bodies.filter(
      (body) => body.label === 'ball'
    );
    const preview = engine.current.world.bodies.find(
      (body) => body.label === 'ballPreview'
    );

    // const currentXPosition = getCurrentXPosition(x);
    const currentXPosition = x;

    if (allBalls.length < maxBallsAmount) {
      if (preview) {
        //Move preview ball
        Matter.Body.setPosition(preview, {
          x: currentXPosition,
          y: pinSpacing,
        });
      } else {
        drawBallPreview(currentXPosition);
      }
    }
  }

  function handleMouseDropNewBall(e: React.MouseEvent<HTMLDivElement>) {
    handleDropNewBall();
  }

  function handleDropNewBall() {
    const preview = engine.current.world.bodies.find(
      (body) => body.label === 'ballPreview'
    );
    const allBalls = engine.current.world.bodies.filter(
      (body) => body.label === 'ball'
    );

    if (preview) {
      World.remove(engine.current.world, preview);
    }
    if (allBalls.length < maxBallsAmount) {
      // const currentXPosition = getCurrentXPosition(currentXPreview!);
      const currentXPosition = currentXPreview!;

      drawNewBall(currentXPosition);
      setThrownBallsQuantity(thrownBallsQuantity + 1);
    }
  }

  //This function aply a force in the balls. It's used to unstuck balls if necessary.
  const pushBall = () => {
    const allBalls = engine.current.world.bodies.filter(
      (body) => body.label === 'ball'
    );

    allBalls.forEach((ball) => {
      const forceDirection = Math.random() < 0.5 ? -0.05 : 0.05;
      Body.applyForce(ball, ball.position, {
        x: hitMachineForceMagnitude * forceDirection,
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

          const pinDecorative = Bodies.circle(x, y, pinRadius * 2, {
            isStatic: true,
            collisionFilter: {
              group: -1,
              category: 0x0002,
              mask: 0x0002,
            },
            render: {
              fillStyle: 'rgb(200, 129, 247, 0.5)',
            },
          });
          World.add(engine.current.world, [pin, pinDecorative]);
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
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'left',
          gap: '1rem',
        }}
      >
        <Button onClick={pushBall}>Hit machine</Button>
        <Button onClick={onOpenModalRules}>Rules</Button>
        <span>Balls left: {maxBallsAmount - thrownBallsQuantity}</span>
      </div>
      <div
        ref={scene}
        onMouseMove={isMobile ? () => {} : handleShowNewBallPreviewMouse}
        onTouchMove={handleShowNewBallPreviewTouch}
        onTouchStart={handleShowNewBallPreviewTouch}
        onTouchEnd={handleTouchEnd}
        onMouseUp={isMobile ? () => {} : handleMouseDropNewBall}
      />

      <ModalRules isOpen={isOpenModalRules} onClose={onCloseModalRules} />
    </div>
  );
}
