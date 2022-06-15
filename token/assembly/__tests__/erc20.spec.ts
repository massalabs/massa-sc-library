/* eslint-disable max-len */
import * as token from '../erc20/erc20mock';

// TODO change relative path to cleaner import
import {setData} from '../../node_modules/mscl-vm-mock/assembly/storage';
import {Address} from '../../node_modules/mscl-type/assembly/address';
import {Amount} from '../../node_modules/mscl-type/assembly/amount';
import {Currency} from '../../node_modules/mscl-type/assembly/currency';
import {GetAllowanceArgs, SetAllowanceArgs, TransferArgs} from '../erc20/args';


describe('Black box tests', () => {
  it('should expose token name', () => {
    const tokenName = 'Massa ERC20 Token';
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

  it('should return 0 balance for a non-initialized balance', () => {
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
    setData(token.BALANCE_KEY_PRAEFIX.concat(accountAddress.value()), '1'); // NOTE: we do this here as we dont yet have a mint func
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

  it('should return 0 allowance for uninitialized allowance', () => {
    // create a new legit account
    const ownerAddress = new Address('AXXXaddress-1XXX-OWNER');
    const spenderAddress = new Address('AXXXaddress-1XXX-SPENDER');
    // get allowance using a serialized argument version of the address
    const args = new GetAllowanceArgs(ownerAddress, spenderAddress);
    const serializedAllowanceAmount = token.allowance(<string>args.serializeToString());
    // deserialize the returned allowance amount
    const amount = <Amount>Amount.deserializeFromStr(serializedAllowanceAmount);
    // validate
    expect<u64>(amount.value()).toBe(
        0,
        'default allowance not working'
    );
  });

  it('should set allowance', () => {
    // create a new legit account
    const ownerAddress = new Address('AXXXaddress-1XXX-OWNER');
    const spenderAddress = new Address('AXXXaddress-1XXX-SPENDER');
    const allowanceAmount = new Amount(5, new Currency());
    // set allowance
    const setArgs = new SetAllowanceArgs(spenderAddress, allowanceAmount);
    token.approve(ownerAddress.value(), <string>setArgs.serializeToString());
    // get allowance info using a serialized argument version of the address
    const getArgs = new GetAllowanceArgs(ownerAddress, spenderAddress);
    const serializedAllowanceAmount = token.allowance(<string>getArgs.serializeToString());
    // deserialize the returned allowance amount
    const amount = <Amount>Amount.deserializeFromStr(serializedAllowanceAmount);
    // validate
    expect<u64>(amount.value()).toBe(
        <u64>allowanceAmount.value(),
        'custom allowance not working'
    );
  });

  it('should transfer tokens', () => {
    // create new legit accounts
    const fromAddress = new Address('AXXXaddress-1XXX-FROM');
    const fromAddressBalance = new Amount(10, new Currency());
    const toAddress = new Address('AXXXaddress-1XXX-TO');
    const toAddressBalance = new Amount(10, new Currency());
    const amountToTransfer = new Amount(5, new Currency());
    // set balances to storage // NOTE: we do this here as we dont yet have a mint func
    setData(token.BALANCE_KEY_PRAEFIX.concat(fromAddress.value()), fromAddressBalance.value().toString());
    setData(token.BALANCE_KEY_PRAEFIX.concat(toAddress.value()), toAddressBalance.value().toString());
    // get allowance using a serialized argument version of the address
    const args = new TransferArgs(toAddress, amountToTransfer);
    token.transfer(fromAddress.value(), <string>args.serializeToString());
    // get balances using a serialized argument version of the address
    const fromAddressSerializedBalance = token.balanceOf(<string>fromAddress.serializeToString());
    const fromBalance = <Amount>Amount.deserializeFromStr(fromAddressSerializedBalance);
    const toAddressSerializedBalance = token.balanceOf(<string>toAddress.serializeToString());
    const toBalance = <Amount>Amount.deserializeFromStr(toAddressSerializedBalance);
    // validate balances
    expect<u64>(fromBalance.value()).toBe(
      <u64>(fromAddressBalance.substract(amountToTransfer)).value(),
      'from balance allowance not working'
    );
    expect<u64>(toBalance.value()).toBe(
      <u64>(fromAddressBalance.add(amountToTransfer)).value(),
      'to balance allowance not working'
    );
  });
});
