export const toQueryString = (o: object): string => {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(o)) {
    if (v) {
      q.set(k, v);
    }
  }
  const qs = q.toString();
  return qs ? '?' + qs : '';
};

export const fromQueryString = (s: string) => {
  const q = new URLSearchParams(s);
  const obj: Record<string, string> = {};
  for (const [k, v] of q.entries()) {
    obj[k] = v;
  }
  return obj;
};

export const omitLargeProperties = (text: string) => {
  if (text.length < 500) {
    return text;
  }
  try {
    return JSON.stringify(
      JSON.parse(text, (_k, v) => {
        if (typeof v === 'string' && v.length > 250) {
          return;
        }
        return v;
      })
    );
  } catch {
    return text;
  }
};

// todo: find out why this Array.prototype.findLast is not available
export const findLast = <T>(arr: T[], predicate: (t: T) => boolean) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) {
      return arr[i];
    }
  }
  return;
};

export const interpolateUrlParams = (
  path: string,
  args: Record<string, unknown>
) => {
  let interpolatedPath = path;
  const omittedArgs = { ...args };

  for (const [k, v] of Object.entries(args)) {
    const toBeReplaced = '{' + k + '}';
    while (interpolatedPath.includes(toBeReplaced)) {
      delete omittedArgs[k];
      interpolatedPath = interpolatedPath.replace(toBeReplaced, v + '');
    }
  }

  return { interpolatedPath, omittedArgs };
};
