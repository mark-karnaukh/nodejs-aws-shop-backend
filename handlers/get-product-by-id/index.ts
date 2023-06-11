import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { productsList } from './data';

const dynamoDb = new DynamoDB.DocumentClient();

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  // Logs for debugging
  console.log('Incoming request:', JSON.stringify(event, undefined, 2));

  const productsTableName = process.env.PRODUCTS_TABLE_NAME || '';

  console.log('Products Table Name :', productsTableName);

  const productId = event.pathParameters?.productId;
  const product = productsList.find((product) => product.id === productId);

  if (!product) {
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,GET',
      },
      body: `404: Product ${productId} not found.`,
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,GET',
    },
    body: JSON.stringify(product),
  };
}
