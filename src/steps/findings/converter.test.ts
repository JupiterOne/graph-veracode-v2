import { parseTimePropertyValue } from '@jupiterone/integration-sdk-core';
import { Finding } from '../../types';
import { Entities } from '../constants';
import { createFindingEntity } from './converter';

describe('#createFindingEntity', () => {
  test('should convert to entity', () => {
    const now = new Date();
    const finding: Finding = {
      annotations: [],
      build_id: 123456,
      context_guid: '1',
      context_type: 'APPLICATION',
      count: 1,
      description: 'this is a finding',
      finding_details: {
        severity: 3,
        file_path: 'foo/bar.ts',
        file_name: 'bar.ts',
        file_line_number: 154,
        procedure: 'procedure',
        exploitability: 1,
        attack_vector: 'foobar',
        relative_location: 3,
        module: 'this',
        finding_category: {
          id: 20,
          name: 'Cross-Site Scripting (XSS)',
        },
        cwe: {
          id: 80,
          name: 'Improper Neutralization of Script-Related HTML Tags in a Web Page (Basic XSS)',
          href: 'https://cwe.mitre.org/data/definitions/80.html',
        },
      },
      finding_status: {
        first_found_date: now.toString(),
        last_seen_date: now.toString(),
        mitigation_review_status: 'NONE',
        new: true,
        resolution: 'UNRESOLVED',
        resolution_status: 'NONE',
        status: 'OPEN',
      },
      grace_period_expires_date: now.toString(),
      issue_id: 4,
      scan_type: 'STATIC',
      violates_policy: true,
    };

    const entity = createFindingEntity(finding, 'myApp');
    expect(entity).toEqual(
      expect.objectContaining({
        _key: '1_4',
        _type: Entities.FINDING._type,
        _class: Entities.FINDING._class,
        displayName: 'myApp-4',
        description: finding.description,
        count: finding.count,
        scanType: finding.scan_type,
        category: finding.context_type,
        foundDate: parseTimePropertyValue(now.toString()),
        open: true,
        resolution: 'UNRESOLVED',
        resolutionStatus: 'NONE',
        lastSeenDate: parseTimePropertyValue(now.toString()),
        numericSeverity: 3,
        severity: 'Medium',
        module: finding.finding_details.module,
        filePath: finding.finding_details.file_path,
        fileName: finding.finding_details.file_name,
        fileLineNumber: finding.finding_details.file_line_number,
        procedure: finding.finding_details.procedure,
        exploitability: finding.finding_details.exploitability,
        exploitabilityDescription: 'Likely',
        attackVector: finding.finding_details.attack_vector,
        findingCategoryId: finding.finding_details.finding_category.id,
        findingCategoryName: finding.finding_details.finding_category.name,
      }),
    );
  });
});
