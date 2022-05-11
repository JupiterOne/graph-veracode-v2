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
import { createAssessmentEntity } from './converter';

export async function fetchAssessments({
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
  if (instance.config.targetVeracodeApplication) {
    // only possible using test config
    nextApplicationUri =
      BASE_URI_V1 +
      'applications?name=' +
      instance.config.targetVeracodeApplication;
  }
  do {
    const { nextUri, items } = await veracodeClient.getApplicationBatch(
      nextApplicationUri,
    );
    nextApplicationUri = nextUri;
    const assessmentEntities = items.map((application) =>
      createAssessmentEntity(application),
    );
    await jobState.addEntities(assessmentEntities);
    const relationships = assessmentEntities.map((assessmentEntity) => {
      return createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: assessmentEntity,
      });
    });
    await jobState.addRelationships(relationships);
  } while (nextApplicationUri);
}

export const assessmentSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ASSESSMENTS,
    name: 'Fetch Assessments',
    entities: [Entities.ASSESSMENT],
    relationships: [Relationships.ACCOUNT_HAS_ASSESSMENT],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchAssessments,
  },
];
