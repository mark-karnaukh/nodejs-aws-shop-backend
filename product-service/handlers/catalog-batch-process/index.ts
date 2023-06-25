import { APIGatewayProxyResult, Context, SQSEvent } from 'aws-lambda';
import { AWSError, DynamoDB, SNS } from 'aws-sdk';
import { PublishInput } from 'aws-sdk/clients/sns';
import * as crypto from 'node:crypto';

const dynamoDb = new DynamoDB.DocumentClient();
const snsClient = new SNS();

interface ProductItem {
  id: string;
  title: string;
  description: string;
  price: number;
  count?: number;
}

export async function handler(
  event: SQSEvent,
  context: Context
): Promise<void> {
  // Logs for debugging
  console.log('Incoming request:', JSON.stringify(event, undefined, 2));

  const productsTableName = process.env.DYNAMODB_PRODUCTS_TABLE_NAME || '';
  const stocksTableName = process.env.DYNAMODB_STOCKS_TABLE_NAME || '';
  const createProductTopicArn = process.env.CREATE_PRODUCT_TOPIC_ARN;

  const records = event.Records || [];

  for (const record of records) {
    try {
      const productData: ProductItem = JSON.parse(record.body);

      console.log('New Product Data: ', record.body);

      // productData.id || crypto.randomUUID();
      const id = crypto.randomUUID();

      const newProduct = {
        id,
        title: productData?.title,
        description: productData?.description,
        price: +productData?.price,
      };

      await dynamoDb
        .transactWrite({
          TransactItems: [
            {
              Put: {
                Item: newProduct,
                TableName: productsTableName,
              },
            },
            {
              Put: {
                Item: {
                  product_id: id,
                  count: +(productData?.count || 0),
                },
                TableName: stocksTableName,
              },
            },
          ],
        })
        .promise()
        .then(() => {
          const params: PublishInput = {
            Subject: 'New Products Added to Catalog',
            Message: JSON.stringify(newProduct),
            TopicArn: createProductTopicArn,
            MessageAttributes: {
              count: {
                DataType: 'Number',
                StringValue: (productData.count || 0).toString(),
              },
            },
          };

          return snsClient.publish(params, context.done).promise();
        })
        .finally(() => {
          // Debugging logs
          console.log(
            `Data: ${JSON.stringify(
              newProduct,
              null,
              2
            )} to SNS topic: ${createProductTopicArn}`
          );
        });
    } catch (error) {
      const { message } = error as AWSError;

      console.log('Error: ', message);
    }
  }
}
