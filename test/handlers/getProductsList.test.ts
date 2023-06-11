import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from '../../handlers/get-products-list';
import { productsList } from '../../mocks';

describe('GetProductsList lambda handler:', () => {
  test('should return products list', async () => {
    const result = await handler({} as APIGatewayProxyEvent, {} as Context);

    expect(JSON.parse(result.body)).toEqual(productsList);
  });
});
