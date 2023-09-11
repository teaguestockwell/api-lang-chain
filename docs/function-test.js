import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
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

const getClient = (env) => {
  return new OpenAIClient(
    env.azureOpenAiEndpoint,
    new AzureKeyCredential(env.azureOpenAiKey)
  );
};

const main = async () => {
  const env = getEnv();
  const client = getClient(env);

  const res = await client.getChatCompletions(
    env.deploymentId,
    [{ role: 'user', content: "What's the weather like in Boston?" }],
    {
      functions: [
        {
          name: 'get_current_weather',
          description: 'Get the current weather in a given location',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'The city and state, e.g. San Francisco, CA',
              },
              unit: {
                type: 'string',
                enum: ['celsius', 'fahrenheit'],
              },
            },
            required: ['location'],
          },
        },
      ],
    }
  );

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
