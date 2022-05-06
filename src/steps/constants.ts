import {
  RelationshipClass,
  RelationshipDirection,
  StepEntityMetadata,
  StepMappedRelationshipMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';
import { Scans } from '../types';

export const Steps = {
  ACCOUNT: 'fetch-account',
  FINDINGS: 'fetch-findings',
  ASSESSMENTS: 'fetch-assessments',
};

export const Entities: Record<
  'ACCOUNT' | 'CWE' | 'ASSESSMENT' | 'FINDING',
  StepEntityMetadata
> = {
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
  ASSESSMENT: {
    resourceName: 'Assessment',
    _type: 'veracode_assessment',
    _class: ['Assessment'],
    schema: {
      additionalProperties: true,
      properties: {
        _type: { const: 'veracode_assessment' },
        _key: { type: 'string' },
        displayName: { type: 'string' },
        name: { type: 'string' },
        lastCompletedScanDate: { type: 'number' },
        createdOn: { type: 'number' },
        createdBy: { type: 'string' },
        updatedOn: { type: 'number' },
        updatedBy: { type: 'string' },
        category: { type: 'string' },
        summary: { type: 'string' },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
      },
      required: [],
    },
  },
  // Note: CWEs entities are to be created via `createMappedRelationship` only. Set `skipTargetCreation` to false.
  CWE: {
    resourceName: 'CWE',
    _type: 'cwe',
    _class: ['Weakness'],
    schema: {
      additionalProperties: true,
      properties: {
        _key: { type: 'string' },
        _type: { const: 'cwe' },
        description: { type: 'string' },
        displayName: { type: 'string' },
        name: { type: 'string' },
        references: { type: 'array', items: { type: 'string' }, minItems: 1 },
      },
      required: [],
    },
  },
  FINDING: {
    resourceName: 'Finding',
    _type: 'veracode_finding',
    _class: ['Finding'],
    schema: {
      additionalProperties: true,
      properties: {
        _type: { const: 'veracode_finding' },
        _key: { type: 'string' },
        name: { type: 'string' },
        displayName: { type: 'string' },
        cwe: { type: 'string' },
        description: { type: 'string' },
        count: { type: 'number' },
        scanType: { enum: Object.keys(Scans) },
        category: { type: 'string' },
        foundDate: { type: 'number' },
        open: { type: 'boolean' },
        resolution: { type: 'string' },
        resolutionStatus: { type: 'string' },
        lastSeenDate: { type: 'number' },
        numericSeverity: { type: 'number' },
        severity: { type: 'string' },
        module: { type: 'string' },
        filePath: { type: 'string' },
        fileName: { type: 'string' },
        fileLineNumber: { type: 'number' },
        procedure: { type: 'string' },
        exploitability: { type: 'number' },
        exploitabilityDescription: { type: 'string' },
        attackVector: { type: 'string' },
        findingCategoryName: { type: 'string' },
        findingCategoryId: { type: 'number' },
        createdOn: { type: 'number' },
        createdBy: { type: 'string' },
        updatedOn: { type: 'number' },
        updatedBy: { type: 'string' },
      },
      required: [],
    },
  },
};

export const MappedRelationships: Record<
  'FINDING_EXPLOITS_CWE',
  StepMappedRelationshipMetadata
> = {
  FINDING_EXPLOITS_CWE: {
    _type: 'veracode_finding_exploits_cwe',
    sourceType: Entities.FINDING._type,
    _class: RelationshipClass.EXPLOITS,
    targetType: Entities.CWE._type,
    direction: RelationshipDirection.FORWARD,
  },
};

export const Relationships: Record<
  'ACCOUNT_HAS_ASSESSMENT' | 'ASSESSMENT_IDENTIFIED_FINDING',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_ASSESSMENT: {
    _type: 'veracode_account_has_assessment',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ASSESSMENT._type,
  },
  ASSESSMENT_IDENTIFIED_FINDING: {
    _type: 'veracode_assessment_identified_finding',
    sourceType: Entities.ASSESSMENT._type,
    _class: RelationshipClass.IDENTIFIED,
    targetType: Entities.FINDING._type,
  },
};
