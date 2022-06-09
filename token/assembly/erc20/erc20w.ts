/* eslint-disable max-len */
import {call} from 'massa-sc-std';
import {DecreaseAllowanceArgs, GetAllowanceArgs, IncreaseAllowanceArgs, MintArgs, SetAllowanceArgs, TransferArgs, TransferFromArgs} from './json';

/**
 * An ERC20 token wrapper.
 *
 * This class can be used to wrap an ERC20 to simplify caller job.
 *
 * ```assemblyscript
 *  ...
 *  const coin = new TokenWrapper(sc_address);
 *  let coin_name = coin.name();
 *  let bal = coin.balanceOf(my_address);
 *  print("balance: " + bal.toString() + " of token: " + coin_name);
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
   * Returns the token decimals.
   *
   * @return {string} - decimals of the token.
   */
  decimals(): u8 {
    return u8(parseInt(call(this.baseAddress, 'decimals', '', 0), 10));
  }

  /**
   * Returns the token total supply.
   *
   * @return {u64} - number of minted tokens.
   */
  totalSupply(): u64 {
    return u64(parseInt(call(this.baseAddress, 'totalSupply', '', 0), 10));
  }

  /**
   * Returns the address balance.
   *
   * @param {string} address - Address to get balance for.
   * @return {u64} - Value of the balance.
   */
  balanceOf(address: string): u64 {
    return u64(parseInt(call(this.baseAddress, 'balanceOf', address, 0), 10));
  }

  /**
   * Returns the allowance of a given address.
   *
   * @param {string} owner - owner address
   * @param {string} spender - spender address
   *
   * @return {u64} remaining allowance amount linked to address.
   */
  allowance(owner: string, spender: string): u64 {
    const args = JSON.stringify<GetAllowanceArgs>({owner: owner, spender: spender});
    return u64(parseInt(call(this.baseAddress, 'allowanceJSON', args, 0), 10));
  }

  /**
 * Sets the allowance of a given address.
 *
 * @param {string} spender - spender address
 * @param {u64} amount - amount to set an allowance for
 *
 * @return {boolean} true on success
 */
  approve(spender: string, amount: u64): boolean {
    const args = JSON.stringify<SetAllowanceArgs>({spender: spender, amount: amount});
    return <boolean><unknown>(call(this.baseAddress, 'approveJSON', args, 0));
  }

  /**
 * Sets the allowance of a given address.
 *
 * @param {string} spenderAddress - spender address
 * @param {string} addedAmount - amount to increase the allowance with
 *
 * @return {boolean} true on success
 */
  increaseAllowance(spenderAddress: string, addedAmount: u64): boolean {
    const args = JSON.stringify<IncreaseAllowanceArgs>({spender: spenderAddress, amount: addedAmount});
    return <boolean><unknown>(call(this.baseAddress, 'increaseAllowanceJSON', args, 0));
  }

  /**
 * Sets the allowance of a given address.
 *
 * @param {string} spenderAddress - spender address
 * @param {string} subtractedAmount - amount to decrease the allowance with
 *
 * @return {boolean} true on success
 */
  decreaseAllowance(spenderAddress: string, subtractedAmount: u64): boolean {
    const args = JSON.stringify<DecreaseAllowanceArgs>({spender: spenderAddress, amount: subtractedAmount});
    return <boolean><unknown>(call(this.baseAddress, 'decreaseAllowanceJSON', args, 0));
  }

  /**
   * Function to allow anyone to mint tokens.
   *
   * @param {string} address - spender address
   * @param {u64} amount - amount to set an allowance for
   * @return {void} void
   */
  mint(address: string, amount: u64): void {
    const args = JSON.stringify<MintArgs>({address: address, amount: amount});
    call(this.baseAddress, 'mintJSON', args, 0);
  }

  /**
 * Function to transfer ownership of one token to another
 *
 * @param {string} to - receiver address
 * @param {u64} amount - amount of tokens to transfer to the new owner
 *
 * @return {boolean} true on success
 */
  transfer(to: string, amount: u64): boolean {
    const args = JSON.stringify<TransferArgs>({to: to, amount: amount});
    return <boolean><unknown>(call(this.baseAddress, 'transferJSON', args, 0));
  }

  /**
 * Function to transfer ownership of one token to another
 *
 * @param {string} from - sender address
 * @param {string} to - receiver address
 * @param {u64} amount - amount of tokens to transfer to the receiver
 *
 * @return {boolean} true on success
 */
  transferFrom(from: string, to: string, amount: u64): boolean {
    const args = JSON.stringify<TransferFromArgs>({to: to, from: from, amount: amount});
    return <boolean><unknown>(call(this.baseAddress, 'transferFromJSON', args, 0));
  }
}
