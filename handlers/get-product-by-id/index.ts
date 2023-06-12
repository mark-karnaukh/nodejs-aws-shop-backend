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
  const stocksTableName = process.env.DYNAMODB_STOCKS_TABLE_NAME || '';

  const productId = event.pathParameters?.productId;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,GET',
  };

  try {
    const [productsQueryResults, stocksQueryResults] = await Promise.all([
      dynamoDb
        .query({
          TableName: productsTableName,
          KeyConditionExpression: 'id = :productId',
          ExpressionAttributeValues: {
            ':productId': productId,
          },
        })
        .promise(),
      dynamoDb
        .query({
          TableName: stocksTableName,
          KeyConditionExpression: 'product_id = :productId',
          ExpressionAttributeValues: {
            ':productId': productId,
          },
        })
        .promise(),
    ]);

    if (!productsQueryResults.Count) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          message: `Product ${productId} not found.`,
        }),
      };
    }

    const results = {
      ...productsQueryResults.Items?.at(0),
      count: stocksQueryResults.Items?.at(0)?.count || 0,
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(results),
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
