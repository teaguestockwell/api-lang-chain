/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FunctionDefinition } from '@azure/openai';
import type { OpenApiSpec } from './types';
const ns = 'getFunctionFromSpec';

export type GetFunctionFromSpec = {
  logger: typeof global.console.log;
  spec: OpenApiSpec;
};

export const getFunctionsFromSpec = (options: GetFunctionFromSpec) => {
  const { logger, spec } = options;
  const fns: {
    openAiDef: FunctionDefinition;
    path: string;
    method: string;
    openApiDef: object;
  }[] = [];
  const meta = { success: 0, error: 0, id: Date.now(), count: 0 };

  for (const pathK of Object.keys(spec.paths)) {
    let pathParams: undefined | Array<{ name: string; schema: any }> =
      undefined;
    for (const pathKK of Object.keys(spec.paths[pathK])) {
      // todo: support n nested paths instead of 1
      // todo: make pathParams required
      // separate path params from rest of params
      if (pathKK === 'parameters') {
        pathParams = spec.paths[pathK][pathKK] as any;
        continue;
      }
      try {
        const openApiDef = spec.paths[pathK][pathKK];
        const { parameters, summary, requestBody } = openApiDef;
        const propBag = (() => {
          if (parameters) {
            return parameters;
          }
          if (requestBody?.content?.['application/json']) {
            return Object.entries(
              requestBody?.content?.['application/json']?.schema?.properties
            ).map(([name, schema]) => ({ name, schema }));
          }
          return [];
        })();
        const propBagWithPathParams = (() => {
          if (pathParams) {
            return pathParams.concat(propBag);
          }
          return propBag;
        })();
        const openAiDef: FunctionDefinition = {
          name: meta.count + '',
          description: summary,
          parameters: {
            type: 'object',
            properties: propBagWithPathParams.reduce(
              (acc, cur) => {
                if (cur.name) {
                  acc[cur.name] = cur.schema;
                }
                return acc;
              },
              {} as Record<string, any>
            ),
          },
        };
        fns.push({
          openAiDef,
          openApiDef,
          method: pathKK.toUpperCase(),
          path: pathK,
        });
        meta.success++;
      } catch (e) {
        logger(ns, 'skipping function', e, spec.paths[pathK][pathKK]);
      }
      meta.count++;
    }
  }

  logger(ns, 'built functions', meta, fns);

  return fns;
};
