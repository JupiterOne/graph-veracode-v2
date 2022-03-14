import { parseTimePropertyValue } from '@jupiterone/integration-sdk-core';
import { Application } from '../../types';
import { Entities } from '../constants';
import { createApplicationEntity } from './converter';

describe('#createAccountEntity', () => {
  test('should convert to entity', () => {
    const now = new Date();
    const application: Application = {
      guid: 'guid',
      profile: { name: 'myApp' },
      last_completed_scan_date: now.toString(),
      created: 'yes',
      modified: 'yes',
      results_url: 'noneofyobizness.com',
      scans: [],
    };

    const entity = createApplicationEntity(application);
    expect(entity).toEqual(
      expect.objectContaining({
        _key: application.guid,
        _type: Entities.APPLICATION._type,
        _class: Entities.APPLICATION._class,
        name: application.profile.name,
        displayName: application.profile.name,
        lastCompletedScanDate: parseTimePropertyValue(
          application.last_completed_scan_date,
        ),
      }),
    );
  });
});
