import { Context, SQSEvent } from 'aws-lambda';
import { handler } from '../../handlers/catalog-batch-process';
import { mockedSQSEvent } from '../../mocks';

let mockDocumentClient = {
  transactWrite: {
    promise: jest.fn().mockImplementation(() => Promise.resolve({})),
  },
};

let mockSNSClient = {
  publish: {
    promise: jest.fn().mockImplementation(() => Promise.resolve({})),
  },
};

jest.mock('aws-sdk', () => {
  return {
    ...jest.requireActual('aws-sdk'),

    SNS: jest.fn().mockImplementation(() => {
      return {
        publish: () => mockSNSClient.publish,
      };
    }),

    DynamoDB: {
      DocumentClient: jest.fn().mockImplementation(() => {
        return {
          transactWrite: () => mockDocumentClient.transactWrite,
        };
      }),
    },
  };
});

describe('CatalogBatchProcess lambda handler:', () => {
  test('should create product items and publish a SNS notifications', async () => {
    await handler(mockedSQSEvent as SQSEvent, {} as Context);

    // Create a specific amount of product items (num of event records)
    expect(mockDocumentClient.transactWrite.promise).toHaveBeenCalledTimes(
      mockedSQSEvent.Records.length
    );

    // Publish a specific a number of SNS notifications (num of event records)
    expect(mockSNSClient.publish.promise).toHaveBeenCalledTimes(
      mockedSQSEvent.Records.length
    );
  });
});
