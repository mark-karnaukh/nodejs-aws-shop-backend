import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { AWSError, S3 } from 'aws-sdk';

const s3Client = new S3();

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  // Logs for debugging
  console.log('Incoming request:', JSON.stringify(event, undefined, 2));

  const fileName = event.queryStringParameters?.name || '';

  const s3BucketName = process.env.S3_BUCKET_NAME || '';
  const s3BucketRootFolder = process.env.S3_BUCKET_ROOT_FOLDER || '';

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,GET',
  };

  try {
    const params = {
      Bucket: s3BucketName,
      Key: `${s3BucketRootFolder}/${fileName}`, //filename
    };

    const presignedPutURL = s3Client.getSignedUrl('putObject', {
      ...params,
      Expires: 60, //time to expire in seconds
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(presignedPutURL),
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
