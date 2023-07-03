import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export class AuthorizationServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // 👇 define basic authorizer function
    const basicAuthorizerLambda = new lambda.Function(
      this,
      'BasicAuthorizerLambda',
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        // functionName: 'basicAuthorizer',
        handler: 'index.authorizer',
        code: lambda.Code.fromAsset(
          path.join(__dirname, '../handlers/basic-authorizer/')
        ),
        environment: {
          // AUTH_GITHUB_LOGIN: process.env.AUTH_GITHUB_LOGIN as string,
          // AUTH_PASSWORD: process.env.AUTH_PASSWORD as string,
          AUTH_USER_CREDENTIALS: process.env.AUTH_USER_CREDENTIALS as string,
        },
      }
    );
  }
}
