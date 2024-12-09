import { getConfig } from '@/configs/config';
import { hasSuccessValue } from '@/contracts/maze/mazeBuyerCalls';
import { providers } from 'near-api-js';

const provider = new providers.JsonRpcProvider({
  url: getConfig().networkData.nodeUrl,
});

export const getNearBalance = async (accountId: string) => {
  if (!accountId) {
    return '0';
  }

  const response: any = await provider.query({
    request_type: 'view_account',
    finality: 'final',
    account_id: accountId,
  });

  return response ? response.amount : response.error.data;
};

export async function getTransactionDetails(
  transactionHash: string,
  accountId: string
) {
  const finalExecutionOutcome = await provider.txStatus(
    transactionHash,
    accountId
  );

  if (!hasSuccessValue(finalExecutionOutcome.status)) {
    throw new Error('Transaction failed');
  }

  return finalExecutionOutcome
}
