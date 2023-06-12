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

  const productsTableName = process.env.DYNAMODB_PRODUCTS_TABLE_NAME || '';
  const stocksTableName = process.env.DYNAMODB_STOCKS_TABLE_NAME || '';

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,GET',
  };

  try {
    const [productsScanResults, stocksScanResults] = await Promise.all([
      dynamoDb.scan({ TableName: productsTableName }).promise(),
      dynamoDb.scan({ TableName: stocksTableName }).promise(),
    ]);

    const results = productsScanResults.Items?.map((product) => {
      const stockData = stocksScanResults.Items?.find(
        (stockItem) => stockItem.product_id === product.id
      );

      return {
        ...product,
        count: stockData?.count || 0,
      };
    });

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
