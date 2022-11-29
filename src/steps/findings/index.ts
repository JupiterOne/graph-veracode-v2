import {
  createDirectRelationship,
  createMappedRelationship,
  IntegrationMissingKeyError,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  RelationshipDirection,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';

import { IntegrationConfig } from '../../config';
import { Scans } from '../../types';
import {
  Entities,
  MappedRelationships,
  Relationships,
  Steps,
} from '../constants';
import { createFindingEntity } from './converter';

export async function fetchFindings({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const veracodeClient = createAPIClient(instance.config, logger);
  let totalFindingsProcessed = 0;
  await jobState.iterateEntities(
    { _type: Entities.ASSESSMENT._type },
    async (assessmentEntity) => {
      let findingsFoundForAssessment = 0;
      const applicationKey = assessmentEntity._key.replace('assessment_', '');
      const correspondingProject = await jobState.findEntity(
        `project_${applicationKey}`,
      );
      if (!correspondingProject) {
        throw new IntegrationMissingKeyError(
          'did not find a corresponding project for the assessment with _key ' +
            assessmentEntity._key,
        );
      }
      const scanTypes = Object.values(Scans);
      const findingsPerScan = scanTypes.map((scanType) => {
        return veracodeClient.getFindingsBatch(
          applicationKey,
          scanType,
          async (finding) => {
            const findingEntity = createFindingEntity(finding);
            await jobState.addEntity(findingEntity);
            await jobState.addRelationship(
              createDirectRelationship({
                from: assessmentEntity,
                _class: RelationshipClass.IDENTIFIED,
                to: findingEntity,
              }),
            );
            await jobState.addRelationship(
              createDirectRelationship({
                from: correspondingProject,
                _class: RelationshipClass.HAS,
                to: findingEntity,
              }),
            );

            const cwe = finding.finding_details.cwe;
            await jobState.addRelationship(
              createMappedRelationship({
                source: findingEntity,
                _class: RelationshipClass.EXPLOITS,
                _type: MappedRelationships.FINDING_EXPLOITS_CWE._type,
                target: {
                  _type: Entities.CWE._type,
                  _class: Entities.CWE._class,
                  _key: `cwe-${cwe.id}`,
                  name: `CWE-${cwe.id}`,
                  displayName: `CWE-${cwe.id}`,
                  description: cwe.name,
                  references: [
                    `https://cwe.mitre.org/data/definitions/${cwe.id}.html`,
                  ],
                },
                relationshipDirection: RelationshipDirection.FORWARD,
                skipTargetCreation: false,
              }),
            );
            ++findingsFoundForAssessment;
          },
        );
      });

      await Promise.allSettled(findingsPerScan);

      logger.info(
        `${findingsFoundForAssessment} findings for assessment ${assessmentEntity.displayName}`,
      );
      totalFindingsProcessed += findingsFoundForAssessment;
    },
  );
  logger.info(`${totalFindingsProcessed} findings found in total`);
}

export const findingSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.FINDINGS,
    name: 'Fetch Findings',
    entities: [Entities.FINDING],
    relationships: [
      Relationships.ASSESSMENT_IDENTIFIED_FINDING,
      Relationships.PROJECT_HAS_FINDING,
    ],
    mappedRelationships: [MappedRelationships.FINDING_EXPLOITS_CWE],
    dependsOn: [Steps.ASSESSMENTS_PROJECTS],
    executionHandler: fetchFindings,
  },
];
