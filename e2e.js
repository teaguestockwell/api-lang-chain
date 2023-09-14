import { create } from './dist/index.module.js';
import { config } from 'dotenv';

const main = async () => {
  config();
  const client = await create({
    azureOpenAiKey: process.env.AZURE_OPENAI_KEY,
    azureOpenAiEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
    deploymentId: process.env.DEPLOYMENT_ID,
    openApiUrl:
      'https://raw.githubusercontent.com/oasis-tcs/odata-openapi/main/examples/Northwind-V3.openapi3.json',
    logger: (...args) => {
      if (args[0] === 'create') {
        for (let i = 1; i < args.length; i++) {
          try {
            console.log(JSON.stringify(JSON.parse(args[i]), null, 2));
          } catch {
            console.log(args[i]);
          }
        }
      }
    },
  });

  const prompt =
    'write me a haiku with category names that have the letter a in them';
  const res = await client.promptApiChat(prompt);
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
