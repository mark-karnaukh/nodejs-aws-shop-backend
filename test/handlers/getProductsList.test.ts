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
  test('should return products list', async () => {
    const result = await handler({} as APIGatewayProxyEvent, {} as Context);

    expect(JSON.parse(result.body)).toEqual(productsList);
  });
});
