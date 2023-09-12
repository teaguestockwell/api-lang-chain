import { getOpenApiSpec } from './get-open-api-spec';
import { getFunctionsFromSpec } from './get-functions-from-spec';
import { validateOpenApi } from './validate-open-api';
const ns = 'create';

export type CreateOptions = {
  /**
   * override the default http client (global.fetch)
   */
  httpClient?: typeof global.fetch;
  /**
   * override the default logger (global.console.log)
   */
  logger?: typeof global.console.log;
  /**
   * url to fetch the open api definition of the service, for now this must be public read
   */
  openApiUrl: string;
  /**
   * azure > openai > keys and endpoints > key
   */
  azureOpenAiKey: string;
  /**
   * azure > openai > keys and endpoints > endpoint
   */
  azureOpenAiEndpoint: string;
  /**
   * azure > openai > model deployments
   */
  deploymentId: string;
};

/**
 * produce a natural language client for your api
 */
export const create = async (options: CreateOptions) => {
  const {
    httpClient = fetch,
    logger = console.log,
    openApiUrl,
    azureOpenAiKey,
    azureOpenAiEndpoint,
    deploymentId,
  } = options;
  const errors: string[] = [];
  if (!openApiUrl) {
    errors.push('undefined openApiUrl');
  }
  if (!azureOpenAiEndpoint) {
    errors.push('undefined azureOpenAiEndpoint');
  }
  if (!azureOpenAiKey) {
    errors.push('undefined azureOpenAiKey');
  }
  if (!deploymentId) {
    errors.push('undefined deploymentId');
  }
  if (errors.length) {
    const e = errors.join(', ');
    logger(ns, 'invalid args', e);
    throw new Error(e);
  }

  await validateOpenApi({ openApiUrl, httpClient, logger });
  const spec = await getOpenApiSpec({ openApiUrl, httpClient, logger });
  const functions = getFunctionsFromSpec({ spec, logger });

  return { spec, functions };
};
