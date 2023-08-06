import axios from 'axios';
import bcrypt from 'bcrypt';
import 'dotenv/config';

export default class Helper {
  public static hashPassword = async (
    pswd: string | undefined,
    salt: string
  ): Promise<string> => {
    try {
      const hashedPassword = await bcrypt.hash(String(pswd), salt);
      return hashedPassword;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error('Errore durante lhash della password: ' + error.message);
    }
  };

  public static getSalt = async (): Promise<string | boolean> => {
    return axios
      .get(`${process.env.API_URL}/api/v1//users/${process.env.EMAIL_SORARE}`)
      .then((res) => {
        return res.data.salt;
      })
      .catch((err: Error) => {
        console.log(err);
        return false;
      });
  };

  /**
   * Calcola l'indicatore di differenza percentuale tra il prezzo medio e il prezzo corrente e determina se la differenza percentuale è inferiore al 19.50%.
   *
   * @param max Il prezzo massimo dell'asta.
   * @param min Il prezzo minimo dell'asta.
   * @param current Il prezzo corrente dell'asta.
   * @returns Una tupla contenente tre valori:
   * - Un valore booleano, true se la differenza percentuale è inferiore al 19.50%, false altrimenti.
   * - Il prezzo medio calcolato come media tra il prezzo massimo e il prezzo minimo.
   * - La differenza percentuale tra il prezzo medio e il prezzo corrente dell'asta.
   */

  public static calculatedAveragePrice = (
    max: number,
    min: number,
    current: number
  ): [boolean, number, number] => {
    const mediumPrice = (min + max) / 2;
    const differenzaPercentuale: number =
      ((mediumPrice - current) / mediumPrice) * 100;

    if (differenzaPercentuale < 19.5) {
      return [true, mediumPrice, differenzaPercentuale];
    }

    return [false, mediumPrice, differenzaPercentuale];
  };
}
