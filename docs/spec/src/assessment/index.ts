import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const assessmentSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Singleton
     */
    id: 'fetch-assessments',
    name: 'Fetch Assessments',
    entities: [
      {
        resourceName: 'Assessment',
        _type: 'veracode_assessment',
        _class: ['Assessment'],
      },
    ],
    relationships: [
      {
        _type: 'veracode_account_has_assessment',
        sourceType: 'veracode_account',
        _class: RelationshipClass.HAS,
        targetType: 'veracode_assessment',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
