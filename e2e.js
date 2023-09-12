import { create } from './dist/index.module.js';
import { config } from 'dotenv';

const getEnv = () => {
  config();
  const azureOpenAiKey = process.env.AZURE_OPENAI_KEY;
  const azureOpenAiEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const deploymentId = process.env.DEPLOYMENT_ID;
  if (!azureOpenAiKey || !azureOpenAiEndpoint || !deploymentId) {
    throw 'invalid env';
  }
  return { azureOpenAiKey, azureOpenAiEndpoint, deploymentId };
};

const logger = (...args) => {
  if (args[0] === 'create') {
    console.log(JSON.stringify(args, null, 2));
  }
};

const main = async () => {
  const client = await create({
    ...getEnv(),
    logger,
    openApiUrl:
      'https://raw.githubusercontent.com/oasis-tcs/odata-openapi/main/examples/Northwind-V3.openapi3.json',
  });

  const prompt = "when is the next taylor swift concert?";
  const res = await client.callFunction(prompt);
  console.log(JSON.stringify(res, null, 2));
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
