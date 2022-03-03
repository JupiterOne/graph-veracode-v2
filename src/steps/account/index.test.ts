import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';
import { fetchAccountDetails } from '.';
import { integrationConfig } from '../../../test/config';

describe('#fetchAccountDetails', () => {
  test('should collect data', async () => {
    const context = createMockStepExecutionContext({
      instanceConfig: integrationConfig,
    });
    await fetchAccountDetails(context);

    expect(context.jobState.collectedEntities?.length).toEqual(1);
    expect(context.jobState.collectedEntities).toMatchGraphObjectSchema({
      _class: ['Account'],
      schema: {
        additionalProperties: true,
        properties: {
          _type: { const: 'veracode_account' },
          _key: { type: 'string' },
          name: { type: 'string' },
          displayName: { type: 'string' },
          createdOn: { type: 'number' },
          createdBy: { type: 'string' },
          updatedOn: { type: 'number' },
          updatedBy: { type: 'string' },
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
        },
        required: [],
      },
    });
  });
});
