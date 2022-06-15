/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
import {ASON} from '@ason/assembly';
import {Address} from '../../node_modules/mscl-type/assembly/address';
import {Amount} from '../../node_modules/mscl-type/assembly/amount';
import {Currency} from '../../node_modules/mscl-type/assembly/currency';
import {mapStrToU8} from '../../node_modules/mscl-type/assembly/utils';

export class SetAllowanceArgs {
  private _spender: Address;
  private _amount: Amount;

  /**
     * Sets allowance arguments;
     *
     * @param {Address} spender - Spender address.
     * @param {Amount} amount - Amount currency.
     */
  constructor(spender: Address, amount: Amount) {
    this._spender = spender;
    this._amount = amount;
  }

  serialize(): StaticArray<u8> {
    const buffer: StaticArray<u8> = ASON.serialize([
      this._spender.value(),
      this._amount.value().toString()] as Array<string>);
    return buffer;
  }

  serializeToString(): string {
    return this.serialize().join(',').toString();
  }

  static deserialize(data: StaticArray<u8>): SetAllowanceArgs {
    const result: Array<string> = ASON.deserialize<Array<string>>(data);
    const spender: Address = new Address(<string>result[0]);
    const amount: Amount = new Amount(U64.parseInt(<string>result[1], 10), new Currency());
    return new SetAllowanceArgs(spender, amount);
  }

  static deserializeFromStr(data: string): SetAllowanceArgs {
    return SetAllowanceArgs.deserialize(mapStrToU8(data));
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
  spender():Address {
    return this._spender;
  }
}

// =====================================

export class GetAllowanceArgs {
  private _owner: Address;
  private _spender: Address;

  /**
     * Gets allowance arguments;
     *
     * @param {Address} owner - Owner address.
     * @param {Address} spender - Spender address.
     */
  constructor(owner: Address, spender: Address) {
    this._owner = owner;
    this._spender = spender;
  }

  serialize(): StaticArray<u8> {
    const buffer: StaticArray<u8> = ASON.serialize([this._owner.value(),
      this._spender.value()] as Array<string>);
    return buffer;
  }

  serializeToString(): string {
    return this.serialize().join(',').toString();
  }

  static deserialize(data: StaticArray<u8>): GetAllowanceArgs {
    const result: Array<string> = ASON.deserialize<Array<string>>(data);
    const owner: Address = new Address(<string>result[0]);
    const spender: Address = new Address(<string>result[1]);
    return new GetAllowanceArgs(owner, spender);
  }

  static deserializeFromStr(data: string): GetAllowanceArgs {
    return GetAllowanceArgs.deserialize(mapStrToU8(data));
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

// =====================================

export class TransferFromArgs {
  private _from: Address;
  private _to: Address;
  private _amount: Amount;

  /**
     * Sets transfer arguments;
     *
     * @param {Address} from - Sender address.
     * @param {Address} to - Receiver address.
     * @param {Amount} amount - Amount to send.
     */
  constructor(from: Address, to: Address, amount: Amount) {
    this._from = from;
    this._to = to;
    this._amount = amount;
  }

  serialize(): StaticArray<u8> {
    const buffer: StaticArray<u8> = ASON.serialize([this._from.value(),
      this._to.value(),
      this._amount.value().toString()] as Array<string>);
    return buffer;
  }

  serializeToString(): string {
    return this.serialize().join(',').toString();
  }

  static deserialize(data: StaticArray<u8>): TransferFromArgs {
    const result: Array<string> = ASON.deserialize<Array<string>>(data);
    const from: Address = new Address(<string>result[0]);
    const to: Address = new Address(<string>result[1]);
    const amount: Amount = new Amount(U64.parseInt(<string>result[2], 10));
    return new TransferFromArgs(from, to, amount);
  }

  static deserializeFromStr(data: string): TransferFromArgs {
    return TransferFromArgs.deserialize(mapStrToU8(data));
  }

  /**
     * Returns the from address.
     *
     * @return {Address} From address.
     */
  from():Address {
    return this._from;
  }

  /**
     * Returns the to address.
     *
     * @return {Address} To address.
     */
  to():Address {
    return this._to;
  }

  /**
     * Returns the send amount
     *
     * @return {Amount} Send amount.
     */
  amount():Amount {
    return this._amount;
  }
}

// =====================================

export class TransferArgs {
  private _to: Address;
  private _amount: Amount;

  /**
     * Sets transfer arguments;
     *
     * @param {Address} to - Receiver address.
     * @param {Amount} amount - Amount to send.
     */
  constructor(to: Address, amount: Amount) {
    this._to = to;
    this._amount = amount;
  }

  serialize(): StaticArray<u8> {
    const buffer: StaticArray<u8> = ASON.serialize([
      this._to.value(),
      this._amount.value().toString()] as Array<string>);
    return buffer;
  }

  serializeToString(): string {
    return this.serialize().join(',').toString();
  }

  static deserialize(data: StaticArray<u8>): TransferArgs {
    const result: Array<string> = ASON.deserialize<Array<string>>(data);
    const to: Address = new Address(<string>result[0]);
    const amount: Amount = new Amount(U64.parseInt(<string>result[1], 10));
    return new TransferArgs(to, amount);
  }

  static deserializeFromStr(data: string): TransferArgs {
    return TransferArgs.deserialize(mapStrToU8(data));
  }

  /**
     * Returns the to address.
     *
     * @return {Address} To address.
     */
  to():Address {
    return this._to;
  }

  /**
     * Returns the send amount
     *
     * @return {Amount} Send amount.
     */
  amount():Amount {
    return this._amount;
  }
}
