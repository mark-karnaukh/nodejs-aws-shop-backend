import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventPathParameters,
  Context,
} from 'aws-lambda';
import { handler } from '../../handlers/get-product-by-id';
import { productsList } from '../../mocks';

describe('GetProductById lambda handler:', () => {
  test('should return a specific product item', async () => {
    const testProductId = '82f6040a-b0fe-4e29-855d-0f30e960ab96';

    const result = await handler(
      {
        pathParameters: {
          productId: testProductId,
        } as APIGatewayProxyEventPathParameters,
      } as APIGatewayProxyEvent,
      {} as Context
    );

    expect(JSON.parse(result.body)).toEqual(productsList[0]);
  });

  test('should return a 404 error (product not found)', async () => {
    const testProductId = '12345678789';

    const result = await handler(
      {
        pathParameters: {
          productId: testProductId,
        } as APIGatewayProxyEventPathParameters,
      } as APIGatewayProxyEvent,
      {} as Context
    );

    expect(result.statusCode).toEqual(404);
    expect(result.body).toEqual(`404: Product ${testProductId} not found.`);
  });
});
