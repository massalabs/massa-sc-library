/**
 * Monetary unit used to express a value.
 *
 * The minor unit of a currency, as described in the ISO 4217 standard,
 * is the maximal size of the fractional part that can be used
 * to describe the value when in a decimal form.
 *
 * For instance, US dollar has a minor unit of 2. This means that value
 * in US dollar must be express with two digits after the decimal separator
 * like in the following : $10.34
 */
export class Currency {
  _minorUnit: u8;
  _name: string;

  /**
    * Creates a new instance of Currency.
    *
    * @param {string} n - name of the currency.
    * @param {u8} u - minor unit of the currency.
    */
  constructor(n:string = '', u: u8 = 0) {
    this._minorUnit = u;
    this._name = n;
  }

  /**
     * Checks if both currencies are the same.
     *
     * @param {Currency} c - Currency to compare to.
     *
     * @return {boolean}
     */
  sameAs(c: Currency):bool {
    return this._minorUnit == c.minorUnit() &&
            this._name == c.name();
  }

  /**
     * Returns the size of the fractional part.
     *
     * @return {u8} Size in number of digits
     */
  minorUnit(): u8 {
    return this._minorUnit;
  }

  /**
     * Returns the name the currency.
     *
     * @return {string} Currency name.
     */
  name():string {
    return this._name;
  }
}
