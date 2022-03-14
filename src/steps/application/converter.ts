import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { Application } from '../../types';

import { Entities } from '../constants';

export function createApplicationEntity(application: Application): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {
        ...application,
        scans: undefined,
        results_url: undefined,
        id: undefined,
      },
      assign: {
        _type: Entities.APPLICATION._type,
        _class: Entities.APPLICATION._class,
        _key: application.guid,
        name: application.profile.name,
        displayName: application.profile.name,
        lastCompletedScanDate: parseTimePropertyValue(
          application.last_completed_scan_date,
        ),
      },
    },
  });
}
