export type ValidateOpenApiOptions = {
  openApiUrl: string;
  httpClient: typeof global.fetch;
  logger: typeof global.console.log;
};

const validationUrl = 'https://validator.swagger.io/validator/debug';

export const validateOpenApi = async (
  options: ValidateOpenApiOptions
): Promise<void> => {
  const { openApiUrl, httpClient, logger } = options;
  try {
    const response0 = await httpClient(validationUrl, {
      headers: { Accept: 'application/json' },
    });
    if (response0.status !== 400) {
      logger(validateOpenApi.name, 'skipping', openApiUrl);
      return;
    }

    const response1 = await httpClient(validateOpenApi + `?url=${openApiUrl}`, {
      headers: { Accept: 'application/json' },
    });
    if (!response1.ok) {
      logger(validateOpenApi.name, 'skipping', openApiUrl);
      return;
    }
    let json: undefined | { schemaValidationMessages: unknown[] };
    try {
      json = (await response1.json()) as typeof json;
      if (!json?.schemaValidationMessages) {
        throw 'skip';
      }
    } catch (e) {
      logger(validateOpenApi.name, 'skipping', openApiUrl, e);
      return;
    }
    if (json.schemaValidationMessages.length) {
      logger(validateOpenApi.name, 'invalid', json, openApiUrl);
      throw new Error(validateOpenApi.name + ' invalid');
    }
    logger(validateOpenApi.name, 'valid', openApiUrl);
  } catch (e) {
    logger(validateOpenApi.name, 'unknown error', e);
    throw e;
  }
};
