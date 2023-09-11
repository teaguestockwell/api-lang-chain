/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FunctionDefinition } from '@azure/openai';
import type { OpenApiSpec } from './types';

export const hydrateRefs = (root: OpenApiSpec, _node?: any) => {
  const node: any = _node ?? root;
  for (const k of Object.keys(node)) {
    if (!!node[k] && typeof node[k] === 'object') {
      hydrateRefs(root, node[k]);
    }
    if (k === '$ref' && typeof node[k] === 'string') {
      try {
        let curPath: any;
        for (const path of node[k].split('/')) {
          if (path === '#') {
            curPath = root;
          } else {
            curPath = curPath[path];
          }
        }
        node[k] = curPath;
      } catch (e) {
        throw new Error('unable to hydrate refs');
      }
    }
  }
};

export const convertSpecToFunctions = (
  openApiSpec: OpenApiSpec
): FunctionDefinition[] => {
  if (openApiSpec) {
    return [];
  } else {
    return [];
  }
};
