/* eslint-disable max-len */
import {call} from 'massa-sc-std';
import {GetAllowanceArgs, SetAllowanceArgs, TransferArgs, TransferFromArgs} from './args';
import {Amount} from 'mscl-type/assembly/amount';
import {Address} from 'mscl-type/assembly/address';
import {mapStrToBool} from 'mscl-type/assembly/utils';

/**
 * An ERC20 token wrapper.
 *
 * This class can be used to wrap an ERC20 to simplify caller job.
 *
 * ```assemblyscript
 *  ...
 *  const coin = new TokenWrapper(sc_address);
 *  let coin_name = coin.name();
 *  let bal = coin.balanceOf(new Address("my_address"));
 *  print("balance: " + bal.value() + " of token: " + coin_name);
 * ...
 * ```
 */
export class Wrapper {
  private baseAddress: string;

  /**
   * Builds a ERC20 wrapper
   *
   * @param {string} baseAddress - Base address of the ERC20 smart contract.
   */
  constructor(baseAddress: string) {
    this.baseAddress = baseAddress;
  }

  /**
   * Returns the base address of the ERC20 contract
   *
   * @return {string} baseAddress - Base address of the ERC20 smart contract.
   */
  address(): string {
    return this.baseAddress;
  }

  /**
   * Returns the token name.
   *
   * @return {string} - name of the token.
   */
  name(): string {
    return call(this.baseAddress, 'name', '', 0);
  }

  /**
   * Returns the token symbol.
   *
   * @return {string} - symbol of the token.
   */
  symbol(): string {
    return call(this.baseAddress, 'symbol', '', 0);
  }

  /**
   * Returns the token total supply.
   *
   * @return {Amount} - number of minted tokens.
   */
  totalSupply(): Amount {
    const data: string = call(this.baseAddress, 'totalSupply', '', 0);
    const amount = U64.parseInt(data, 10);
    return new Amount(amount);
  }

  /**
   * Returns the address balance.
   *
   * @param {Address} address - Address to get balance for.
   * @return {Amount} - Value of the balance.
   */
  balanceOf(address: Address): Amount {
    const data: string = call(this.baseAddress, 'balanceOf', <string>address.serializeToString(), 0);
    const amount = Amount.deserializeFromStr(data);
    return <Amount>amount;
  }

  /**
 * Sets the allowance of a given address.
 *
 * @param {Address} spenderAddress - spender address
 * @param {Amount} approvalAmount - amount to set an allowance for
 *
 * @return {boolean} true on success
 */
  approve(spenderAddress: Address, approvalAmount: Amount): bool {
    const args = new SetAllowanceArgs(spenderAddress, approvalAmount);
    return mapStrToBool(call(this.baseAddress, 'approve', <string>args.serializeToString(), 0));
  }

  /**
   * Returns the allowance of a given address
   *
   * @param {Address} ownerAddress - owner address
   * @param {Address} spenderAddress - spender address
   *
   * @return {Amount} - remaining allowance amount linked to address.
   */
  allowance(ownerAddress: Address, spenderAddress: Address): Amount {
    const args = new GetAllowanceArgs(ownerAddress, spenderAddress);
    const data: string = call(this.baseAddress, 'allowance', <string>args.serializeToString(), 0);
    const amount = Amount.deserializeFromStr(data);
    return <Amount>amount;
  }

  /**
 * Increases the allowance of a given spender address.
   *
   * @param {Address} spenderAddress - spender address
   * @param {Amount} addedAmount - amount to increase the allowance with
   *
   * @return {boolean} true on success
   */
  increaseAllowance(spenderAddress: Address, addedAmount: Amount): bool {
    const args = new SetAllowanceArgs(spenderAddress, addedAmount);
    return mapStrToBool(call(this.baseAddress, 'decreaseAllowance', <string>args.serializeToString(), 0));
  }

  /**
 * Decreases the allowance of a given spender address.
   *
   * @param {Address} spenderAddress - spender address
   * @param {Amount} subtractedAmount - amount to decrease the allowance with
   *
   * @return {boolean} true on success
   */
  decreaseAllowance(spenderAddress: Address, subtractedAmount: Amount): bool {
    const args = new SetAllowanceArgs(spenderAddress, subtractedAmount);
    return mapStrToBool(call(this.baseAddress, 'decreaseAllowance', <string>args.serializeToString(), 0));
  }

  /**
 * Transfers coins from a sender to a receiver
   *
   * @param {Address} toAddress - to address
   * @param {Amount} amount - amount to transfer
   *
   * @return {boolean} true on success
   */
  transfer(toAddress: Address, amount: Amount): bool {
    const args = new TransferArgs(toAddress, amount);
    return mapStrToBool(call(this.baseAddress, 'transfer', <string>args.serializeToString(), 0));
  }

  /**
 * Transfers coins to a new address on behalf of the caller
   *
   * @param {Address} fromAddress - from address
   * @param {Address} toAddress - to address
   * @param {Amount} amount - amount to transfer
   *
   * @return {boolean} true on success
   */
  transferFrom(fromAddress: Address, toAddress: Address, amount: Amount): bool {
    const args = new TransferFromArgs(fromAddress, toAddress, amount);
    return mapStrToBool(call(this.baseAddress, 'transferFrom', <string>args.serializeToString(), 0));
  }
}
