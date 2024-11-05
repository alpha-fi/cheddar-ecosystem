import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from '@/styles/AutoPlayAudio.module.css';
import { Flex } from '@chakra-ui/react';
import { useGlobalContext } from '@/contexts/GlobalContext';

export const AutoPlayAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  const { forcePlayMusic } = useGlobalContext();

  const tracks = ['../../../assets/chezzy-game.mp3', '../../../assets/rap.mp3'];

  function play() {
    audioRef.current!.play().catch((error) => {
      console.log('Autoplay prevented:', error);
    });
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = tracks[currentTrack];
      play();

      const handleEnded = () => {
        setCurrentTrack((prevTrack) => (prevTrack + 1) % tracks.length); // Pasar a la siguiente pista en bucle
      };

      audioRef.current.addEventListener('ended', handleEnded);

      return () => {
        audioRef.current?.removeEventListener('ended', handleEnded);
      };
    }
  }, [currentTrack]);

  useEffect(() => {
    if (forcePlayMusic && audioRef.current) {
      togglePlayPause();
    }
  }, [forcePlayMusic]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
    setIsPlaying((prevValue) => !prevValue);
  };

  const renderPlayIcon = () => {
    return (
      <svg
        fill="#000000"
        width="1rem"
        height="1rem"
        viewBox="0 0 32 32"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>play</title>
        <path d="M5.92 24.096q0 1.088 0.928 1.728 0.512 0.288 1.088 0.288 0.448 0 0.896-0.224l16.16-8.064q0.48-0.256 0.8-0.736t0.288-1.088-0.288-1.056-0.8-0.736l-16.16-8.064q-0.448-0.224-0.896-0.224-0.544 0-1.088 0.288-0.928 0.608-0.928 1.728v16.16z"></path>
      </svg>
    );
  };

  const renderPauseIcon = () => {
    return (
      <svg
        fill="#000000"
        width="1rem"
        height="1rem"
        viewBox="0 0 32 32"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>pause</title>
        <path d="M5.92 24.096q0 0.832 0.576 1.408t1.44 0.608h4.032q0.832 0 1.44-0.608t0.576-1.408v-16.16q0-0.832-0.576-1.44t-1.44-0.576h-4.032q-0.832 0-1.44 0.576t-0.576 1.44v16.16zM18.016 24.096q0 0.832 0.608 1.408t1.408 0.608h4.032q0.832 0 1.44-0.608t0.576-1.408v-16.16q0-0.832-0.576-1.44t-1.44-0.576h-4.032q-0.832 0-1.408 0.576t-0.608 1.44v16.16z"></path>
      </svg>
    );
  };

  return (
    <Flex>
      <audio ref={audioRef}>Your browser does not suppor this audio file</audio>

      <button className={styles.button} onClick={togglePlayPause}>
        {isPlaying ? renderPauseIcon() : renderPlayIcon()}
      </button>
    </Flex>
  );
};
