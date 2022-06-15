/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */

import {ASON} from '@ason/assembly';
import {Address} from '../../node_modules/mscl-type/assembly/address';
import {Amount} from '../../node_modules/mscl-type/assembly/amount';
import {Currency} from '../../node_modules/mscl-type/assembly/currency';


export class SetAllowanceArgs {
  private _owner: Address;
  private _spender: Address;
  private _amount: Amount;

  /**
     * Sets allowance arguments;
     *
     * @param {Address} owner - Owner address.
     * @param {Address} spender - Spender address.
     * @param {Amount} amount - Amount currency.
     */
  constructor(owner: Address, spender: Address, amount: Amount) {
    this._owner = owner;
    this._spender = spender;
    this._amount = amount;
  }

  serialize(): StaticArray<u8> {
    const buffer: StaticArray<u8> = ASON.serialize([this._owner.value(), this._spender.value(), this._amount.value().toString()] as Array<string>);
    return buffer;
  }

  serializeToString(): string {
    const buffer = this.serialize();
    return buffer.join(',').toString();
  }

  static deserialize(data: StaticArray<u8>): SetAllowanceArgs {
    const result: Array<string> = ASON.deserialize<Array<string>>(data);
    const owner: Address = new Address(<string>result[0]);
    const spender: Address = new Address(<string>result[1]);
    const amount: Amount = new Amount(U64.parseInt(<string>result[2], 10), new Currency());
    return new SetAllowanceArgs(owner, spender, amount);
  }

  static deserializeFromStr(data: string): SetAllowanceArgs {
    const newData = data.split(',');
    const ret = new StaticArray<u8>(newData.length);
    for (let i = 0; i < newData.length; i++) {
      ret[i] = U8.parseInt(newData.at(i));
    }
    return SetAllowanceArgs.deserialize(ret);
  }

  /**
     * Returns the approval amount.
     *
     * @return {Amount} Amount.
     */
  amount():Amount {
    return this._amount;
  }

  /**
     * Returns the approval owner.
     *
     * @return {Amount} Amount.
     */
  owner():Address {
    return this._owner;
  }

  /**
     * Returns the approval owner.
     *
     * @return {Amount} Amount.
     */
  spender():Address {
    return this._spender;
  }
}

/*

export class GetAllowanceArgs {
  owner: string;
  spender: string;
}


export class IncreaseAllowanceArgs {
  spender: string;
  addedAmount: u64;
}


export class DecreaseAllowanceArgs {
  spender: string;
  subtractedAmount: u64;
}


export class TransferArgs {
  to: string;
  amount: u64;
}


export class TransferFromArgs {
  to: string;
  from: string;
  amount: u64;
}

*/
