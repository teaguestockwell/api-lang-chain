const validationUrl = 'https://validator.swagger.io/validator/debug';
const ns = 'validateOpenApi';

export type ValidateOpenApiOptions = {
  openApiUrl: string;
  httpClient: typeof global.fetch;
  logger: typeof global.console.log;
};

export const validateOpenApi = async (
  options: ValidateOpenApiOptions
): Promise<void> => {
  const { openApiUrl, httpClient, logger } = options;
  try {
    const response0 = await httpClient(validationUrl, {
      headers: { Accept: 'application/json' },
    });
    if (response0.status !== 400) {
      logger(ns, 'skipping', openApiUrl);
      return;
    }

    const response1 = await httpClient(validationUrl + `?url=${openApiUrl}`, {
      headers: { Accept: 'application/json' },
    });
    if (!response1.ok) {
      logger(ns, 'skipping', openApiUrl);
      return;
    }
    let json: undefined | { schemaValidationMessages: unknown[] };
    try {
      json = (await response1.json()) as typeof json;
      if (!json?.schemaValidationMessages) {
        throw 'skip';
      }
    } catch (e) {
      logger(ns, 'skipping', openApiUrl, e);
      return;
    }
    if (json.schemaValidationMessages.length) {
      logger(ns, 'invalid', json, openApiUrl);
      throw new Error(ns + ' invalid');
    }
    logger(ns, 'valid', openApiUrl);
  } catch (e) {
    logger(ns, 'unknown error', e);
    throw e;
  }
};
