import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Finding } from '../../types';

import { Entities } from '../constants';

// https://docs.veracode.com/r/review_severity_exploitability
const severityMap = {
  0: 'Information',
  1: 'Very Low',
  2: 'Low',
  3: 'Medium',
  4: 'High',
  5: 'Very High',
};

// https://app.swaggerhub.com/apis/Veracode/veracode-findings_api_specification/2.0#/Finding
const staticScanExploitabilityMap = {
  '-2': 'Very Unlikely',
  '-1': 'Unlikely',
  '0': 'Neutral',
  '1': 'Likely',
  '2': 'Very Likely',
};

export function createFindingEntity(veracodeFinding: Finding): Entity {
  const name = `cwe-${veracodeFinding.finding_details.cwe.id}: ${veracodeFinding.finding_details.file_name} (Line: ${veracodeFinding.finding_details.file_line_number})`;
  return createIntegrationEntity({
    entityData: {
      source: {},
      assign: {
        _type: Entities.FINDING._type,
        _class: Entities.FINDING._class,
        _key: `${veracodeFinding.context_guid}_${veracodeFinding.issue_id}`,
        name,
        displayName: name,
        cwe: `cwe-${veracodeFinding.finding_details.cwe.id}`,
        description: veracodeFinding.description,
        count: veracodeFinding.count,
        scanType: veracodeFinding.scan_type,
        category: veracodeFinding.context_type,
        foundDate: parseTimePropertyValue(
          veracodeFinding.finding_status.first_found_date,
        ),
        open: veracodeFinding.finding_status.status === 'OPEN',
        resolution: veracodeFinding.finding_status.resolution,
        resolutionStatus: veracodeFinding.finding_status.resolution_status,
        lastSeenDate: parseTimePropertyValue(
          veracodeFinding.finding_status.last_seen_date,
        ),
        numericSeverity: veracodeFinding.finding_details.severity,
        severity: severityMap[veracodeFinding.finding_details.severity],
        module: veracodeFinding.finding_details.module,
        filePath: veracodeFinding.finding_details.file_path,
        fileName: veracodeFinding.finding_details.file_name,
        fileLineNumber: veracodeFinding.finding_details.file_line_number,
        procedure: veracodeFinding.finding_details.procedure,
        exploitability: veracodeFinding.finding_details.exploitability,
        exploitabilityDescription:
          staticScanExploitabilityMap[
            `${veracodeFinding.finding_details.exploitability}`
          ],
        attackVector: veracodeFinding.finding_details.attack_vector,
        findingCategoryId: veracodeFinding.finding_details.finding_category.id,
        findingCategoryName:
          veracodeFinding.finding_details.finding_category.name,
      },
    },
  });
}
