import {Currency} from './currency';
import {Valider} from './valider';


/**
 * Value in currency to express an amount
 *
 * When type is not an amount anymore due to calculation side effect,
 * _notAnAmount flag is set.
 *
 * To easier type checking, and because Result or Optional type are
 * not yet implemented, this type extends the isNoter interface
 */
export class Amount implements Valider {
  _value: u64;
  _currency: Currency;
  _isValid: bool;

  /**
     * Creates a new Amount;
     *
     * @param {u64} v - Amount value.
     * @param {Currency} c - Amount currency.
     */
  constructor(v: u64 = 0, c: Currency = new Currency()) {
    this._value = v;
    this._currency = c;
    this._isValid = true;
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
  isValid():bool {
    return this._isValid;
  }

  /**
     * Sets that the amount is not valid anymore.
     */
  setNotValid():void {
    this._isValid = false;
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
    return this._currency.sameAs(a.currency()) &&
                this.isValid() &&
             a.isValid();
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

    const r = new Amount(this._value + a.value(), this._currency);

    return r.lessThan(a) ? notAnAmount : r;
  }

  /**
     * Substact given amount from existing one.
     *
     * @param {Amount} a - Amount to substract.
     *
     * @return {Amount}
     */
  substract(a: Amount):Amount {
    if (!this.matchAndAmounts(a) || this.lessThan(a)) {
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
    return this._value < a.value();
  }
}

const notAnAmount = new Amount();
notAnAmount.setNotValid();
