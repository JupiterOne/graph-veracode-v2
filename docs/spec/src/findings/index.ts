import {
  RelationshipClass,
  RelationshipDirection,
  StepSpec,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const findingsSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Singleton
     */
    id: 'fetch-findings',
    name: 'Fetch Findings',
    entities: [
      {
        resourceName: 'Finding',
        _type: 'veracode_finding',
        _class: ['Finding'],
      },
    ],
    mappedRelationships: [
      {
        _type: 'veracode_finding_exploits_cwe',
        sourceType: 'veracode_finding',
        _class: RelationshipClass.EXPLOITS,
        targetType: 'cwe',
        direction: RelationshipDirection.FORWARD,
      },
    ],
    relationships: [
      {
        _type: 'veracode_application_identified_finding',
        sourceType: 'veracode_application',
        _class: RelationshipClass.IDENTIFIED,
        targetType: 'veracode_finding',
      },
    ],
    dependsOn: ['fetch-applications'],
    implemented: true,
  },
];
