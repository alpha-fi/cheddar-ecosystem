import { PlinkoBoard } from './PlinkoGameboard';

interface Props {
  isMinigame?: boolean;
}

export const PlinkoGame = ({ isMinigame = true }: Props) => {
  return <PlinkoBoard isMinigame={isMinigame} />;
};
