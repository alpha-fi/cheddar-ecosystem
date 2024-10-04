import { getConfig } from '@/configs/config';
import { GOALS } from '@/constants/plinko';

const { backendBaseUrl } = getConfig();

export interface EndGameRequest {
  data: {
    prizeEarned: 'giga' | 'mega' | 'micro' | 'nano' | 'splat';
  };
  metadata: {
    accountId: string;
    seedId: number;
  };
}

export async function callEndGame(endGameData: EndGameRequest) {
  const url = new URL(`api/plinko/endGame`, backendBaseUrl).toString();

  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(endGameData),
  });
  return response.json();
}

export async function callBallPlayed(accountId: string, prizeName: string) {
  const data = {
    accountId,
    prizeName,
  };
  const url = new URL(`/api/plinko/ballPlayed`, backendBaseUrl).toString();

  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function callBallsPlayed(
  accountId: string,
  prizesNames: string[]
) {
  const data = {
    accountId,
    prizesNames,
  };
  const url = new URL(`/api/plinko/ballPlayed`, backendBaseUrl).toString();

  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
