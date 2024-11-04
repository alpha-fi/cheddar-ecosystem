import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from '@/styles/AutoPlayAudio.module.css';
import { Flex } from '@chakra-ui/react';

export const AutoPlayAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  const tracks = ['../../../assets/chezzy-game.mp3', '../../../assets/rap.mp3'];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = tracks[currentTrack];
      audioRef.current.play().catch((error) => {
        console.log('Autoplay prevented:', error);
      });

      const handleEnded = () => {
        setCurrentTrack((prevTrack) => (prevTrack + 1) % tracks.length); // Pasar a la siguiente pista en bucle
      };

      audioRef.current.addEventListener('ended', handleEnded);

      return () => {
        audioRef.current?.removeEventListener('ended', handleEnded);
      };
    }
  }, [currentTrack]);

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

  const renderUnmuteIcon = () => {
    return (
      <svg
        width="1rem"
        height="1rem"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_15_174)">
          <rect width="24" height="24" fill="white" />
          <path
            d="M3 16V8H6L11 4V20L6 16H3Z"
            stroke="#000000"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13 9C13 9 15 9.5 15 12C15 14.5 13 15 13 15"
            stroke="#000000"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15 7C15 7 18 7.83333 18 12C18 16.1667 15 17 15 17"
            stroke="#000000"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M17 5C17 5 21 6.16667 21 12C21 17.8333 17 19 17 19"
            stroke="#000000"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_15_174">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  };

  const renderMuteIcon = () => {
    return (
      <svg
        width="1rem"
        height="1rem"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_15_183)">
          <rect width="24" height="24" fill="white" />
          <path
            d="M3 16V8H6L11 4V20L6 16H3Z"
            stroke="#000000"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M14.5 15L20.5 9"
            stroke="#000000"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M14.5 9L20.5 15"
            stroke="#000000"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_15_183">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  };

  return (
    <Flex>
      <audio ref={audioRef}>Your browser does not suppor this audio file</audio>

      <button className={styles.button} onClick={togglePlayPause}>
        {isPlaying ? renderUnmuteIcon() : renderMuteIcon()}
      </button>
    </Flex>
  );
};
