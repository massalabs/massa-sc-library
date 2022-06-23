import {Address, call} from 'massa-sc-std/assembly/index';
import {Currency, Amount, ByteArray} from 'mscl-type/assembly/index';

/**
 * The Massa's standard token implementation wrapper.
 *
 * This class can be used to wrap a smart contract implementing
 * Massa standard token.
 * All the serialization/deserialization will handled here.
 *
 * ```assembyscript
 *  ...
 *  const coin = new TokenWrapper(sc_address);
 *  let coin_name = coin.Name();
 *  let bal = coin.BalanceOf(my_address);
 *  print("balance: " + bal.toString() + " of token: " + coin_name);
 * ...
 * ```
 */
export class TokenWrapper {
  origin: Address;
  currency: Currency;
  isCurrencyInitialized: bool;

  /**
   * Wraps a smart contract exposing standard token FFI.
   *
   * @param {Address} at - Address of the smart contract.
   */
  constructor(at: Address) {
    this.origin = at;
    this.currency = new Currency();
    this.isCurrencyInitialized = false;
  }

  /**
   * Returns the version of the smart contract.
   * This versioning is following the best practices defined in https://semver.org/.
   *
   * @return {string}
   */
  version(): string {
    return call(this.origin, 'version', '?', 0);
  }

  /**
   * Returns the name of the token.
   *
   * @return {string} - name of the token.
   */
  name(): string {
    return call(this.origin, 'name', '?', 0);
  }

  /** Returns the symbol of the token.
   *
   * @return {string} token symbol.
   */
  symbol(): string {
    return call(this.origin, 'symbol', '?', 0);
  }

  /**
   * Returns the total token supply.
   *
   * The number of tokens that were initially minted.
   *
   * @return {Amount} number of minted tokens.
   */
  totalSupply(): Amount {
    return this.toAmount(call(this.origin, 'totalSupply', '?', 0));
  }

  /**
   * Check if amount is valid and if amount.currency matches this
   * smart contract currency.
   *
   * @param {Amount} amount
   *
   * @return {boolean}
   */
  private checkAmount(amount: Amount): boolean {
    if (!amount.isValid()) {
      return false;
    }

    if (!this.isCurrencyInitialized) {
      this.currency = new Currency(
          this.name(),
          U8.parseInt(call(this.origin, 'decimals', '?', 0))
      );
      this.isCurrencyInitialized = true;
    }

    return amount.currency() == this.currency;
  }

  /**
   * Returns an amount given a value.
   *
   * @param {string} value - u64 in a string
   * @return {Amount}
   */
  private toAmount(value: string): Amount {
    if (!this.isCurrencyInitialized) {
      this.currency = new Currency(
          this.name(),
          U8.parseInt(call(this.origin, 'decimals', '?', 0))
      );
      this.isCurrencyInitialized = true;
    }
    const v = U64.parseInt(value);
    return isNaN(v) ? Amount.invalid() : new Amount(v, this.currency);
  }

  /**
   * Returns the balance of an account.
   *
   * @param {Address} account
   *
   * @return {Amount}
   */
  balanceOf(account: Address): Amount {
    return this.toAmount(
        call(this.origin, 'balanceOf', account.toByteString(), 0)
    );
  }

  /**
   * Transfers tokens from the caller's account to the recipient's account.
   *
   * @param {Address} toAccount
   * @param {Amount} nbTokens
   *
   * @return {boolean}
   */
  transfer(toAccount: Address, nbTokens: Amount): boolean {
    if (!this.checkAmount(nbTokens)) {
      return false;
    }

    return (
      call(
          this.origin,
          'transfer',
          toAccount
              .toStringSegment()
              .concat(ByteArray.fromU64(nbTokens.value()).toByteString()),
          0
      ) == '1'
    );
  }

  /**
   * Returns the allowance set on the owner's account for the spender.
   *
   * @param {Address} ownerAccount
   * @param {Address} spenderAccount
   *
   * @return {Amount}.
   */
  allowance(ownerAccount: Address, spenderAccount: Address): Amount {
    return this.toAmount(
        call(
            this.origin,
            'allowance',
            ownerAccount.toStringSegment()
                .concat(spenderAccount.toStringSegment()),
            0
        )
    );
  }

  /**
   * Increases the allowance of the spender on the owner's account by the amount.
   *
   * This function can only be called by the owner.
   *
   * @param {Address} spenderAccount
   * @param {Amount} nbTokens
   *
   * @return {boolean}
   */
  increaseAllowance(spenderAccount: Address, nbTokens: Amount): boolean {
    if (!this.checkAmount(nbTokens)) {
      return false;
    }

    return (
      call(
          this.origin,
          'increaseAllowance',
          spenderAccount
              .toStringSegment()
              .concat(ByteArray.fromU64(nbTokens.value()).toByteString()),
          0
      ) == '1'
    );
  }

  /**
   * Dereases the allowance of the spender on the owner's account by the amount.
   *
   * This function can only be called by the owner.
   *
   * @param {Address} spenderAccount
   * @param {Amount} nbTokens
   *
   * @return {boolean}
   */
  decreaseAllowance(spenderAccount: Address, nbTokens: Amount): boolean {
    if (!this.checkAmount(nbTokens)) {
      return false;
    }

    return (
      call(
          this.origin,
          'decreaseAllowance',
          spenderAccount
              .toStringSegment()
              .concat(ByteArray.fromU64(nbTokens.value()).toByteString()),
          0
      ) == '1'
    );
  }

  /**
   * Transfers token ownership from the owner's account to the recipient's account
   * using the spender's allowance.
   *
   * This function can only be called by the spender.
   * This function is atomic:
   * - both allowance and transfer are executed if possible;
   * - or if allowance or transfer is not possible, both are discarded.
   *
   * @param {Address} ownerAccount
   * @param {Address} recipientAccount
   * @param {Amount} nbTokens
   *
   * @return {boolean} true on success
   */
  transferFrom(
      ownerAccount: Address,
      recipientAccount: Address,
      nbTokens: Amount
  ): boolean {
    if (!this.checkAmount(nbTokens)) {
      return false;
    }

    return (
      call(
          this.origin,
          'transferFrom',
          ownerAccount
              .toStringSegment()
              .concat(
                  recipientAccount
                      .toStringSegment()
                      .concat(
                          ByteArray.fromU64(nbTokens.value())
                              .toByteString())
              ),
          0
      ) == '1'
    );
  }
}
