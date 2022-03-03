import { IntegrationInstance } from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';
import { createAccountEntity } from './converter';

describe('#createAccountEntity', () => {
  test('should convert to entity', () => {
    const integrationInstance: IntegrationInstance = {
      id: 'my id',
      accountId: 'my account id',
      name: 'me',
      integrationDefinitionId: 'definition id',
      config: {
        something: 'special',
      },
    };

    const entity = createAccountEntity(integrationInstance);
    expect(entity).toEqual(
      expect.objectContaining({
        _key: integrationInstance.id,
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        name: integrationInstance.name,
        displayName: integrationInstance.name,
      }),
    );
  });
});
