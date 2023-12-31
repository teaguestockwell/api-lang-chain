/* eslint-disable @typescript-eslint/no-explicit-any */
export type OpenApiSpec = {
  openapi: string;
  info: {
    title: string;
    description: string;
    version: string;
  };
  servers: {
    url: string;
    description?: string;
  }[];
  paths: {
    [path: string]: {
      [lowercaseHttpVerb: string]: {
        summary: string;
        tags: string[];
        parameters?: { name: string; schema: unknown }[];
        requestBody?: {
          content?: { 'application/json': { schema: { properties: object } } };
        };
      };
    };
  };
  components: {
    schemas?: {
      [name: string]: any;
    };
    parameters: {
      [name: string]: any;
    };
    responses: {
      [name: string]: any;
    };
  };
};
