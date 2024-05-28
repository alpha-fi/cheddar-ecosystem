import { getConfig } from '@/configs/config';

const { backendBaseUrl } = getConfig();

export async function isAllowed(accountId: string) {
  const url = new URL(
    `api/maze/isAllowed?accountId=${accountId}`,
    backendBaseUrl
  ).toString();
  const response = await fetch(url);
  const jsonResponse = await response.json();
  console.log('isAllowed response', jsonResponse);
  return jsonResponse;
}

export async function getSeedId(accountId: string) {
  const data = {
    accountId,
  };
  const url = new URL(`api/maze/getSeedId`, backendBaseUrl).toString();

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

export interface EndGameRequest {
  data: {
    cheddarEarned: number;
    score: number;
    path: number[];
  };
  metadata: {
    accountId: string;
    seedId: number;
  };
}

export async function callEndGame(endGameData: EndGameRequest) {
  const url = new URL(`api/maze/endGame`, backendBaseUrl).toString();

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
