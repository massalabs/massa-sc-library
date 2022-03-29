import {Address} from './address';
import {isOk} from 'helper';

describe('Doc tests', () => {
  it('checks correct ledger address', async () => {
    const oops = jest.fn();
    const yeah = jest.fn();
    const rawAddr = '9mvJfA4761u1qT8QwSWcJ4gTDaFP5iSgjQzKMaqTbrWCFo1QM';
    const r = new Address().from(rawAddr);
    if (isOk(r)) {
      // address format is ok, you can use it!
      const addr = r.data;
      yeah(addr);
    } else {
      // address format is not ok, you have to handle the error
      const e = r.data;
      oops(e);
    }

    expect(yeah).toHaveBeenCalled();
    expect(oops).not.toHaveBeenCalled();
    expect(r.data.toString()).toBe(rawAddr);
  });

  it('checks incorrect ledger address', async () => {
    const oops = jest.fn();
    const yeah = jest.fn();
    const rawAddr = '';
    const r = new Address().from(rawAddr);
    if (isOk(r)) {
      // address format is ok, you can use it!
      const addr = r.data;
      yeah(addr);
    } else {
      // address format is not ok, you have to handle the error
      const e = r.data;
      oops(e);
    }

    expect(yeah).not.toHaveBeenCalled();
    expect(oops).toHaveBeenCalled();
    expect(r.data.toString().length).toBeGreaterThan(0);
  });
});
