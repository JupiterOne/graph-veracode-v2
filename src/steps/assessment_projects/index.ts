import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  Relationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { BASE_URI_V1, createAPIClient } from '../../client';

import { IntegrationConfig } from '../../config';
import { ACCOUNT_ENTITY_KEY } from '../account';
import { Entities, Relationships, Steps } from '../constants';
import { createAssessmentEntity, createProjectEntity } from './converter';

export async function fetchAssessmentsAndProjects({
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
    const assessmentEntities: Entity[] = [];
    const projectEntities: Entity[] = [];
    const relationships: Relationship[] = [];
    items.forEach((application) => {
      const assessment = createAssessmentEntity(application);
      const project = createProjectEntity(application);
      assessmentEntities.push(assessment);
      projectEntities.push(project);
      relationships.push(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: accountEntity,
          to: project,
        }),
      );
      relationships.push(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: project,
          to: assessment,
        }),
      );
    });
    await jobState.addEntities(assessmentEntities);
    await jobState.addEntities(projectEntities);
    await jobState.addRelationships(relationships);
  } while (nextApplicationUri);
}

export const assessmentSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ASSESSMENTS_PROJECTS,
    name: 'Fetch Assessments and Projects',
    entities: [Entities.ASSESSMENT, Entities.PROJECT],
    relationships: [
      Relationships.ACCOUNT_HAS_PROJECT,
      Relationships.PROJECT_HAS_ASSESSMENT,
    ],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchAssessmentsAndProjects,
  },
];
