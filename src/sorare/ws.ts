import { ActionCable } from '@sorare/actioncable';
import { IAuctionUpdateResponse } from './dto/IAuctionUpdateResponse';
import Logger from '../utils/logger';

export default class WsSorare {
  private cable: ActionCable;
  private result!: IAuctionUpdateResponse;

  constructor() {
    this.cable = new ActionCable({
      url: process.env.WS_SORARE,
      headers: {
        Authorization: `Bearer ${process.env.JWT_TOKEN}`,
        APIKEY: String(process.env.API_KEY),
      },
    });
  }

  /**
   * avvia la webSocket e crea la subscrition sorare.
   *
   * @param {string} query - Il primo valore.
   * @param {function(any): void} action - azione che voglio che faccia quanto ritorna i risultati.
   * @returns {void}
   */

  /* eslint-disable @typescript-eslint/no-explicit-any */
  // eslint-disable-next-line no-unused-vars
  public Start = (query: string, action: (value: any) => void) => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    this.cable.subscribe(query, {
      connected() {
        Logger.info('connetto alla ws di sorare');
      },

      disconnected() {
        Logger.info('disconnesso dalla ws sorare');
        try {
          setTimeout(() => {
            Logger.info('tentativo di riconnesione alla ws di sorare');
            const newWS = new WsSorare();
            newWS.Start(query, action); // Riconnetti il bot al canale Action Cable.
          }, 5000);
        } catch (error: any) {
          Logger.error(error.message);
        }
      },

      rejected() {
        Logger.error('rifiutata conessione ws sorare');
      },

      received(data) {
        try {
          self.result = data.result;
          action(self.result);
        } catch (error: any) {
          Logger.error(error.message);
        }
      },
    });
  };
}
