import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as path from 'path';

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'ImportServiceQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

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
      'arn:aws:sqs:eu-central-1:357194777734:catalog-items-queue'
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

    // 👇 add a /import resource
    const products = api.root.addResource('import');

    // 👇 integrate GET /import with importProductsFileLambda
    products.addMethod(
      'GET',
      new apigateway.LambdaIntegration(importProductsFileLambda, {
        proxy: true,
      })
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
