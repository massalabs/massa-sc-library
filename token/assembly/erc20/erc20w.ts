/* eslint-disable max-len */
import {call, Context} from 'massa-sc-std';
import {GetAllowanceArgs, SetAllowanceArgs} from './args';
import {Amount} from 'mscl-type/assembly/amount';
import {Address} from 'mscl-type/assembly/address';

const mapToBool = (val: string): boolean => {
  if (val.toLowerCase() === 'true') return true;
  return false;
};

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
    assert(address.isValid(), 'Bad address format');
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
    const addresses = Context.get_call_stack();
    const ownerAddress = new Address(addresses[0]); // TODO: needs to be resolved on native level
    assert(ownerAddress.isValid(), 'Bad owner address format');
    assert(spenderAddress.isValid(), 'Bad spender address format');
    assert(approvalAmount.isValid(), 'Bad approval amount format');
    const args = new SetAllowanceArgs(ownerAddress, spenderAddress, approvalAmount);
    return mapToBool(call(this.baseAddress, 'approveJSON', <string>args.serializeToString(), 0));
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
    assert(ownerAddress.isValid(), 'Bad owner address format');
    assert(spenderAddress.isValid(), 'Bad spender address format');
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
    const addresses = Context.get_call_stack();
    const ownerAddress = new Address(addresses[0]); // TODO: needs to be resolved on native level
    assert(ownerAddress.isValid(), 'Bad owner address format');
    assert(spenderAddress.isValid(), 'Bad spender address format');
    assert(addedAmount.isValid(), 'Bad approval amount format');
    const currentSpenderAllowance: Amount = this.allowance(ownerAddress, spenderAddress);
    const newAllowance: Amount = currentSpenderAllowance.add(addedAmount);
    assert(newAllowance.isValid(), 'Overflowed spender allowance');
    const args = new SetAllowanceArgs(ownerAddress, spenderAddress, newAllowance);
    return mapToBool(call(this.baseAddress, 'allowance', <string>args.serializeToString(), 0));
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
    const addresses = Context.get_call_stack();
    const ownerAddress = new Address(addresses[0]); // TODO: needs to be resolved on native level
    assert(ownerAddress.isValid(), 'Bad owner address format');
    assert(spenderAddress.isValid(), 'Bad spender address format');
    assert(subtractedAmount.isValid(), 'Bad approval amount format');
    const currentSpenderAllowance: Amount = this.allowance(ownerAddress, spenderAddress);
    const newAllowance: Amount = currentSpenderAllowance.substract(subtractedAmount);
    assert(newAllowance.isValid(), 'Underflowed spender allowance');
    const args = new SetAllowanceArgs(ownerAddress, spenderAddress, newAllowance);
    return mapToBool(call(this.baseAddress, 'allowance', <string>args.serializeToString(), 0));
  }
}
