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
  describe('#fetchAssessments', () => {
    test('creates assessment entities', async () => {
      recording = setupProjectRecording({
        directory: __dirname,
        name: 'fetchAssessmentsShouldCollectData',
      });

      const stepConfig = buildStepTestConfigForStep(Steps.ASSESSMENTS);
      const stepResult = await executeStepWithDependencies(stepConfig);
      expect(stepResult.collectedEntities.length).toBe(1);
      expect(stepResult.collectedRelationships.length).toBe(1);
      expect(stepResult).toMatchStepMetadata(stepConfig);
    });
  });
});
