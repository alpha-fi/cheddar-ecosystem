import { getConfig } from "@/configs/config";
import { Wallet, WalletSelector } from "@near-wallet-selector/core";
import { view } from "./contractUtils";

export interface NFT {

}

export class NFTCheddarContract {

  wallet: Wallet
  contractId: string;

  constructor(wallet: Wallet) {
    this.wallet = wallet
    const { cheddarNft } = getConfig().contracts
    this.contractId = cheddarNft;
  }

  async getNFTs(accountId: string): Promise<NFT[]> {
    return view(this.contractId, "nft_tokens_for_owner", { account_id: accountId });
  }
  
}
