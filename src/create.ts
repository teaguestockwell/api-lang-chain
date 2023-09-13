/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getOpenApiSpec } from './get-open-api-spec';
import { getFunctionsFromSpec } from './get-functions-from-spec';
import { validateOpenApi } from './validate-open-api';
import { OpenAIClient, AzureKeyCredential, ChatMessage } from '@azure/openai';
import {
  findLast,
  interpolateUrlParams,
  omitLargeProperties,
  toQueryString,
} from './utils';
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
  /**
   * the max number of iterations the model will be used to answer the prompt
   */
  maxIterations?: number;
};

/**
 * produce a natural language client for your api
 */
export const create = async (options: CreateOptions) => {
  const {
    httpClient = fetch,
    logger = () => {},
    openApiUrl,
    azureOpenAiKey,
    azureOpenAiEndpoint,
    deploymentId,
    maxIterations = 10,
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
  const apiSpec = await getOpenApiSpec({ openApiUrl, httpClient, logger });
  const functions = getFunctionsFromSpec({
    spec: apiSpec,
    logger,
  });

  const promptApiChat = async (
    content: string
  ): Promise<{ msg?: string; json?: string }> => {
    const messages: ChatMessage[] = [];
    const appendMessage = (msg: ChatMessage) => {
      logger(ns, 'msg', msg);
      messages.push(msg);
    };
    const openAiClient = new OpenAIClient(
      azureOpenAiEndpoint,
      new AzureKeyCredential(azureOpenAiKey)
    );

    appendMessage({
      role: 'user',
      content,
    });

    for (let i = 0; i < maxIterations; i++) {
      try {
        const chatRes = await openAiClient.getChatCompletions(
          deploymentId,
          messages,
          {
            functions: functions.slice(0, 5).map((e) => e.openAiDef),
          }
        );
        const msg = chatRes.choices[0].message;
        if (!msg) {
          logger(ns, 'undefined msg');
          break;
        }
        if (!msg.functionCall) {
          if (i === 0) {
            appendMessage({
              role: msg.role,
              content: msg.content,
            });
            appendMessage({
              role: 'system',
              content:
                'are you sure you have enough data to answer? consider calling a function',
            });
            continue;
          }
          return {
            msg: msg.content ?? undefined,
            json:
              findLast(messages, (m) => m.role === 'function')?.content ??
              undefined,
          };
        }
        appendMessage({
          role: msg.role,
          name: msg.functionCall.name,
          content: msg.functionCall.arguments,
        });

        const fn = functions[+msg.functionCall.name];
        // assuming a well formed api:
        // - it does not expect args in request body for get
        // - it does not expect the same args in path and query string: /event(1)?eventId=1
        if (fn.method === 'GET') {
          const { interpolatedPath, omittedArgs } = interpolateUrlParams(
            fn.path,
            JSON.parse(msg.functionCall.arguments)
          );
          const qs = toQueryString(omittedArgs);
          const url = apiSpec.servers[0] + interpolatedPath + qs;
          const httpRes = await httpClient(url, {
            headers: { Accept: 'application/json' },
            method: fn.method,
          });
          logger(ns, 'invoked fn', httpRes.status + ' GET ' + url);

          const text = await httpRes.text();

          appendMessage({
            role: 'function',
            name: msg.functionCall?.name ?? '',
            content: omitLargeProperties(text),
          });
          if (!httpRes.ok) {
            appendMessage({
              role: 'system',
              content:
                'the last function args had an error, please try invoking it again another way',
            });
          }
        }
      } catch (e) {
        logger(ns, 'error', JSON.stringify(e));
      }
    }

    logger(ns, 'aborted - max attempts used');
    return {
      msg: undefined,
      json: undefined,
    };
  };

  return { apiSpec, functions, promptApiChat };
};
