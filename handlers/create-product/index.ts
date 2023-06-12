import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { AWSError, DynamoDB } from 'aws-sdk';
import * as crypto from 'node:crypto';

const dynamoDb = new DynamoDB.DocumentClient();

interface RequestBody {
  title: string;
  description: string;
  price: number;
  count?: number;
}

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  // Logs for debugging
  console.log('Incoming request:', JSON.stringify(event, undefined, 2));

  const productsTableName = process.env.DYNAMODB_PRODUCTS_TABLE_NAME || '';
  const stocksTableName = process.env.DYNAMODB_STOCKS_TABLE_NAME || '';

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,POST',
  };

  try {
    const id = crypto.randomUUID();
    const parsedBody = JSON.parse(event?.body || '{}');

    await dynamoDb
      .transactWrite({
        TransactItems: [
          {
            Put: {
              Item: {
                id,
                title: parsedBody?.title,
                description: parsedBody?.description,
                price: parsedBody?.price,
              },
              TableName: productsTableName,
            },
          },
          {
            Put: {
              Item: {
                product_id: id,
                count: parsedBody?.count || 0,
              },
              TableName: stocksTableName,
            },
          },
        ],
      })
      .promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ...parsedBody, id }),
    };
  } catch (error) {
    const { message } = error as AWSError;

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message }),
    };
  }
}
