export default class WeiConverter {
  private static UNITS: { [key: string]: number } = {
    wei: 1,
    kwei: 1000,
    ada: 1000,
    femtoether: 1000,
    mwei: 1000000,
    babbage: 1000000,
    picoether: 1000000,
    gwei: 1000000000,
    shannon: 1000000000,
    nanoether: 1000000000,
    nano: 1000000000,
    szabo: 1000000000000,
    microether: 1000000000000,
    micro: 1000000000000,
    finney: 1000000000000000,
    milliether: 1000000000000000,
    milli: 1000000000000000,
    ether: 1000000000000000000,
    eth: 1000000000000000000,
    kether: 1000000000000000000000,
    grand: 1000000000000000000000,
    einstein: 1000000000000000000000,
    mether: 1000000000000000000000000,
    gether: 1000000000000000000000000000,
    tether: 1000000000000000000000000000000,
  };

  private amount: string;

  constructor(amount: string) {
    this.amount = amount;
  }

  public call(unit: string = 'eth'): string | null {
    if (!this.amount) {
      return null;
    }

    const unitValue = WeiConverter.UNITS[unit.toLowerCase()];
    if (unitValue === undefined) {
      throw new Error('Invalid unit provided.');
    }

    const amountInWei = parseFloat(this.amount);
    const result = amountInWei / unitValue;
    return result.toFixed(4).toString();
  }
}
