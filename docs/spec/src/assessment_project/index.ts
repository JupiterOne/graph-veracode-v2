import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const assessmentSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Singleton
     */
    id: 'fetch-assessments-and-projects',
    name: 'Fetch Assessments and Projects',
    entities: [
      {
        resourceName: 'Assessment',
        _type: 'veracode_assessment',
        _class: ['Assessment'],
      },
      {
        resourceName: 'Project',
        _type: 'veracode_project',
        _class: ['Project'],
      },
    ],
    relationships: [
      {
        _type: 'veracode_account_has_project',
        sourceType: 'veracode_account',
        _class: RelationshipClass.HAS,
        targetType: 'veracode_project',
      },
      {
        _type: 'veracode_project_has_assessment',
        sourceType: 'veracode_project',
        _class: RelationshipClass.HAS,
        targetType: 'veracode_assessment',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
