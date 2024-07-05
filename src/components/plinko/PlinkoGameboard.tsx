import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import Matter, { Engine, Render, Bodies, World, Body } from 'matter-js';
import { color } from 'framer-motion';
import styles from '@/styles/PlinkoGameboard.module.css';
import {
  Button,
  useDisclosure,
  withDefaultColorScheme,
} from '@chakra-ui/react';
import { sep } from 'path';
import { GameContext } from '@/contexts/maze/GameContextProvider';
import ModalRules from './ModalRules';
import { RenderCheddarIcon } from '../maze/RenderCheddarIcon';
import {
  BALL_BOUNCINES,
  BALL_FRICTION,
  BALL_RADIUS,
  CURRENT_WIDTH,
  GOALS,
  GRAVITY,
  HIT_MACHINE_FORCE_MAGNITUDE,
  INITIAL_CURRENT_HEIGHT,
  MAX_BALLS_AMOUNT,
  PIN_RADIUS,
  PIN_SPACING,
  ROWS,
  WALL_POSITION_ADJUST,
} from '@/constants/plinko';

export function PlinkoBoard() {
  const { cheddarFound, setCheddarFound, isMobile } =
    React.useContext(GameContext);

  const [currentHeight, setCurrentHeight] = useState<number>(
    INITIAL_CURRENT_HEIGHT
  );
  const prizesData = [
    { name: 'SPLAT', cheddar: 0 },
    { name: 'NANO', cheddar: 5 },
    { name: 'MICRO', cheddar: 10 },
    { name: 'MEGA', cheddar: 25 },
    { name: 'GIGA', cheddar: 55 },
  ];
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [thrownBallsQuantity, setThrownBallsQuantity] = useState(0);
  const [ballFinishLines, setBallFinishLines] = useState<number[]>([]);
  const [currentXPreview, setCurrentXPreview] = useState<undefined | number>();
  const [prize, setPrize] = useState<number>();
  const [showPrize, setShowPrize] = useState(false);
  const [ballsYPosition, setBallsYPosition] = useState<number[]>(
    Array.from(Array(MAX_BALLS_AMOUNT).keys()).fill(0)
  );

  const scene = useRef() as React.LegacyRef<HTMLDivElement> | undefined;
  const engine = useRef(Engine.create());

  const {
    isOpen: isOpenModalRules,
    onOpen: onOpenModalRules,
    onClose: onCloseModalRules,
  } = useDisclosure();

  useEffect(() => {
    engine.current.world.gravity.y = GRAVITY;
  }, []);

  useEffect(() => {
    const thrownBalls = engine.current.world.bodies.filter(
      (body) => body.label === 'ball'
    );

    const currentBallYPositions = thrownBalls.map((ball) => ball.position.y);
    if (
      currentBallYPositions.filter(
        (ballYPosition) => ballYPosition <= currentHeight
      ).length > 0
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
      }, 100);
    }

    const ballsInGoal = thrownBalls.filter(
      (ball) => ball.position.y > currentHeight
    );

    if (ballsInGoal.length > 0) {
      const separatorArray = engine.current.world.bodies.filter(
        (body) => body.label === 'separator'
      );
      const ballSeparatorIndexArray = [] as number[];

      for (let i = 0; i < ballsInGoal.length; i++) {
        const ball = ballsInGoal[i];

        const index = separatorArray.findIndex((separator) => {
          return ball?.position.x < separator.position.x;
        });

        ballSeparatorIndexArray.push(index);

        if (ball.position.y > currentHeight) {
          setBallFinishLines((prevState) => [
            ...prevState,
            ...ballSeparatorIndexArray,
          ]);
          removeBody(ball);
        }
      }
    }
  }, [ballsYPosition, thrownBallsQuantity]);

  useEffect(() => {
    let finalPrize = 0;
    ballFinishLines.forEach((finishGoal) => {
      const cheddarEarned = prizesData.find((prizeData) => {
        return (
          prizeData.name.toUpperCase() === GOALS[finishGoal - 1].toUpperCase()
        );
      })?.cheddar;

      finalPrize += cheddarEarned!;
    });

    if (ballFinishLines.length > 0) setPrize(finalPrize); // si se obtiene el mismo valor que una pasada anterior el useeffect de prize no se disparara
    if (ballFinishLines && ballFinishLines.length === MAX_BALLS_AMOUNT) {
      finishGame();
    }
  }, [ballFinishLines]);

  useEffect(() => {
    if (prize !== undefined) {
      setShowPrize(true);

      setTimeout(() => {
        setShowPrize(false);
      }, 2000);
    }
  }, [prize]);

  function getCheddarEarnedOnPlinko() {
    //TODO do this function
    return 0;
  }

  function finishGame() {
    if (isGameFinished) return;
    setCheddarFound(cheddarFound + getCheddarEarnedOnPlinko());
    setIsGameFinished(true);
  }

  function removeBody(body: Matter.Body) {
    World.remove(engine.current.world, body);
  }

  const drawBallPreview = (xPosition: number) => {
    const yPosition = PIN_SPACING;
    const ballPreview = Bodies.circle(xPosition, yPosition, BALL_RADIUS, {
      restitution: 0,
      friction: 0,
      isStatic: true,
      label: 'ballPreview',
      render: { fillStyle: 'rgb(245, 152, 47, 0.8)' },
      collisionFilter: {
        group: -1,
        category: 0x0002,
        mask: 0x0002,
      },
    });
    World.add(engine.current.world, [ballPreview]);
  };

  const createLetter = (
    char: string,
    x: number,
    y: number,
    width: number,
    height: number,
    fontSize: number,
    fillColor: string,
    label: string
  ) => {
    const letter = Matter.Bodies.rectangle(x, y, 40, 60, {
      isStatic: true,
      label: label,
      render: {
        sprite: {
          texture: `data:image/svg+xml;utf8,
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="${width}"
              height="${height}"
            >
              <text
                x="10%"
                y="10%"
                dominant-baseline="middle"
                font-weight="bold"
                text-anchor="middle"
                font-family="Arial"
                font-size="${fontSize}"
                fill="${fillColor}"
              >
                ${char}
              </text>
            </svg>`,
          xScale: 1,
          yScale: 1,
        },
      },
      collisionFilter: {
        group: -1,
        category: 0x0002,
        mask: 0x0002,
      },
    });
    return letter;
  };

  const drawNewBall = (xPosition: number) => {
    const ballXPosDeviation = Math.floor(Math.random() * 17) - 5;
    const yPosition = PIN_SPACING;
    const ball = Bodies.circle(
      xPosition + ballXPosDeviation,
      yPosition,
      BALL_RADIUS,
      {
        restitution: BALL_BOUNCINES,
        friction: BALL_FRICTION,
        label: 'ball',
        render: { fillStyle: 'rgb(245, 152, 47)' },
      }
    );
    World.add(engine.current.world, [ball]);
  };

  function getCurrentXPosition(x: number) {
    return x - document.body.clientWidth / 2 + CURRENT_WIDTH / 2 + BALL_RADIUS;
  }

  function handleShowNewBallPreviewMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (thrownBallsQuantity >= MAX_BALLS_AMOUNT) return;
    const mouseXPosition = getCurrentXPosition(e.clientX);
    setCurrentXPreview(mouseXPosition);

    handleShowNewBallPreview(mouseXPosition);
  }

  function handleShowNewBallPreviewTouch(e: React.TouchEvent<HTMLDivElement>) {
    const touchXPosition = e.touches[e.touches.length - 1].clientX;
    const previewBallXPosition = touchXPosition - PIN_SPACING;

    setCurrentXPreview(previewBallXPosition);

    handleShowNewBallPreview(previewBallXPosition);
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    const preview = engine.current.world.bodies.find(
      (body) => body.label === 'ballPreview'
    );

    if (preview) removeBody(preview!);

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

    if (allBalls.length < MAX_BALLS_AMOUNT) {
      if (preview) {
        //Move preview ball
        Matter.Body.setPosition(preview, {
          x: currentXPosition,
          y: PIN_SPACING,
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
      removeBody(preview);
    }
    if (allBalls.length + ballFinishLines.length < MAX_BALLS_AMOUNT) {
      // const currentXPosition = getCurrentXPosition(currentXPreview!);
      const currentXPosition = currentXPreview!;

      drawNewBall(currentXPosition);
      setThrownBallsQuantity(thrownBallsQuantity + 1);
    }
  }

  //This function apply a force in the balls. It's used to unstuck balls if necessary.
  const pushBall = () => {
    const allBalls = engine.current.world.bodies.filter(
      (body) => body.label === 'ball'
    );

    allBalls.forEach((ball) => {
      const forceDirection = Math.random() < 0.5 ? -0.05 : 0.05;
      Body.applyForce(ball, ball.position, {
        x: HIT_MACHINE_FORCE_MAGNITUDE * forceDirection,
        y: 0,
      });
    });
  };

  useEffect(() => {
    if (currentHeight === 0) {
      const currentCh = document.body.clientHeight;
      setCurrentHeight(currentCh);
    }
    if (scene) {
      const render = Render.create({
        //@ts-ignore
        element: scene!.current,
        engine: engine.current,
        options: {
          width: CURRENT_WIDTH,
          height: currentHeight,
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
          -PIN_SPACING + WALL_POSITION_ADJUST,
          0,
          PIN_SPACING,
          currentHeight * 2,
          {
            isStatic: true,
            restitution: 1,
            render: { fillStyle: 'transparent' },
          }
        ),
        // Right wall
        Bodies.rectangle(
          CURRENT_WIDTH + PIN_SPACING - WALL_POSITION_ADJUST,
          0,
          PIN_SPACING,
          currentHeight * 2,
          {
            isStatic: true,
            restitution: 1,
            render: { fillStyle: 'transparent' },
          }
        ),

        // Bottom wall
        Bodies.rectangle(
          CURRENT_WIDTH / 2,
          currentHeight + 30,
          CURRENT_WIDTH,
          100,
          {
            isStatic: true,
            collisionFilter: {
              group: -1,
              category: 0x0002,
              mask: 0x0002,
            },
            render: { fillStyle: 'rgb(255, 255, 255, 0.7)' },
          }
        ),
      ]);

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < GOALS.length + 1; col++) {
          let x = col * PIN_SPACING;
          if (row % 2 === 0) {
            x += PIN_SPACING / 2;
          }
          const y = PIN_SPACING + row * PIN_SPACING + currentHeight / 20;

          const pin = Bodies.circle(x, y, PIN_RADIUS, {
            isStatic: true,
            render: {
              fillStyle: 'white',
            },
          });

          const pinDecorative1 = Bodies.circle(x, y, PIN_RADIUS * 1.5, {
            isStatic: true,
            collisionFilter: {
              group: -1,
              category: 0x0002,
              mask: 0x0002,
            },
            render: {
              fillStyle: 'rgb(250, 250, 250, 0.5)',
            },
          });

          const pinDecorative2 = Bodies.circle(x, y, PIN_RADIUS * 2, {
            isStatic: true,
            collisionFilter: {
              group: -1,
              category: 0x0002,
              mask: 0x0002,
            },
            render: {
              fillStyle: 'rgb(0, 0, 0, 0.1)',
            },
          });
          World.add(engine.current.world, [
            pinDecorative2,
            pinDecorative1,
            pin,
          ]);
        }
      }

      //Create finish boxes
      for (let i = 0; i < GOALS.length + 1; i++) {
        const separator = Bodies.rectangle(
          i * PIN_SPACING,
          currentHeight - 50,
          10,
          100,
          {
            isStatic: true,
            label: 'separator',
            friction: 3,
            render: { fillStyle: 'white' },
          }
        );
        const border = Bodies.circle(
          i * PIN_SPACING,
          currentHeight - 100,
          5.1,
          {
            isStatic: true,
            label: 'separator-tip',
            render: { fillStyle: 'white' },
          }
        );

        if (!GOALS[i]) {
          World.add(engine.current.world, [separator, border]);
        } else {
          const goalName = GOALS[i]
            .split('')
            .map((char, charIndex) =>
              createLetter(
                char,
                i * PIN_SPACING + PIN_SPACING,
                currentHeight - 60 + 12 * charIndex,
                50,
                60,
                14,
                'black',
                'goalName'
              )
            );
          World.add(engine.current.world, [separator, border, ...goalName]);
        }
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
    <div className={styles.plinkoBoardContainer}>
      <div className={styles.headerContainer}>
        <Button onClick={pushBall}>Shake</Button>
        <Button onClick={onOpenModalRules}>Rules</Button>
        <span>Balls left: {MAX_BALLS_AMOUNT - thrownBallsQuantity}</span>
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

      <div className={styles.displayablePrizeContainer}>
        <span
          className={`${styles.displayablePrize} ${showPrize ? styles.show : styles.hide}`}
        >
          +{prize} {RenderCheddarIcon({ height: '2rem', width: '2rem' })}
        </span>
      </div>
    </div>
  );
}
