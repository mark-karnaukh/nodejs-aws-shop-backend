import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { SwaggerUi } from '@pepperize/cdk-apigateway-swagger-ui';
import * as path from 'path';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class NodejsAwsShopBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'NodejsAwsShopBackendQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const api = new apigateway.RestApi(this, 'BackendShopAPI', {
      description: 'Aws NodeJs Backend Shop API',
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

    // 👇 add SwaggerUI to your AWS Apigateway RestApi
    new SwaggerUi(this, 'SwaggerUI', { resource: api.root });

    // 👇 create an Output for the API URL
    new cdk.CfnOutput(this, 'apiUrl', { value: api.url });

    // 👇 define GET products list function
    const getProductsListLambda = new lambda.Function(
      this,
      'GetProductsListLambda',
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 'index.handler',
        code: lambda.Code.fromAsset(
          path.join(__dirname, '../handlers/get-products-list')
        ),
      }
    );

    // 👇 add a /products resource
    const products = api.root.addResource('products');

    // 👇 integrate GET /products with getProductsListLambda
    products.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getProductsListLambda, { proxy: true })
    );

    // 👇 define get product by id function
    const getProductByIdLambda = new lambda.Function(
      this,
      'GetProductByIdLambda',
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 'index.handler',
        code: lambda.Code.fromAsset(
          path.join(__dirname, '../handlers/get-product-by-id')
        ),
      }
    );

    // 👇 add a /products/{productId} resource
    const product = products.addResource('{productId}');

    // 👇 integrate GET /products/{productId} with getProductByIdLambda
    product.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getProductByIdLambda)
    );
  }
}
