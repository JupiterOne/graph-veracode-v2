import {
  createIntegrationEntity,
  Entity,
  IntegrationInstance,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function createAccountEntity(instance: IntegrationInstance): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {
        ...instance,
        integrationDefinitionId: undefined,
        config: undefined,
      },
      assign: {
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        _key: instance.id,
        name: instance.name,
        displayName: instance.name,
      },
    },
  });
}
