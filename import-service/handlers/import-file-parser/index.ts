import { S3Event, Context } from 'aws-lambda';
import { AWSError, S3 } from 'aws-sdk';
import * as csv from 'csv-parser';

const s3Client = new S3();

export async function handler(event: S3Event, context: Context): Promise<void> {
  // Logs for debugging
  console.log('Incoming request:', JSON.stringify(event, undefined, 2));

  const s3BucketName = process.env.S3_BUCKET_NAME || '';
  const s3BucketRootFolder = process.env.S3_BUCKET_ROOT_FOLDER || '';

  try {
    // const params = {
    //   Bucket: s3BucketName,
    //   Key: `${s3BucketRootFolder}/${fileName}`, //filename
    // };
    // const s3Stream = s3.getObject(params).createReadStream();
    // s3Stream
    //     .on('data', (data) => {})
    //     .on('error', (error) => {})
    //     .on('end', () => {})
    // return {
    //   statusCode: 200,
    //   headers,
    //   body: JSON.stringify({}),
    // };
  } catch (error) {
    const { message } = error as AWSError;

    console.log('Error: ', message);

    // return {
    //   statusCode: 500,
    //   headers,
    //   body: JSON.stringify({ message }),
    // };
  }
}
