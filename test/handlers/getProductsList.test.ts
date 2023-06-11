import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from '../../handlers/get-products-list';
import { productsList } from '../../mocks';
import { DynamoDB } from 'aws-sdk';

let mockDocumentClient = {
  scan: {
    promise: jest
      .fn()
      .mockImplementation(() => Promise.resolve({ Items: productsList })),
  },
};

jest.mock('aws-sdk', () => {
  return {
    DynamoDB: {
      DocumentClient: jest.fn().mockImplementation(() => {
        return {
          scan: () => mockDocumentClient.scan,
        };
      }),
    },
  };
});

describe('GetProductsList lambda handler:', () => {
  test('should return products list (Status Code: 200)', async () => {
    const result = await handler({} as APIGatewayProxyEvent, {} as Context);

    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toEqual(productsList);
  });

  test('should handle DB errors (Status Code: 500)', async () => {
    mockDocumentClient.scan.promise.mockImplementationOnce(() => {
      throw new Error('test-error');
    });

    const result = await handler({} as APIGatewayProxyEvent, {} as Context);

    expect(result.statusCode).toEqual(500);
    expect(JSON.parse(result.body)).toEqual({ message: 'test-error' });
  });
});
