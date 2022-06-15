/* eslint-disable max-len */
import {Address} from '../address';

describe('Address Serialize/Deserialize', () => {
  test('should serialize/deserialize to and from bytes', () => {
    const address = new Address('A1NRGxGKzvbTftYGKD5NWrn2pJ6DSNvBMMy29AUipr3uhLwQRe5');

    // serialize
    const serializedAddress = address.serialize();
    expect<StaticArray<u8>|null>(serializedAddress).not.toBeNull();

    // deserialize
    const deserializedAddress = Address.deserialize(serializedAddress as StaticArray<u8>);
    expect<Address|null>(deserializedAddress).not.toBeNull();

    // check validity
    expect<string>((deserializedAddress as Address).value()).toBe(address.value(), 'value method');
  });

  test('should serialize/deserialize to and from string', () => {
    const address = new Address('A1NRGxGKzvbTftYGKD5NWrn2pJ6DSNvBMMy29AUipr3uhLwQRe5');

    // serialize
    const serializedAddress = address.serializeToString();
    expect<string | null>(serializedAddress).not.toBeNull();

    // deserialize
    const deserializedAddress = Address.deserializeFromStr(serializedAddress as string) as Address;
    expect<Address | null>(deserializedAddress).not.toBeNull();

    // check validity
    expect<string>((deserializedAddress as Address).value()).toBe(address.value(), 'value method');
  });

  test('should show invalid on bad address', () => {
    const address = new Address('X1NRGxGKzvbTftYGKD5NWrn2pJ6DSNvBMMy29AUipr3uhLwQRe5');

    // check validity
    expect<bool>(address.isValid()).toBeFalsy('Wrong address format');
  });
});
