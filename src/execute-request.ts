import type { FunctionDefinition, OpenAIClient } from '@azure/openai';
const ns = 'executeFunction';

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

export type ExecuteFunctionOptions = {
  logger: typeof global.console.log;
  httpClient: typeof global.fetch;
  openAiClient: OpenAIClient;
  deploymentId: string;
  functionDefinition: FunctionDefinition;
  functionArguments: string;
  openApiDefinition: object;
  path: string;
  method: string;
  baseUrl: string;
};

export const executeFunction = async (options: ExecuteFunctionOptions) => {
  const {
    logger,
    httpClient,
    // openAiClient,
    // deploymentId,
    // functionDefinition,
    functionArguments,
    // openApiDefinition,
    path,
    baseUrl,
    method,
  } = options;

  logger(ns, 'building request', method);

  if (method === 'GET') {
    const qs = toQueryString(JSON.parse(functionArguments));
    const url = baseUrl + path + qs;
    const res = await httpClient(url, {
      headers: { Accept: 'application/json' },
      method,
    });
    logger(ns, 'fetched', res.status, 'GET', url);
    try {
      const json = await res.json();
      return json;
    } catch (e) {
      logger(ns, 'unable to parse json from', res.status, 'GET', url);
    }
  }

  return;
};
