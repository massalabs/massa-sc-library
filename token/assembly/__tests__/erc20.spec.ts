/* eslint-disable max-len */
import * as token from '../erc20/erc20';

// TODO change relative path to cleaner import
import {setData} from '../../node_modules/mscl-vm-mock/assembly/storage';


describe('Black box tests', () => {
  it('should expose token name', () => {
    const tokenName = 'MASSA_COIN';
    setData(token.NAME_KEY, tokenName);
    expect<string>(token.name()).toBe(tokenName);
  });

  it('should expose token symbol', () => {
    const tokenSymbol = 'MAS';
    setData(token.SYMBOL_KEY, tokenSymbol);
    expect<string>(token.symbol()).toBe(tokenSymbol);
  });

  it('should expose token decimals', () => {
    const tokenDecimals: u8 = 6;
    setData(token.DECIMALS_KEY, tokenDecimals.toString());
    expect<u8>(token.decimals()).toBe(tokenDecimals);
  });

  it('should return 0 for initial total supply', () => {
    expect<u64>(token.totalSupply()).toBe(
        0,
        'default total supply not working'
    );
  });

  it('should return 0 for initialized balance', () => {
    const accountAddress = 'XXXaddress-1XXX';
    expect<u64>(token.balanceOf(accountAddress)).toBe(
        0,
        'default balance not working'
    );
  });

  it('should return initialized balance', () => {
    const accountAddress = 'XXXaddress-1XXX';
    setData(token.BALANCE_KEY_PRAEFIX.concat(accountAddress), '1');
    expect<u64>(token.balanceOf(accountAddress)).toBe(
        1,
        'custom balance not working'
    );
  });

  it('should return default allowance of 0', () => {
    const ownerAddress = 'ownerAddress-1XXX';
    const spenderAddress = 'spenderAddress-1XXX';
    expect<u64>(token.allowance(ownerAddress, spenderAddress)).toBe(
        0,
        'default allowance not working'
    );
  });


  it('should set allowance', () => {
    const ownerAddress = 'ownerAddress-1XXX';
    const spenderAddress = 'spenderAddress-1XXX';
    setData(token.ALLOWANCE_KEY_PRAEFIX.concat(ownerAddress).concat(spenderAddress), '1');
    expect<u64>(token.allowance(ownerAddress, spenderAddress)).toBe(
        1,
        'custom allowance not working'
    );
  });
});
