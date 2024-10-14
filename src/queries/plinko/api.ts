import { getConfig } from '@/configs/config';

const { backendBaseUrl } = getConfig();
export type BlockchainType = 'base' | 'near';

export interface EndGameRequest {
  data: {
    prizeEarned: 'giga' | 'mega' | 'micro' | 'nano' | 'splat';
  };
  metadata: {
    blockchain: BlockchainType;
    accountId: string | `0x${string}`;
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
