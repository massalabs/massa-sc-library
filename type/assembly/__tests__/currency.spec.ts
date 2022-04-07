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
