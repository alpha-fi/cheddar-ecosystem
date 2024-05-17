import { getConfig } from '@/configs/config';
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
