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
