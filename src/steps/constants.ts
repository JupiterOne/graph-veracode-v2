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
};

export const Entities: Record<
  'ACCOUNT' | 'CWE' | 'SCAN' | 'VULNERABILITY' | 'FINDING',
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
        recommendation: { type: 'string' },
        references: { type: 'array', items: { type: 'string' } },
        remediation_effort: { type: 'number' },
        severity: { type: 'number' },
      },
      required: [],
    },
  },
  SCAN: {
    resourceName: 'Scan',
    _type: 'veracode_scan',
    _class: ['Service'],
    schema: {
      additionalProperties: true,
      properties: {
        _type: { const: 'veracode_scan' },
        _key: {
          enum: Object.keys(Scans).map(
            (scan_type) => `veracode_scan_${scan_type.toLowerCase()}`,
          ),
        },
        category: { const: 'software' },
        displayName: { enum: Object.keys(Scans) },
        name: { enum: ['DYNAMIC', 'STATIC', 'MANUAL'] },
        createdOn: { type: 'number' },
        createdBy: { type: 'string' },
        updatedOn: { type: 'number' },
        updatedBy: { type: 'string' },
      },
      required: [],
    },
  },
  VULNERABILITY: {
    resourceName: 'Vulnerability',
    _type: 'veracode_vulnerability',
    _class: ['Vulnerability'],
    schema: {
      additionalProperties: true,
      properties: {
        _type: { const: 'veracode_vulnerability' },
        _key: { type: 'string' },
        id: { type: 'string' },
        cwe: { type: 'string' },
        name: { type: 'string' },
        displayName: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
        scanType: { type: 'string' },
        numericExploitability: { type: 'number' },
        severity: { type: 'string' },
        public: { type: 'boolean' },
        createdOn: { type: 'number' },
        createdBy: { type: 'string' },
        updatedOn: { type: 'number' },
        updatedBy: { type: 'string' },
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
        targets: { type: 'string' },
        open: { type: 'boolean' },
        reopened: { type: 'boolean' },
        resolution: { type: 'string' },
        resolutionStatus: { type: 'string' },
        numericSeverity: { type: 'number' },
        severity: { type: 'string' },
        numericExploitability: { type: 'number' },
        exploitability: { type: 'string' },
        scanType: { type: 'string' },
        foundDate: { type: 'number' },
        modifiedDate: { type: 'number' },
        sourceModule: { type: 'string' },
        sourceFileName: { type: 'string' },
        sourceFileLineNumber: { type: 'string' },
        sourceFilePath: { type: 'string' },
        createdOn: { type: 'number' },
        createdBy: { type: 'string' },
        updatedOn: { type: 'number' },
        updatedBy: { type: 'string' },
      },
      required: [],
    },
  },
};

export const Relationships: Record<
  | 'ACCOUNT_HAS_SCAN'
  | 'SCAN_IDENTIFIED_VULNERABILITY'
  | 'SCAN_IDENTIFIED_FINDING'
  | 'VULNERABILITY_EXPLOITS_CWE'
  | 'FINDING_IS_VULNERABILITY',
  StepRelationshipMetadata | StepMappedRelationshipMetadata
> = {
  ACCOUNT_HAS_SCAN: {
    // Note: SCAN ≡ SERVICE from naming perspective. Had to keep consistent with legacy graph project
    _type: 'veracode_account_has_service',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.SCAN._type,
  },
  SCAN_IDENTIFIED_VULNERABILITY: {
    _type: 'veracode_scan_identified_vulnerability',
    sourceType: Entities.SCAN._type,
    _class: RelationshipClass.IDENTIFIED,
    targetType: Entities.VULNERABILITY._type,
  },
  SCAN_IDENTIFIED_FINDING: {
    _type: 'veracode_scan_identified_finding',
    sourceType: Entities.SCAN._type,
    _class: RelationshipClass.IDENTIFIED,
    targetType: Entities.FINDING._type,
  },
  // mapped relationship
  VULNERABILITY_EXPLOITS_CWE: {
    _type: 'veracode_finding_exploits_cwe',
    sourceType: Entities.VULNERABILITY._type,
    _class: RelationshipClass.EXPLOITS,
    targetType: Entities.CWE._type,
    direction: RelationshipDirection.FORWARD,
  },
  FINDING_IS_VULNERABILITY: {
    _type: 'veracode_finding_is_vulnerability',
    sourceType: Entities.FINDING._type,
    _class: RelationshipClass.IS,
    targetType: Entities.VULNERABILITY._type,
  },
};
