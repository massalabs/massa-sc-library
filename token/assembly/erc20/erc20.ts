import {Storage, Context} from 'massa-sc-std';
import {result, err, ok, isOk} from 'mscl-helper';
import {Address} from 'mscl-type';

const NAME = 'Custom token';
const SYMBOL = 'CT';
const DECIMALS = 6;
const SUPPLY = 10000;

/**
 * Returns the name of the token
 */
export function Name():string {
  return NAME;
}

// TODO remove useless arg once issue call function is resolved
export function Symbol(_: string):string {
  return SYMBOL;
}

// TODO remove useless arg once issue call function is resolved
export function Decimals(_: string):number {
  return DECIMALS;
}

// TODO remove useless arg once issue call function is resolved
export function TotalSupply(_: string):number {
  return SUPPLY;
}

export function BalanceOf(a: string):string {
  return Storage.get_data_or_default('bal' + a, '0');
}

export function Transfer(a: string): result<null, string> {
  const args = a.split('|', 2);
  const to = args[0];
  const value = args[1];

  const res = check_address(to);
  if (!isOk(res)) return err('transfer failed: ' + res.data);

  const from = JSON.parse(Context.get_call_stack())[0];

  return _transfer(from, to, value);
}

function _transfer(from: string, to: string, value: string): result<null, string> {
  const t = check_address(from);
  if (!isOk(t)) return err('incorrect from address: ' + t.data);

  const f = check_address(to);
  if (!isOk(f)) return err('incorrect to address: ' + f.data);

  // @ts-ignore: u64 function doesn't exist in TypeScript.
  const v = u64(parseInt(value, 10));
}

function check_address(a: string): result<null, string> {
  if (a.length > 2) {
    return ok(null);
  } else {
    return err('invalid length');
  }
}
