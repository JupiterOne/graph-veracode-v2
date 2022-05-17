import {
  executeStepWithDependencies,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

describe('assessmentSteps', () => {
  let recording: Recording;
  afterEach(async () => {
    await recording.stop();
  });
  describe('#fetchAssessmentsAndProjects', () => {
    test('creates assessment and project entities', async () => {
      recording = setupProjectRecording({
        directory: __dirname,
        name: 'fetchAssessmentsShouldCollectData',
      });

      const stepConfig = buildStepTestConfigForStep(Steps.ASSESSMENTS_PROJECTS);
      const stepResult = await executeStepWithDependencies(stepConfig);
      expect(stepResult.collectedEntities.length).toBe(2);
      expect(stepResult.collectedRelationships.length).toBe(2);
      expect(stepResult).toMatchStepMetadata(stepConfig);
    });
  });
});
