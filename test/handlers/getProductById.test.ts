import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventPathParameters,
  Context,
} from 'aws-lambda';
import { handler } from '../../handlers/get-product-by-id';
import { productsList } from '../../mocks';
import { DynamoDB } from 'aws-sdk';

let mockDocumentClient = {
  query: {
    promise: jest.fn().mockImplementation(() => Promise.resolve({})),
  },
};

jest.mock('aws-sdk', () => {
  return {
    DynamoDB: {
      DocumentClient: jest.fn().mockImplementation(() => {
        return {
          query: () => mockDocumentClient.query,
        };
      }),
    },
  };
});

describe('GetProductById lambda handler:', () => {
  test('should return a specific product item (Status Code: 200)', async () => {
    const testProductId = '82f6040a-b0fe-4e29-855d-0f30e960ab96';
    const productsResult = productsList.filter(
      (product) => product.id === testProductId
    );

    // TODO: Add tests including the 'stocks' data
    mockDocumentClient.query.promise.mockImplementationOnce(() => {
      return Promise.resolve({
        Items: productsResult,
        Count: productsResult.length,
      });
    });

    const result = await handler(
      {
        pathParameters: {
          productId: testProductId,
        } as APIGatewayProxyEventPathParameters,
      } as APIGatewayProxyEvent,
      {} as Context
    );

    expect(JSON.parse(result.body)).toEqual({ ...productsList[0], count: 0 });
  });

  test('should return an error - product not found (Status Code: 404)', async () => {
    const testProductId = '12345678789';
    const productsResult = productsList.filter(
      (product) => product.id === testProductId
    );

    // TODO: Add tests including the 'stocks' data
    mockDocumentClient.query.promise.mockImplementationOnce(() => {
      return Promise.resolve({
        Items: productsResult,
        Count: productsResult.length,
      });
    });

    const result = await handler(
      {
        pathParameters: {
          productId: testProductId,
        } as APIGatewayProxyEventPathParameters,
      } as APIGatewayProxyEvent,
      {} as Context
    );

    expect(result.statusCode).toEqual(404);
    expect(result.body).toEqual(
      JSON.stringify({ message: `Product ${testProductId} not found.` })
    );
  });

  test('should handle DB errors (Status Code: 500)', async () => {
    mockDocumentClient.query.promise.mockImplementationOnce(() => {
      throw new Error('test-error');
    });

    const result = await handler({} as APIGatewayProxyEvent, {} as Context);

    expect(result.statusCode).toEqual(500);
    expect(JSON.parse(result.body)).toEqual({ message: 'test-error' });
  });
});
