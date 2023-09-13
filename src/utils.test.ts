import { interpolateUrlParams } from './utils';

describe('interpolateUrlParam', () => {
  it('adds args to the url', () => {
    const url = '/Categories({CategoryID})';
    const args = { CategoryID: '1' };

    const actual = interpolateUrlParams(url, args);

    expect(actual.omittedArgs).toEqual({});
    expect(actual.interpolatedPath).toBe('/Categories(1)');
  });
  it('does not omit args not in the url', () => {
    const url = '/Categories({CategoryID})';
    const args = { CategoryID: '1', foo: '1' };

    const actual = interpolateUrlParams(url, args);

    expect(actual.omittedArgs).toEqual({ foo: '1' });
    expect(actual.interpolatedPath).toBe('/Categories(1)');
  });
  it('adds many args to the url', () => {
    const url = '/Categories({CategoryID},{fooID},{CategoryID})';
    const args = { CategoryID: '1', fooID: '2' };

    const actual = interpolateUrlParams(url, args);

    expect(actual.omittedArgs).toEqual({});
    expect(actual.interpolatedPath).toBe('/Categories(1,2,1)');
  });
});
