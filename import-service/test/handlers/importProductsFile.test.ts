import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventPathParameters,
  Context,
} from 'aws-lambda';
import { handler } from '../../handlers/import-products-file';

const signedUrlResultMock = jest.fn();

jest.mock('aws-sdk', () => {
  class mockS3 {
    getSignedUrl(operation: string, params: any) {
      return signedUrlResultMock();
    }
  }
  return {
    ...jest.requireActual('aws-sdk'),
    S3: mockS3,
  };
});

describe('GetProductById lambda handler:', () => {
  test('should return a presigned url (Status Code: 200)', async () => {
    signedUrlResultMock.mockImplementationOnce(
      () => 'some/dummy/presigned/url'
    );

    const result = await handler(
      {
        queryStringParameters: {
          name: 'some_dummy_file_name',
        } as APIGatewayProxyEventPathParameters,
      } as APIGatewayProxyEvent,
      {} as Context
    );

    expect(signedUrlResultMock).toHaveBeenCalledTimes(1);
    expect(result.statusCode).toBe(200);
    expect(result.body.includes('some/dummy/presigned/url')).toBeTruthy();
  });

  test('should return an error - no file name provided (Status Code: 400)', async () => {
    const result = await handler(
      {
        queryStringParameters: {} as APIGatewayProxyEventPathParameters,
      } as APIGatewayProxyEvent,
      {} as Context
    );

    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual(
      JSON.stringify({ message: 'File name should be provided!' })
    );
  });

  test('should handle S3 errors (Status Code: 500)', async () => {
    signedUrlResultMock.mockImplementationOnce(() => {
      throw new Error('test-error');
    });

    const result = await handler(
      {
        queryStringParameters: {
          name: 'some_dummy_file_name',
        } as APIGatewayProxyEventPathParameters,
      } as APIGatewayProxyEvent,
      {} as Context
    );

    expect(result.statusCode).toEqual(500);
    expect(JSON.parse(result.body)).toEqual({ message: 'test-error' });
  });
});
