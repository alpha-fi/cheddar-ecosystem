import { PlayerScoreData } from '@/components/maze/Scoreboard';
import { getConfig } from '@/configs/config';

const { backendBaseUrl, holonym } = getConfig();

export async function getPendingCheddarToMint(accountId: string) {
  try {
    const url = new URL(
      `api/maze/pendingCheddar?accountId=${accountId}`,
      backendBaseUrl
    ).toString();
    const response = await fetch(url);
    if (!response.ok) {
      const jsonResponse = await response.json();
      throw new Error(
        jsonResponse.errors ||
          `Failed to fetch pending cheddar for account: ${accountId}`
      );
    }
    const jsonResponse = await response.json();
    return jsonResponse.ok ? jsonResponse.pendingCheddarToMint : 0;
  } catch (error) {
    console.error('Error in getPendingCheddarToMint:', error);
    throw error;
  }
}

export async function getEarnedButNotMinted(accountId: string) {
  try {
    const url = new URL(
      `api/maze/getNonMintedCheddar?accountId=${accountId}`,
      backendBaseUrl
    ).toString();
    const response = await fetch(url);
    if (!response.ok) {
      const jsonResponse = await response.json();
      throw new Error(
        jsonResponse.errors ||
          `Failed to fetch non-minted cheddar for account: ${accountId}`
      );
    }
    const jsonResponse = await response.json();
    return jsonResponse.ok ? jsonResponse.pendingCheddarToMint : 0;
  } catch (error) {
    console.error('Error in getEarnedButNotMinted:', error);
    throw error;
  }
}

export async function getEarnedAndMinted(accountId: string) {
  try {
    const url = new URL(
      `api/maze/mintedCheddar?accountId=${accountId}`,
      backendBaseUrl
    ).toString();
    const response = await fetch(url);
    if (!response.ok) {
      const jsonResponse = await response.json();
      throw new Error(
        jsonResponse.errors ||
          `Failed to fetch minted cheddar for account: ${accountId}`
      );
    }
    const jsonResponse = await response.json();
    return jsonResponse.ok ? jsonResponse.totalMinted : 0;
  } catch (error) {
    console.error('Error in getEarnedAndMinted:', error);
    throw error;
  }
}

export async function getSeedId(accountId: string) {
  try {
    const data = { accountId };
    const url = new URL(`api/maze/getSeedId`, backendBaseUrl).toString();
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const jsonResponse = await response.json();
      throw new Error(
        jsonResponse.errors || `Failed to get seed ID for account: ${accountId}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getSeedId:', error);
    throw error;
  }
}

export async function getScoreBoard() {
  try {
    const url = new URL(`/api/maze/scoreboard`, backendBaseUrl).toString();
    const response = await fetch(url);
    if (!response.ok) {
      const jsonResponse = await response.json();
      throw new Error(jsonResponse.errors || `Failed to fetch the scoreboard`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getScoreBoard:', error);
    throw error;
  }
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
    referralAccount?: string | null;
  };
}

export async function callEndGame(endGameData: EndGameRequest) {
  try {
    const url = new URL(`api/maze/endGame`, backendBaseUrl).toString();
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(endGameData),
    });
    const jsonResponse = await response.json();
    if (!response.ok) {
      throw new Error(jsonResponse.errors || 'Failed to end game');
    }
    return jsonResponse;
  } catch (error) {
    console.error('Error in callEndGame:', error);
    throw error;
  }
}

export async function callMintCheddar(mintCheddarBody: { accountId: string }) {
  try {
    const url = new URL(
      `api/maze/mintNonMintedCheddar`,
      backendBaseUrl
    ).toString();
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mintCheddarBody),
    });
    if (!response.ok) {
      const jsonResponse = await response.json();
      throw new Error(
        jsonResponse.errors ||
          `Failed to mint cheddar for account: ${mintCheddarBody.accountId}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error('Error in callMintCheddar:', error);
    throw error;
  }
}

export async function isHolonymVerified(accountId: string): Promise<boolean> {
  try {
    const govResp = await fetch(holonym.govIdSBT + `&user=${accountId}`);
    const phoneResp = await fetch(holonym.phoneSBT + `&user=${accountId}`);

    if (!govResp.ok || !phoneResp.ok) {
      throw new Error(`Failed to verify Holonym for account: ${accountId}`);
    }

    const { result: isUniqueId } = await govResp.json();
    const { result: isUniquePhone } = await phoneResp.json();
    return isUniqueId || isUniquePhone;
  } catch (error) {
    console.error('Error in isHolonymVerified:', error);
    throw error;
  }
}
