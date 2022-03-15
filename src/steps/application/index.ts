import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { BASE_URI_V1, createAPIClient } from '../../client';

import { IntegrationConfig } from '../../config';
import { ACCOUNT_ENTITY_KEY } from '../account';
import { Entities, Relationships, Steps } from '../constants';
import { createApplicationEntity } from './converter';

export async function fetchApplications({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const accountEntityKey = (await jobState.getData(
    ACCOUNT_ENTITY_KEY,
  )) as string;
  const accountEntity = (await jobState.findEntity(accountEntityKey)) as Entity;
  const veracodeClient = createAPIClient(instance.config, logger);
  let nextApplicationUri;
  if (instance.config.targetApplication) {
    // only possible using test config
    nextApplicationUri =
      BASE_URI_V1 + 'applications?name=' + instance.config.targetApplication;
  }
  do {
    const { nextUri, items } = await veracodeClient.getApplicationBatch(
      nextApplicationUri,
    );
    nextApplicationUri = nextUri;
    const applicationEntities = items.map((application) =>
      createApplicationEntity(application),
    );
    await jobState.addEntities(applicationEntities);
    const relationships = applicationEntities.map((applicationEntity) => {
      return createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: applicationEntity,
      });
    });
    await jobState.addRelationships(relationships);
  } while (nextApplicationUri);
}

export const applicationSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.APPLICATIONS,
    name: 'Fetch Applications',
    entities: [Entities.APPLICATION],
    relationships: [Relationships.ACCOUNT_HAS_APPLICATION],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchApplications,
  },
];
