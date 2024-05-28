export async function isAllowed(accountId: string) {
  const response = await fetch(
    `http://localhost:3001/api/maze/isAllowed?accountId=${accountId}`
  );
  const jsonResponse = await response.json();
  return jsonResponse;
}

export async function getSeedId(accountId: string) {
  const data = {
    accountId,
  };
  const response = await fetch('http://localhost:3001/api/maze/getSeedId', {
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
      cheddarEarned: number
      score: number
      path: number[]
  }
  metadata: {
      accountId: string
      seedId: number
  }
}

export async function callEndGame(endGameData: EndGameRequest) {
  const response = await fetch('http://localhost:3001/api/maze/endGame', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(endGameData),
  });
  return response.json();
}