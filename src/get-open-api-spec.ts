export type GetOpenSpecOptions = {
  openApiUrl: string;
  httpClient: typeof global.fetch;
  logger: typeof global.console.log;
};

export const getOpenApiSpec = async (options: GetOpenSpecOptions) => {
  const {openApiUrl, httpClient, logger} = options;
  try {
    const response = await httpClient(openApiUrl, {headers: {Accept: 'application/json'}})
    if (!response.ok) {
      logger(getOpenApiSpec.name, response.status)
      throw new Error(getOpenApiSpec.name + " " + response.status)
    }
    let json
    try {
      json = await response.json()
    } catch (e) {
      logger(getOpenApiSpec.name, 'json parse error', e)
      throw e
    }
  } catch (e) {
    logger(getOpenApiSpec.name, 'unknown error', e)
    throw e
  } 
}

