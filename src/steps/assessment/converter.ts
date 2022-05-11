import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Application } from '../../types';

import { Entities } from '../constants';

export function createAssessmentEntity(
  veracodeApplication: Application,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {
        ...veracodeApplication,
        scans: undefined,
        results_url: undefined,
        id: undefined,
      },
      assign: {
        _type: Entities.ASSESSMENT._type,
        _class: Entities.ASSESSMENT._class,
        _key: veracodeApplication.guid,
        name: veracodeApplication.profile.name,
        displayName: veracodeApplication.profile.name,
        lastCompletedScanDate: parseTimePropertyValue(
          veracodeApplication.last_completed_scan_date,
        ),
        category: 'Vulnerability Scan',
        summary: `Veracode Application with name ${veracodeApplication.profile.name}`,
        internal: true,
      },
    },
  });
}
