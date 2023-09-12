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
  let sb = ' ';
  for (const a of args) {
    if (typeof a === 'string') {
      sb += a + ' ';
    } else {
      sb += typeof a + ' ';
    }
  }
  console.log(sb);
};

const main = async () => {
  const client = await create({
    ...getEnv(),
    logger,
    openApiUrl:
      'https://raw.githubusercontent.com/oasis-tcs/odata-openapi/main/examples/Northwind-V3.openapi3.json',
  });
  if (!client) throw 'no client';
  // const cyclic = [];
  // for (const pathK of Object.keys(client.spec.paths)) {
  //   for (const methodK of Object.keys(client.spec.paths[pathK])) {
  //     const { parameters, requestBody } = client.spec.paths[pathK][methodK];
  //     const propBag = (() => {
  //       if (parameters) {
  //         return parameters;
  //       }
  //       if (requestBody?.content?.['application/json']) {
  //         return [requestBody?.content?.['application/json']];
  //       }
  //       return [];
  //     })();
  //     try {
  //       console.log(JSON.stringify(propBag, null, 2));
  //     } catch (e) {
  //       cyclic.push(pathK + methodK);
  //     }
  //   }
  // }
  // console.log(cyclic);


  console.log(JSON.stringify(client.functions.slice(0,5), null, 2))

  const prompt = "show me 3 categories that have the letter 'a'"
  const res = await client.callFunction(prompt)
  console.log(JSON.stringify(res, null, 2))
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
