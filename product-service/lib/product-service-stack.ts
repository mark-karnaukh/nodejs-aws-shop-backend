import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { SwaggerUi } from '@pepperize/cdk-apigateway-swagger-ui';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

dotenv.config();

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'ProductServiceStack', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // 👇 create DynamoDB 'Products' table
    const productsTable = new dynamodb.Table(this, 'Products', {
      tableName: 'Products',
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      // readCapacity: 5,
      // writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'title',
        type: dynamodb.AttributeType.STRING,
      },
    });

    // 👇 create DynamoDB 'Stocks' table
    const stocksTable = new dynamodb.Table(this, 'Stocks', {
      tableName: 'Stocks',
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      // readCapacity: 5,
      // writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: 'product_id',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'count',
        type: dynamodb.AttributeType.NUMBER,
      },
    });

    // 👇 create queue
    const catalogItemsQueue = new sqs.Queue(this, 'CatalogItemsQueue', {
      queueName: 'catalog-items-queue',
    });

    // 👇 create sns topic
    const createProductTopic = new sns.Topic(this, 'CreateProductTopic', {
      topicName: 'create-product-topic',
    });

    new sns.Subscription(this, 'StockSubscription', {
      endpoint: process.env.STOCK_EMAIL as string,
      protocol: sns.SubscriptionProtocol.EMAIL,
      topic: createProductTopic,
    });

    const api = new apigateway.RestApi(this, 'ProductServiceAPI', {
      description: 'Product Service REST API',
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
        runtime: lambda.Runtime.NODEJS_16_X,
        // functionName: 'getProductsList',
        handler: 'index.handler',
        code: lambda.Code.fromAsset(
          path.join(__dirname, '../handlers/get-products-list')
        ),
        environment: {
          DYNAMODB_PRODUCTS_TABLE_NAME: productsTable.tableName,
          DYNAMODB_STOCKS_TABLE_NAME: stocksTable.tableName,
        },
      }
    );

    productsTable.grantReadData(getProductsListLambda);
    stocksTable.grantReadData(getProductsListLambda);

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
        runtime: lambda.Runtime.NODEJS_16_X,
        // functionName: 'getProductById',
        handler: 'index.handler',
        code: lambda.Code.fromAsset(
          path.join(__dirname, '../handlers/get-product-by-id')
        ),
        environment: {
          DYNAMODB_PRODUCTS_TABLE_NAME: productsTable.tableName,
          DYNAMODB_STOCKS_TABLE_NAME: stocksTable.tableName,
        },
      }
    );

    productsTable.grantReadData(getProductByIdLambda);
    stocksTable.grantReadData(getProductByIdLambda);

    // 👇 add a /products/{productId} resource
    const product = products.addResource('{productId}');

    // 👇 integrate GET /products/{productId} with getProductByIdLambda
    product.addMethod(
      'GET',
      new apigateway.LambdaIntegration(getProductByIdLambda)
    );

    // 👇 define create product function
    const createProductLambda = new lambda.Function(
      this,
      'CreateProductLambda',
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        // functionName: 'createProduct',
        handler: 'index.handler',
        code: lambda.Code.fromAsset(
          path.join(__dirname, '../handlers/create-product')
        ),
        environment: {
          DYNAMODB_PRODUCTS_TABLE_NAME: productsTable.tableName,
          DYNAMODB_STOCKS_TABLE_NAME: stocksTable.tableName,
        },
      }
    );

    productsTable.grantWriteData(createProductLambda);
    stocksTable.grantWriteData(createProductLambda);

    // 👇 define the request body schema
    const requestBodySchema = new apigateway.Model(this, 'RequestBodySchema', {
      restApi: api,
      contentType: 'application/json',
      schema: {
        type: apigateway.JsonSchemaType.OBJECT,
        properties: {
          title: { type: apigateway.JsonSchemaType.STRING },
          description: { type: apigateway.JsonSchemaType.STRING },
          price: { type: apigateway.JsonSchemaType.NUMBER },
          count: { type: apigateway.JsonSchemaType.NUMBER },
        },
        required: ['title', 'description', 'price'],
      },
    });

    // 👇 integrate POST /products with createProductLambda
    products.addMethod(
      'POST',
      new apigateway.LambdaIntegration(createProductLambda),
      {
        requestModels: {
          'application/json': requestBodySchema,
        },
        requestValidatorOptions: {
          validateRequestBody: true,
        },
      }
    );

    // 👇 define catalog batch process function
    const catalogBatchProcessLambda = new lambda.Function(
      this,
      'CatalogBatchProcessLambda',
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        // functionName: 'catalogBatchProcess',
        handler: 'index.handler',
        code: lambda.Code.fromAsset(
          path.join(__dirname, '../handlers/catalog-batch-process')
        ),
        environment: {
          DYNAMODB_PRODUCTS_TABLE_NAME: productsTable.tableName,
          DYNAMODB_STOCKS_TABLE_NAME: stocksTable.tableName,
          CREATE_PRODUCT_TOPIC_ARN: createProductTopic.topicArn,
        },
        memorySize: 256,
        timeout: cdk.Duration.seconds(5),
      }
    );

    createProductTopic.grantPublish(catalogBatchProcessLambda);
    catalogBatchProcessLambda.addEventSource(
      new SqsEventSource(catalogItemsQueue, {
        batchSize: 5,
        // maxBatchingWindow: cdk.Duration.seconds(5),
      })
    );

    productsTable.grantWriteData(catalogBatchProcessLambda);
    stocksTable.grantWriteData(catalogBatchProcessLambda);
  }
}
