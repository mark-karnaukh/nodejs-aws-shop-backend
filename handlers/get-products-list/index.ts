import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { AWSError, DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  // Logs for debugging
  console.log('Incoming request:', JSON.stringify(event, undefined, 2));

  const productsTableName = process.env.PRODUCTS_TABLE_NAME || '';

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,GET',
  };

  try {
    const results = await dynamoDb
      .scan({ TableName: productsTableName })
      .promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(results.Items),
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
