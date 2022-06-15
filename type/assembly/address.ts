/* eslint-disable max-len */
import {Valider} from './valider';
import {ASON} from '@ason/assembly';


/**
 * Value in currency to express an amount
 *
 * When type is not an amount anymore due to calculation side effect,
 * _notAnAmount flag is set.
 *
 * To easier type checking, and because Result or Optional type are
 * not yet implemented, this type extends the isNoter interface
 */
export class Address implements Valider {
  _value: string;
  _isValid: bool;

  /**
     * Creates a new Amount;
     *
     * @param {string} v - Amount value.
     * @param {Currency} c - Amount currency.
     */
  constructor(v: string) {
    this._value = v;
    this._isValid = false;
    if (v.startsWith('A')) {
      this._isValid = true;
    }
  }

  /**
     * Returns the value of the amount.
     *
     * @return {string}
     */
  value(): string {
    return this._value;
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
     * Checks if both addresses are the same.
     *
     * @param {Address} c - Address to compare to.
     *
     * @return {boolean}
     */
  sameAs(c: Address):bool {
    return this._value == c.value();
  }

  /**
     * A static method for serializing an address to a binary array
     *
     * @return {StaticArray<u8>}
     */
  serialize(): StaticArray<u8>|null {
    if (this.isValid()) {
      const buffer: StaticArray<u8> = ASON.serialize([this.value()] as Array<string>);
      return buffer;
    }
    return null;
  }

  /**
     * A class method for serializing an address to a binary array
     *
     * @return {string|null}
     */
  serializeToString(): string|null {
    const buffer = this.serialize();
    return buffer ? buffer.join(',').toString() : null;
  }

  /**
     * A static method for deserializing an amount from a binary array
     *
     * @param {StaticArray<u8>} data - data to serialize.
     *
     * @return {Address} - Address.
     */
  static deserialize(data: StaticArray<u8>): Address|null {
    const result: Array<string> = ASON.deserialize<Array<string>>(data);
    const address: Address = new Address(<string>result[0]);
    return address.isValid() ? address : null;
  }

  /**
     * A static method for deserializing an address from a binary array
     *
     * @param {string} data - string data to serialize.
     *
     * @return {Address} - Address.
     */
  static deserializeFromStr(data: string): Address|null {
    const newData = data.split(',');
    const ret = new StaticArray<u8>(newData.length);
    for (let i = 0; i < newData.length; i++) {
      ret[i] = U8.parseInt(newData.at(i));
    }
    return Address.deserialize(ret);
  }
}
