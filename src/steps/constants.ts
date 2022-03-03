import { StepEntityMetadata } from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'fetch-account',
};

export const Entities: Record<'ACCOUNT', StepEntityMetadata> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'veracode_account',
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
  },
};
