import { getOpenApiSpec } from './get-open-api-spec';
import { validateOpenApi } from './validate-open-api';

export type CreateOptions = {
  /**
   * url to fetch the open api definition of the service
   */
  openApiUrl: string;
  /**
   * override the default http client (global.fetch)
   */
  httpClient?: typeof global.fetch;
  /**
   * override the default logger (global.console.log)
   */
  logger?: typeof global.console.log;
  /**
   * azure > openai > keys and endpoints > key
   */
  azureOpenAiKey: string;
  /**
   * azure > openai > keys and endpoints > endpoint
   */
  azureOpenAiEndpoint: string;
};

/**
 * produce a natural language client for your api
 */
export const create = async (options: CreateOptions) => {
  const {
    openApiUrl,
    httpClient = fetch,
    logger = console.log,
    azureOpenAiKey,
    azureOpenAiEndpoint,
  } = options;
  
  if (!azureOpenAiEndpoint) {
    throw 'undefined azureOpenAiEndpoint';
  }
  if (!azureOpenAiKey) {
    throw 'undefined azureOpenAiKey';
  }

  await validateOpenApi({ openApiUrl, httpClient, logger });
  const spec = await getOpenApiSpec({ openApiUrl, httpClient, logger });

  return spec;
};
