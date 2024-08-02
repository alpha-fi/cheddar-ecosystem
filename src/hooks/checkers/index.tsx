import {
  getAvailableGames,
  getAvailablePlayers,
  getGame,
} from '@/contracts/checkers/checkersCalls';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

export const useGetAvailableCheckersPlayers = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['useGetAvailableCheckersPlayers'],
    queryFn: getAvailablePlayers,
    refetchInterval: 3000,
    staleTime: 3000,
  });
};

export const useGetAvailableCheckersGames = (): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['useGetAvailableCheckersGames'],
    queryFn: getAvailableGames,
    refetchInterval: 3000,
    staleTime: 3000,
  });
};

export const useGetCheckersGame = (gameId: number): UseQueryResult<any> => {
  return useQuery({
    queryKey: ['useGetCheckerGame', gameId],
    queryFn: () => getGame(gameId),
    refetchInterval: 3000,
    staleTime: 3000,
  });
};
