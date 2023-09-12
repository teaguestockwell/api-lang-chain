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

const main = async () => {
  const client = await create({
    ...getEnv(),
    openApiUrl:
      'https://raw.githubusercontent.com/oasis-tcs/odata-openapi/main/examples/Northwind-V3.openapi3.json',
  });

  const prompt = "show me 3 categories that have the letter 'a'";
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
