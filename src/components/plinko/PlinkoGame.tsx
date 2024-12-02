import { PlinkoContextProvider } from '@/contexts/plinko/PlinkoContextProvider';
import { PlinkoBoard } from './PlinkoGameboard';

interface Props {
  isMinigame?: boolean;
}

export const PlinkoGame = ({ isMinigame = true }: Props) => {
  return (
    <PlinkoContextProvider>
      <PlinkoBoard isMinigame={isMinigame} />
    </PlinkoContextProvider>
  );
};
