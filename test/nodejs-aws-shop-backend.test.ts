import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as NodejsAwsShopBackend from '../lib/nodejs-aws-shop-backend-stack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/nodejs-aws-shop-backend-stack.ts
// test('SQS Queue Created', () => {
//   const app = new cdk.App();
//     // WHEN
//   const stack = new NodejsAwsShopBackend.NodejsAwsShopBackendStack(app, 'MyTestStack');
//     // THEN
//   const template = Template.fromStack(stack);
//   template.hasResourceProperties('AWS::SQS::Queue', {
//     VisibilityTimeout: 300
//   });
// });

describe('Aws resource construction:', () => {
  let app: cdk.App;
  let stack: NodejsAwsShopBackend.NodejsAwsShopBackendStack;
  let template: cdk.assertions.Template;

  beforeEach(() => {
    app = new cdk.App();

    stack = new NodejsAwsShopBackend.NodejsAwsShopBackendStack(
      app,
      'MyTestStack'
    );

    template = template = Template.fromStack(stack);
  });

  test('should create lambda functions', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'index.handler',
      Runtime: 'nodejs16.x',
    });

    // template.resourceCountIs('AWS::Lambda::Function', 2);
  });

  test('should create api gateway REST API', () => {
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Description: 'Aws NodeJs Backend Shop API',
      Name: 'BackendShopAPI',
    });

    template.resourceCountIs('AWS::ApiGateway::RestApi', 1);
  });
});
