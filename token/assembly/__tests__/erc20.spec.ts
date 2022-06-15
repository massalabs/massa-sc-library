/* eslint-disable max-len */
import * as token from '../erc20/erc20';

// TODO change relative path to cleaner import
import {setData} from '../../node_modules/mscl-vm-mock/assembly/storage';
import {Address} from '../../node_modules/mscl-type/assembly/address';
import {Amount} from '../../node_modules/mscl-type/assembly/amount';


describe('Black box tests', () => {
  it('should expose token name', () => {
    const tokenName = 'Massa ERC20 token';
    expect<string>(token.name()).toBe(tokenName);
  });

  it('should expose token symbol', () => {
    const tokenSymbol = 'MET';
    expect<string>(token.symbol()).toBe(tokenSymbol);
  });

  it('should return 0 for initial total supply', () => {
    expect<u64>(token.totalSupply()).toBe(
        10000,
        'default total supply not working'
    );
  });

  it('should return 0 for a non-initialized balance', () => {
    // create a new legit account
    const accountAddress = new Address('AXXXaddress-1XXX');
    // get balance using a serialized argument version of the address
    const serializedBalance = token.balanceOf(<string>accountAddress.serializeToString());
    // deserialize the returned amount
    const amount = <Amount>Amount.deserializeFromStr(serializedBalance);
    // validate
    expect<u64>(amount.value()).toBe(
        0,
        'default balance not working'
    );
  });

  it('should return initialized balance', () => {
    // create a new legit account
    const accountAddress = new Address('AXXXaddress-1XXX');
    // set balance to storage
    setData(token.BALANCE_KEY_PRAEFIX.concat(accountAddress.value()), '1');
    // get balance using a serialized argument version of the address
    const serializedBalance = token.balanceOf(<string>accountAddress.serializeToString());
    // deserialize the returned amount
    const amount = <Amount>Amount.deserializeFromStr(serializedBalance);
    // validate
    expect<u64>(amount.value()).toBe(
        1,
        'custom balance not working'
    );
  });
});
