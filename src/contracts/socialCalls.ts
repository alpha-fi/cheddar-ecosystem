import { getConfig } from '@/configs/config';
import { change, view } from './contractUtils';
import { FinalExecutionOutcome, Wallet } from '@near-wallet-selector/core';

const { nearSocial } = getConfig().contracts;
export interface KeysOptions {
  return_type: 'True' | 'BlockHeight' | 'NodeId';
  return_deleted: boolean;
  values_only: boolean;
}

const socialViewMethods = {
  get: 'get',
};

const socialChangeMethods = {
  set: 'set',
};

export const getNearSocial = async (
  keys: string[],
  options?: KeysOptions
): Promise<Record<string, any>> => {
  return view(nearSocial, socialViewMethods.get, {
    keys,
    options,
  });
};

export const setNearSocial = async (
  wallet: Wallet,
  data: Record<string, any>
): Promise<void | FinalExecutionOutcome> => {
  return change(
    wallet,
    nearSocial,
    socialChangeMethods.set,
    {
      data: JSON.stringify(data),
    },
    '1' + '0'.repeat(23)
  );
};
