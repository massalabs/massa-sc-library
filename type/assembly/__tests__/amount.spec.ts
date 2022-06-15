/* eslint-disable max-len */
import {Currency} from '../currency';
import {Amount} from '../amount';
import {Address} from '../address';

describe('Doc tests', () => {
  it('should be simple to use', () => {
    const c1 = new Currency('Testing', 2);
    const a1 = new Amount(500, c1);

    const a2 = a1.add(new Amount(100, c1));

    expect<u64>(a2.value()).toBe(600);
    expect<bool>(a1.lessThan(a2)).toBeTruthy();

    // Amount a1 is lower than amout a2
    // Substraction is therefore negative which is forbidden.
    // Therefore new amount is not valid anymore.
    expect<bool>(a1.substract(a2).isValid()).toBeFalsy();
  });
});

describe('Blackbox tests', () => {
  test('checker/getter', () => {
    const a = new Amount(100, new Currency());
    expect<u64>(a.value()).toBe(100, 'value method');
    expect<bool>(a.isValid()).toBeTruthy('isValid method');
    expect<bool>(a.currency().sameAs(new Currency()))
        .toBeTruthy('currency method');
  });
  test('under/overflow', () => {
    const a = new Amount(u64.MAX_VALUE);
    expect<bool>(a.add(new Amount(1)).isValid()).toBeFalsy('overflow');
    expect<bool>(a.add(new Amount(0)).isValid()).toBeTruthy('MAX_VALUE + 0');
    expect<bool>((new Amount()).substract(a).isValid()).toBeFalsy('underflow');
  });
});

describe('Amount Serialize/Deserialize', () => {
  test('should serialize/deserialize to and from bytes', () => {
    const amount = new Amount(100, new Currency());

    // serialize
    const serializedAmount = Amount.serialize(amount);
    expect<StaticArray<u8> | null>(serializedAmount).not.toBeNull();

    // deserialize
    const deserializedAmount = Amount.deserialize(serializedAmount as StaticArray<u8>);
    expect<Amount | null>(deserializedAmount).not.toBeNull();

    // check validity
    expect<u64>((deserializedAmount as Amount).value()).toBe(100, 'value method');
  });

  test('should serialize/deserialize to and from string', () => {
    const amount = new Amount(100, new Currency());

    // serialize
    const serializedAmount = Amount.serializeToString(amount) as string;

    // deserialize
    const deserializedAmount = Amount.deserializeFromStr(serializedAmount) as Amount;
    expect<Amount | null>(deserializedAmount).not.toBeNull();

    // check validity
    expect<u64>((deserializedAmount as Amount).value()).toBe(100, 'value method');
  });
});

describe('Address Serialize/Deserialize', () => {
  test('should serialize/deserialize to and from bytes', () => {
    const address = new Address('A1NRGxGKzvbTftYGKD5NWrn2pJ6DSNvBMMy29AUipr3uhLwQRe5');

    // serialize
    const serializedAddress = Address.serialize(address);
    expect<StaticArray<string> | null>(serializedAddress).not.toBeNull();

    // deserialize
    const deserializedAddress = Address.deserialize(serializedAddress as StaticArray<u8>);
    expect<Address | null>(deserializedAddress).not.toBeNull();

    // check validity
    expect<string>((deserializedAddress as Address).value()).toBe(address, 'value method');
  });

  test('should serialize/deserialize to and from string', () => {
    const address = new Address('A1NRGxGKzvbTftYGKD5NWrn2pJ6DSNvBMMy29AUipr3uhLwQRe5');

    // serialize
    const serializedAddress = Address.serializeToString(address) as string;

    // deserialize
    const deserializedAddress = Address.deserializeFromStr(serializedAddress) as Address;
    expect<Address | null>(deserializedAddress).not.toBeNull();

    // check validity
    expect<string>((deserializedAddress as Address).value()).toBe(address, 'value method');
  });

  test('should show invalid on bad address', () => {
    const address = new Address('X1NRGxGKzvbTftYGKD5NWrn2pJ6DSNvBMMy29AUipr3uhLwQRe5');

    // check validity
    expect<bool>(address.isValid()).toBeFalsy('Wrong address format');
  });
});
