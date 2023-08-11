export const AUCTION_UPDATE: string = `
tokenAuctionWasUpdated(sports:FOOTBALL){
  currentPrice
  bestBid {
    amountInFiat {
      eur
    }
    amount
  }
   bids(first:5) {
    nodes {
      amount
      maximumAmounts {
        eur
      }
      maximumAmount


      amountInFiat {
        eur
      }
    }

  }
    nfts {
      name
      slug
      priceRange {
        min
        max
      }
      pictureUrl
      publicMinPrices {
        eur

      }
    }
   open
  }
    `;
