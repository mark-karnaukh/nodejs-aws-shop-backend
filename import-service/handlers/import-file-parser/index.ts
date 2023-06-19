import { S3Event, Context, S3EventRecord } from 'aws-lambda';
import { AWSError, S3 } from 'aws-sdk';
import * as csv from 'csv-parser';

const s3Client = new S3();

export async function handler(event: S3Event, context: Context): Promise<any> {
  // Logs for debugging
  console.log('Incoming request: ', JSON.stringify(event, undefined, 2));

  const {
    s3: {
      bucket: { name: bucketName },
      object: { key: filePath },
    },
  } = event.Records.at(0) as S3EventRecord;

  console.log('File Path: ', filePath);
  console.log('Bucket Name: ', bucketName);

  try {
    const params = {
      Bucket: bucketName,
      Key: filePath, //filename
    };

    const s3Stream = s3Client.getObject(params).createReadStream();

    console.log('Start reading a file: ', filePath);

    return await new Promise((resolve, reject) => {
      const results: unknown[] = [];

      s3Stream
        .pipe(csv())
        .on('data', (data) => results.push(data) && console.log(data))
        .on('error', reject)
        .on('end', () =>
          console.log(
            `File ${filePath} was parsed successfully: `,
            JSON.stringify(results, undefined, 2) && resolve(results)
          )
        );
    });
  } catch (error) {
    const { message } = error as AWSError;

    console.log('Error: ', message);
  }
}
