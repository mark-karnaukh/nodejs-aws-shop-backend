import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import {
  Effect,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const bucket = new s3.Bucket(this, 'ImportServiceBucket', {
      // versioned: false,
      // bucketName: 'import-service-bucket',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      // 👇 Setting up CORS
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.POST,
            s3.HttpMethods.PUT,
          ],
          allowedOrigins: ['*'], // http://localhost:3000
          allowedHeaders: ['*'],
        },
      ],
    });

    const queue = sqs.Queue.fromQueueArn(
      this,
      'CatalogItemsQueue',
      process.env.CATALOG_ITEMS_QUEUE_ARN as string
    );

    const api = new apigateway.RestApi(this, 'ImportServiceAPI', {
      description: 'Import Service REST API',
      deployOptions: {
        stageName: 'dev', // Deployment stages: 'dev' or 'prod'. By default, the stageName is set to prod.
      },
      // 👇 enable CORS
      defaultCorsPreflightOptions: {
        allowHeaders: [
          ...apigateway.Cors.DEFAULT_HEADERS,
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: apigateway.Cors.ALL_METHODS, // 'OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'
        allowCredentials: true,
        allowOrigins: apigateway.Cors.ALL_ORIGINS, // 'http://localhost:3000'
      },
    });

    // 👇 create an Output for the API URL
    new cdk.CfnOutput(this, 'apiUrl', { value: api.url });

    // 👇 define import products file function
    const importProductsFileLambda = new lambda.Function(
      this,
      'ImportProductsFileLambda',
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        // functionName: 'importProductsFile',
        handler: 'index.handler',
        code: lambda.Code.fromAsset(
          path.join(__dirname, '../handlers/import-products-file/')
        ),
        environment: {
          S3_BUCKET_NAME: bucket.bucketName,
          S3_BUCKET_ROOT_FOLDER: 'uploaded',
        },
      }
    );

    bucket.grantReadWrite(importProductsFileLambda);

    // 👇 get existing basic authorizer function from resource arn
    const basicAuthorizerLambda = lambda.Function.fromFunctionArn(
      this,
      'BasicAuthorizerLambda',
      process.env.AUTHORIZER_FUNCTION_ARN as string
    );

    // 👇 create custom basic authorizer IAM role
    const authorizationRole = new Role(this, 'BasicAuthorizationRole', {
      roleName: 'LambdaAuthorizerRole',
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
      inlinePolicies: {
        allowLambdaInvocation: PolicyDocument.fromJson({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: ['lambda:InvokeFunction', 'lambda:InvokeAsync'],
              Resource: basicAuthorizerLambda.functionArn,
            },
          ],
        }),
      },
    });

    // 👇 create custom basic authorizer
    const authorizer = new apigateway.TokenAuthorizer(
      this,
      'CustomBasicAuthAuthorizer',
      {
        handler: basicAuthorizerLambda,
        identitySource: 'method.request.header.Authorization',
        assumeRole: authorizationRole,
      }
    );

    // 👇 add a /import resource
    const products = api.root.addResource('import');

    // 👇 integrate GET /import with importProductsFileLambda
    products.addMethod(
      'GET',
      new apigateway.LambdaIntegration(importProductsFileLambda, {
        proxy: true,
      }),
      { authorizer }
    );

    // 👇 define IAM policy for import file parser function
    const importFileParserPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        's3:PutObject',
        's3:GetObject',
        's3:DeleteObject',
        's3:ListBucket',
      ],
      resources: [bucket.bucketArn, `${bucket.bucketArn}/*`],
    });

    // 👇 define import file parser function
    const importFileParserLambda = new lambda.Function(
      this,
      'ImportFileParserLambda',
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        // functionName: 'importFileParser',
        handler: 'index.handler',
        code: lambda.Code.fromAsset(
          path.join(__dirname, '../handlers/import-file-parser/')
        ),
        environment: {
          S3_BUCKET_NAME: bucket.bucketName,
          S3_BUCKET_ROOT_FOLDER: 'uploaded',
          IMPORT_SQS_URL: queue.queueUrl,
        },
        memorySize: 256,
      }
    );

    importFileParserLambda.addToRolePolicy(importFileParserPolicy);
    queue.grantSendMessages(importFileParserLambda);
    // bucket.grantRead(importFileParserLambda);

    // 👇 assign notifications to be sent to the Lambda function
    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(importFileParserLambda),
      { prefix: 'uploaded/' }
    );
  }
}
