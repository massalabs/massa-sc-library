/* eslint-disable no-unused-vars */

import {JSON} from 'json-as';

/**
 * Set Allowance Arguments
 * @param {string} spender - Spender address.
 * @param {u64} amount - Allowance Amount.
 */
 @json
// eslint-disable-next-line require-jsdoc
export class SetAllowanceArgs {
  spender: string;
  amount: u64;
}

 /**
  * Get Allowance Arguments
  * @param {string} owner - Owner address.
  * @param {string} spender - Spender address.
  */
 @json
// eslint-disable-next-line require-jsdoc
export class GetAllowanceArgs {
  owner: string;
  spender: string;
}

/**
  * Get Allowance Arguments
  * @param {string} spender - Spender address.
  * @param {u64} addedAmount - Added amount.
  */
  @json
// eslint-disable-next-line require-jsdoc
export class IncreaseAllowanceArgs {
  spender: string;
  addedAmount: u64;
}

/**
  * Get Allowance Arguments
  * @param {string} owner - Owner address.
  * @param {u64} spender - Spender address.
  */
 @json
 // eslint-disable-next-line require-jsdoc
export class DecreaseAllowanceArgs {
  spender: string;
  subtractedAmount: u64;
}


/**
  * Mint Tokens Arguments
  * @param {string} address - Tokens receiver.
  * @param {u64} amount - Amount of tokens to mint.
  */
 @json
 // eslint-disable-next-line require-jsdoc
export class MintArgs {
  address: string;
  amount: u64;
}

/**
  * Transfer Tokens Arguments
  * @param {string} to - Tokens receiver.
  * @param {u64} amount - Amount of tokens to transfer.
  */
 @json
 // eslint-disable-next-line require-jsdoc
export class TransferArgs {
  to: string;
  amount: u64;
}

/**
  * Transfer From Tokens Arguments
  * @param {string} to - Tokens sender.
  * @param {string} to - Tokens receiver.
  * @param {u64} amount - Amount of tokens to transfer.
  */
 @json
 // eslint-disable-next-line require-jsdoc
export class TransferFromArgs {
  to: string;
  from: string;
  amount: u64;
}

