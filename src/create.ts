/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getOpenApiSpec } from './get-open-api-spec';
import { getFunctionsFromSpec } from './get-functions-from-spec';
import { validateOpenApi } from './validate-open-api';
import { OpenAIClient, AzureKeyCredential, ChatMessage } from '@azure/openai';
import { toQueryString } from './utils';
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
    logger = () => {},
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
  const { functions, paths, methods } = getFunctionsFromSpec({
    spec,
    logger,
  });

  const callFunction = async (content: string) => {
    const maxAttempts = 5;
    const messages: ChatMessage[] = [];
    const appendMessage = (msg: ChatMessage) => {
      logger(ns, 'msg', JSON.stringify(msg, null, 2));
      messages.push(msg);
    };
    const openAiClient = new OpenAIClient(
      azureOpenAiEndpoint,
      new AzureKeyCredential(azureOpenAiKey)
    );

    appendMessage({
      role: 'system',
      content:
        'please use select to narrow the returned results, for example dont select base 64',
    });
    appendMessage({
      role: 'user',
      content,
    });

    for (let i = 0; i < maxAttempts; i++) {
      try {
        const chatRes = await openAiClient.getChatCompletions(
          deploymentId,
          messages,
          {
            functions: functions.slice(0, 5),
          }
        );
        logger(ns, 'invoked model');

        const msg = chatRes.choices[0].message;

        if (!msg) {
          logger(ns, 'undefined msg');
          break;
        }
        if (!msg.functionCall) {
          logger(ns, 'no function call');
          return msg.content;
        }
        appendMessage({
          role: msg.role,
          name: msg.functionCall.name,
          content: msg.functionCall.arguments,
        });

        const index = +msg.functionCall.name;
        if (methods[index] === 'GET') {
          const qs = toQueryString(JSON.parse(msg.functionCall.arguments));
          const url = spec.servers[0].url + paths[index] + qs;
          const httpRes = await httpClient(url, {
            headers: { Accept: 'application/json' },
            method: methods[index],
          });
          logger(ns, 'invoked fn', httpRes.status, 'GET', url);

          const text = await httpRes.text();

          appendMessage({
            role: 'function',
            name: msg.functionCall?.name ?? '',
            content: text,
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
    return;
  };

  return { spec, functions, callFunction };
};
