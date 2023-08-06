import { ActionCable } from '@sorare/actioncable';
import { IAuctionUpdateResponse } from './dto/IAuctionUpdateResponse';

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
        console.log('connesso');
      },

      disconnected() {
        console.log('disconnesso');
        setTimeout(() => {
          this.connected; // Riconnetti il bot al canale Action Cable.
        }, 5000);
      },

      rejected() {
        console.log('rifiutato');
      },

      received(data) {
        self.result = data.result;
        action(self.result);
      },
    });
  };
}
