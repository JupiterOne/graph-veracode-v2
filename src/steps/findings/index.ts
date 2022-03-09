import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';

import { IntegrationConfig } from '../../config';
import { Steps } from '../constants';

export const ACCOUNT_ENTITY_KEY = 'entity:account';

export async function fetchFindings({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  // const accountEntity = jobState.getData(ACCOUNT_ENTITY_KEY);
  const veracodeClient = createAPIClient(instance.config, logger);
  let nextApplicationUri;
  do {
    const { nextUri, items } = await veracodeClient.getApplicationBatch(
      nextApplicationUri,
    );
    nextApplicationUri = nextUri;
    for (const application of items) {
      console.log(application);
      let findingNextUri;
      do {
        const { nextUri, items } = await veracodeClient.getFindingsBatch(
          application.guid,
          findingNextUri,
        );
        findingNextUri = nextUri;
        for (const finding of items) {
          console.log(finding);
        }
      } while (findingNextUri);
    }
  } while (nextApplicationUri);
}

export const findingSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FINDINGS,
    name: 'Fetch Findings',
    entities: [],
    relationships: [],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchFindings,
  },
];
