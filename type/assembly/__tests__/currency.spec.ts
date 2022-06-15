/* eslint-disable max-len */
import {Currency} from '../currency';

describe('Doc tests', () => {
  it('should be easy to use', () => {
    const c1 = new Currency('Testing', 2);
    expect<string>(c1.name()).toBe('Testing');
    expect<u8>(c1.minorUnit()).toBe(2);

    const c2 = new Currency('Other testing', 2);
    expect<bool>(c1.sameAs(c2)).toBeFalsy();
  });
});

describe('Black box tests', () => {
  test('empty constructor', () => {
    const c = new Currency();
    expect<string>(c.name()).toBe('');
    expect<u8>(c.minorUnit()).toBe(0);
  });

  test('same currency', () => {
    const c1 = new Currency('aaaa', 6);
    const c2 = new Currency('aaaa', 6);
    expect<bool>(c1.sameAs(c2)).toBeTruthy();
    expect<bool>(c2.sameAs(c1)).toBeTruthy();
    expect<bool>(c1.sameAs(c1)).toBeTruthy();
  });
});


describe('Currency Serialize/Deserialize', () => {
  test('should serialize/deserialize to and from bytes', () => {
    const currency = new Currency('aaaa', 6);

    // serialize
    const serializedCurrency = currency.serialize();

    // deserialize
    const deserializedCurrency = Currency.deserialize(serializedCurrency as StaticArray<u8>);

    // check validity
    expect<string>((deserializedCurrency).name()).toBe('aaaa', 'currency name');
    expect<u8>((deserializedCurrency).minorUnit()).toBe(6, 'currency minor unit');
  });

  test('should serialize/deserialize to and from string', () => {
    const currency = new Currency('aaaa', 6);

    // serialize
    const serializedCurrency = currency.serializeToString();

    // deserialize
    const deserializedCurrency = Currency.deserializeFromStr(serializedCurrency);

    // check validity
    expect<string>((deserializedCurrency).name()).toBe('aaaa', 'currency name');
    expect<u8>((deserializedCurrency).minorUnit()).toBe(6, 'currency minor unit');
  });
});
