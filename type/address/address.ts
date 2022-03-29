import {result, err, ok} from 'helper';

/**
 * Address is a reference to a specific account in the ledger.
 */
export class Address {
  private value: string;
  /**
   * Returns an address wraped in a `Result`.
   *
   * ```typescript
   * //print: address 123456789 is correct.
   * const r = address.from('1234567890');
   * if (!r.isOk())
   *    print('address is incorrect');
   * else
   *    print ('address ' + r.data + ' is correct.').
   * ```
   *
   * @param {T} v - Address in raw format.
   * @template T - only string are supported from now.
   * @return {Result} Results of address parsing
   */
  from<T>(v: T): result<Address, string> {
    if (typeof v == 'string') {
      if (isValid(v)) {
        this.value = v;
        return ok(this);
      } else {
        return err('wrong length');
      }
    }
    return err('from not implemented');
  }

  /**
   * Converts an address to a string format
   * @return {string} value
   */
  toString(): string {
    return this.value;
  }
}

/**
 * Checks if a address formatted as a string is valid or not.
 *
 * @param {string} v - Address in string format.
 * @return {boolean} True if the format is valid, false otherwise.
 */
function isValid(v: string): boolean {
  return v.length > 2;
}
