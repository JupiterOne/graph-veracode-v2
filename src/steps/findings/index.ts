import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';

import { IntegrationConfig } from '../../config';
import { Entities, Steps } from '../constants';

export async function fetchFindings({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const veracodeClient = createAPIClient(instance.config, logger);
  let totalFindingsProcessed = 0;
  await jobState.iterateEntities(
    { _type: Entities.APPLICATION._type },
    async (applicationEntity) => {
      let findingNextUri;
      let findingsFoundForApp = 0;
      do {
        const { nextUri, items } = await veracodeClient.getFindingsBatch(
          applicationEntity._key,
          findingNextUri,
        );
        findingNextUri = nextUri;
        for (const finding of items) {
          logger.info(finding.description); //TODO: will delete, pass type-check for now
          ++findingsFoundForApp;
        }
      } while (findingNextUri);
      logger.info(
        `${findingsFoundForApp} findings for application ${applicationEntity.displayName}`,
      );
      totalFindingsProcessed += findingsFoundForApp;
    },
  );
  logger.info(`${totalFindingsProcessed} findings found in total`);
}

export const findingSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FINDINGS,
    name: 'Fetch Findings',
    entities: [],
    relationships: [],
    dependsOn: [Steps.APPLICATIONS],
    executionHandler: fetchFindings,
  },
];
