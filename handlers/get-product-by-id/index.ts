import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { DynamoDB, AWSError } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  // Logs for debugging
  console.log('Incoming request:', JSON.stringify(event, undefined, 2));

  const productsTableName = process.env.DYNAMODB_PRODUCTS_TABLE_NAME || '';
  const productId = event.pathParameters?.productId;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,GET',
  };

  try {
    const queryResults = await dynamoDb
      .query({
        TableName: productsTableName,
        KeyConditionExpression: 'id = :productId',
        ExpressionAttributeValues: {
          ':productId': productId,
        },
      })
      .promise();

    if (!queryResults.Count) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          message: `Product ${productId} not found.`,
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(queryResults.Items?.at(0)),
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
