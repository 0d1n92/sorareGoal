export interface IFiat {
  eur: number;
}

export interface IRange {
  max: string;
  min: string;
}

export interface ITokenBid {
  amount: string;
  amountInFiat: IFiat;
}

export interface IToken {
  name: string;
  slug: string;
  pictureUrl: string;
  priceRange: IRange;
  publicMinPrices: null | unknown[];
}

export interface ITokenAuction {
  bestBid: ITokenBid;
  currentPrice: string;
  nfts: IToken[];
  bids: INode;
}

export interface INode {
  nodes: ITokenBid[];
}

export interface IAuctionUpdateResponse {
  data: {
    tokenAuctionWasUpdated: ITokenAuction;
  };
}
