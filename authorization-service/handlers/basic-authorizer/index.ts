import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
  Context,
} from 'aws-lambda';

const compareTokenWithCredentials = (
  token: string,
  user: string,
  pass: string
) => token === `Basic ${btoa(`${user}:${pass}`)}`;

export async function authorizer(
  event: APIGatewayTokenAuthorizerEvent,
  context: Context
): Promise<APIGatewayAuthorizerResult> {
  // Logs for debugging
  console.log('Incoming request:', JSON.stringify(event, undefined, 2));

  const token = event.authorizationToken || '';
  // const userLogin = process.env.AUTH_GITHUB_LOGIN as string;
  // const userPassword = process.env.AUTH_PASSWORD as string;
  const [userLogin, userPassword] = (
    process.env.AUTH_USER_CREDENTIALS as string
  ).split('=');

  let effect = 'Deny';

  if (compareTokenWithCredentials(token, userLogin, userPassword)) {
    effect = 'Allow';
  }

  return {
    principalId: 'apigateway.amazonaws.com',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: event.methodArn,
        },
      ],
    },
  };
}
