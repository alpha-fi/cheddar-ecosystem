export interface Coordinates {
  x: number;
  y: number;
}

export interface MintNFTLastResult {
  token_id: string;
  owner_id: string;
  metadata: NFTMetadata;
  approved_account_ids: ApprovedAccountIds;
}

export interface NFTMetadata {
  title: string;
  description: any;
  media: string;
  media_hash: any;
  copies: any;
  issued_at: string;
  expires_at: any;
  starts_at: any;
  updated_at: any;
  extra: any;
  reference: string;
  reference_hash: any;
}

export interface ApprovedAccountIds {}
