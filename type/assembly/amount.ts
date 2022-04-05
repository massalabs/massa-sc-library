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
    * @param {u8} u - minor unit of the currency.
    * @param {string} n - name of the currency.
    */
  constructor(u: u8 = 0, n = '') {
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
  same(c: Currency):bool {
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

// TODO move this interface to its own type.
/**
 * As Result and Optional types are not yet implemented and because
 * exception are not an alternative in as (this will stop the execution),
 * an interface on isNaN model is added to let the type user know when the
 * type is no longer meaningful.
 */
export interface isNoter {
    isNot(): bool
}

/**
 * Value in currency to express an amount
 *
 * When type is not an amount anymore due to calculation side effect,
 * _notAnAmount flag is set.
 *
 * To easier type checking, and because Result or Optional type are
 * not yet implemented, this type extends the isNoter interface
 */
export class Amount implements isNoter {
  _value: u64;
  _currency: Currency;
  _notAnAmount: bool;

  /**
     * Creates a new Amount;
     *
     * @param {u64} v - Amount value.
     * @param {Currency} c - Amount currency.
     */
  constructor(v: u64 = 0, c: Currency = new Currency()) {
    this._value = v;
    this._currency = c;
    this._notAnAmount = false;
  }

  /**
     * Returns the value of the amount.
     *
     * @return {u64}
     */
  value(): u64 {
    return this._value;
  }

  /**
     * Returns the currency of the amount.
     *
     * @return {Currency}
     */
  currency(): Currency {
    return this._currency;
  }

  /**
     * Returns if the Amount is still valid.
     * @return {bool}
     */
  isNot():bool {
    return this._notAnAmount;
  }

  /**
     * Sets that the amount is not valid anymore.
     */
  setNotAnAmount():void {
    this._notAnAmount = true;
  }

  /**
     * Checks if both amounts currencies matches and
     * if both amounts are still valid.
     *
     * @param {Amount} a - Amount to check against.
     *
     * @return {bool}
     */
  matchAndAmounts(a: Amount):bool {
    return this._currency.same(a.currency()) &&
                this.isNot() &&
             a.isNot();
  }

  /**
     * Adds two amounts and return results in a new one.
     *
     * WARNING : return amount may be invalid. You shall verify isNot value.
     *
     * @param {Amount} a - Amout to add.
     *
     * @return {Amount}
     */
  add(a: Amount):Amount {
    if (!this.matchAndAmounts(a)) {
      return notAnAmount;
    }

    return new Amount(this._value + a.value(), this._currency);
  }

  /**
     * Substact given amount from existing one.
     *
     * @param {Amount} a - Amount to substract.
     *
     * @return {Amount}
     */
  substract(a: Amount):Amount {
    if (this.lessThan(a)) {
      return notAnAmount;
    }

    return new Amount(this._value - a.value(), this._currency);
  }

  /**
     * Check if existent amount is lower than given one.
     *
     * @param {Amount} a - Amount to check against.
     *
     * @return {bool}
     */
  lessThan(a: Amount):bool {
    if (!this.matchAndAmounts(a)) {
      return false;
    }

    return this._value < a.value();
  }
}

const notAnAmount = new Amount();
notAnAmount.setNotAnAmount();
