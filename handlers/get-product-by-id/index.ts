import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { productsList } from './data';

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  console.log('request:', JSON.stringify(event, undefined, 2));

  const productId = event.pathParameters?.productId;
  const product = productsList.find((product) => product.id === productId);

  if (!product) {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'text/plain' },
      body: `404: Product ${productId} not found.`,
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  };
}
