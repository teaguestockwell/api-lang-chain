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
    } catch (e) {
      logger(ns, 'json parse error', e);
      throw e;
    }
    logger(ns, 'fetched and parsed', json);
    return json;
  } catch (e) {
    logger(ns, 'unknown error', e);
    throw e;
  }
};
