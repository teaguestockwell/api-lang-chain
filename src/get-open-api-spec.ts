import * as Parser from '@apidevtools/json-schema-ref-parser';
import { OpenApiSpec } from './types';
const ns = 'getOpenApiSpec';

export type GetOpenSpecOptions = {
  openApiUrl: string;
  httpClient: typeof global.fetch;
  logger: typeof global.console.log;
};

export const getOpenApiSpec = async (options: GetOpenSpecOptions) => {
  const { openApiUrl, httpClient, logger } = options;
  try {
    const response = await httpClient(openApiUrl, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      logger(ns, response.status);
      throw new Error(ns + ' ' + response.status);
    }
    let json;
    try {
      json = await response.json();
      logger(ns, 'fetched and parsed', json);
      const spec = await Parser.dereference(json);
      logger(ns, 'dereferenced', spec);
      return spec as OpenApiSpec;
    } catch (e) {
      logger(ns, 'json parse error', e);
      throw e;
    }
  } catch (e) {
    logger(ns, 'unknown error', e);
    throw e;
  }
};
