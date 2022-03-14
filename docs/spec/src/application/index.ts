import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const applicationSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Singleton
     */
    id: 'fetch-applications',
    name: 'Fetch Applications',
    entities: [
      {
        resourceName: 'Application',
        _type: 'veracode_application',
        _class: ['Application'],
      },
    ],
    relationships: [
      {
        _type: 'veracode_account_has_application',
        sourceType: 'veracode_account',
        _class: RelationshipClass.HAS,
        targetType: 'veracode_application',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
