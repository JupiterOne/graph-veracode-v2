import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';

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
  do {
    const { nextUri, items } = await veracodeClient.getApplicationBatch(
      nextApplicationUri,
    );
    nextApplicationUri = nextUri;
    const jobStateUpdates: Promise<any>[] = [];
    const applicationEntities = items.map((application) =>
      createApplicationEntity(application),
    );
    jobStateUpdates.push(jobState.addEntities(applicationEntities));
    const relationships = applicationEntities.map((applicationEntity) => {
      return createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: applicationEntity,
      });
    });
    jobStateUpdates.push(jobState.addRelationships(relationships));
    await Promise.all(jobStateUpdates);
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
