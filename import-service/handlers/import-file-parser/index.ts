import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { AWSError, S3 } from 'aws-sdk';
const csv = require('csv-parser');

const s3Client = new S3();

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  // Logs for debugging
  console.log('Incoming request:', JSON.stringify(event, undefined, 2));

  //   const s3BucketName = process.env.S3_BUCKET_NAME || '';
  //   const s3BucketRootFolder = process.env.S3_BUCKET_ROOT_FOLDER || '';

  const headers = {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,GET',
  };

  try {
    // const params = {
    //     Bucket: BUCKET,
    //     Prefix: 'uploaded',
    //     Delimeter: '/'
    // }

    // const params = {
    //     Bucket: 'node-in-aws-cloud-catalogs',
    //     Key: 'uploaded/catalogs.csv'
    // }

    // const s3Stream = s3.getObject(params).createReadStream();

    // s3Stream
    //     .on('data', (data) => {})
    //     .on('error', (error) => {})
    //     .on('end', () => {})

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({}),
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
