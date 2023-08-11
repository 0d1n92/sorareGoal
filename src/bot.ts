import 'dotenv/config';
import {
  Client,
  GatewayIntentBits,
  Message,
  EmbedBuilder,
  TextChannel,
  DMChannel,
} from 'discord.js';
import SorareApi from './sorare/api';
import WsSorare from './sorare/ws';
import * as QUERY from './sorare/queries/wsQueries';
import Helper from './utils/helper';
import WeiConverter from './utils/weiConvert';
import {
  IAuctionUpdateResponse,
  ITokenAuction,
} from './sorare/dto/IAuctionUpdateResponse';
import Logger from './utils/logger';

export default class Bot {
  private static instance: Bot | null = null;
  private client: Client;
  private sorareApi: SorareApi;

  private constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    this.client.login(process.env.TOKEN);
    this.sorareApi = SorareApi.getInstance();
    this.client.channels.cache.get(String(process.env.CHANNEL_ID));
    this.onInit();
  }

  public static getInstance(): Bot {
    if (!Bot.instance) {
      Bot.instance = new Bot();
    }
    return Bot.instance;
  }

  private async onInit() {
    this.client.on('ready', async () => {
      Logger.info(`Logged in as ${this.client.user!.tag}`);
      this.client.on('messageCreate', (msg: Message) =>
        this.handleMessage(msg)
      );
      await this.sorareApi.Auth();
      const ws = new WsSorare();
      await ws.Start(QUERY.AUCTION_UPDATE, this.notifyAuctionACard);
    });
  }

  //#region controlla se i risultati della ws non sono nulli e se il prezzo della carta soddisfa i requisiti per essere stampata
  private notifyAuctionACard = async (value: IAuctionUpdateResponse) => {
    const tokenAuctionWasUpdated = value?.data.tokenAuctionWasUpdated;

    if (tokenAuctionWasUpdated && tokenAuctionWasUpdated.nfts[0]?.priceRange) {
      const { min, max } = tokenAuctionWasUpdated.nfts[0].priceRange;
      const parsedMin = Number(min);
      const parsedMax = Number(max);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      const [isInRage, mediumPrice, differencePercentage] =
        Helper.calculatedAveragePrice(
          parsedMin,
          parsedMax,
          Number(tokenAuctionWasUpdated.currentPrice)
        );
      if (isInRage) {
        this.printACard(tokenAuctionWasUpdated, mediumPrice);
      }
    }
  };

  //#endregion

  //#region stampa la carta nel canale
  private async printACard(card: ITokenAuction, mediumPrice: number) {
    const { pictureUrl, name, slug, priceRange } = card.nfts[0];
    const embed = new EmbedBuilder()
      .setTitle(name)
      .setURL(`https://sorare.com/football/cards/${slug}`)
      .setImage(pictureUrl)
      .addFields(
        {
          name: 'Min Val Eth',
          value: String(new WeiConverter(priceRange.min).call()),
        },
        {
          name: 'Average Price Eth',
          value: String(new WeiConverter(String(mediumPrice)).call()),
        },
        {
          name: 'Best Offer Euro',
          value: String(Number(card.bestBid.amountInFiat.eur).toFixed(2)),
        }
      );

    const channelIds = JSON.parse(String(process.env.CHANNEL_IDS));
    const channel = this.client.channels.cache.get(String(channelIds['all']));
    let channel2;
    const amountInFiat = Number(card.bids.nodes[0].amountInFiat.eur);

    if (amountInFiat > 0 && amountInFiat < 10) {
      const channelId = String(channelIds['1to10']);
      channel2 = this.client.channels.cache.get(channelId);
    } else if (amountInFiat > 10 && amountInFiat < 25) {
      const channelId = String(channelIds['10to25']);
      channel2 = this.client.channels.cache.get(channelId);
    } else if (amountInFiat > 25 && amountInFiat < 50) {
      const channelId = String(channelIds['25to50']);
      channel2 = this.client.channels.cache.get(channelId);
    } else if (amountInFiat > 50 && amountInFiat < 100) {
      const channelId = String(channelIds['50to100']);
      channel2 = this.client.channels.cache.get(channelId);
    } else {
      const channelId = String(channelIds['100to250']);
      channel2 = this.client.channels.cache.get(channelId);
    }

    if (
      channel &&
      (channel instanceof TextChannel || channel instanceof DMChannel) &&
      channel2 &&
      (channel2 instanceof TextChannel || channel2 instanceof DMChannel)
    ) {
      try {
        await channel.send({ embeds: [embed] });
        await channel2.send({ embeds: [embed] });
      } catch (error) {
        Logger.error('Errore nell invio del messaggio:' + error);
      }
    } else {
      Logger.error(
        `Il canale con ID ${process.env.CHANNEL_ID} non è un TextChannel o un DMChannel o non esiste.`
      );
    }
  }
  //#endregion

  private handleMessage = (msg: Message) => {
    if (msg.author.bot) {
      return;
    }
    if (msg.content === 'ping') {
      msg.reply('pong');
    }
  };
}
