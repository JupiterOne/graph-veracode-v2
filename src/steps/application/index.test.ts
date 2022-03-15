import {
  executeStepWithDependencies,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

describe('applicationSteps', () => {
  let recording: Recording;
  afterEach(async () => {
    await recording.stop();
  });
  describe('#fetchApplications', () => {
    test('creates application entities', async () => {
      recording = setupProjectRecording({
        directory: __dirname,
        name: 'fetchApplicationsShouldCollectData',
      });

      const stepConfig = buildStepTestConfigForStep(Steps.APPLICATIONS);
      const stepResult = await executeStepWithDependencies(stepConfig);
      expect(stepResult.collectedEntities.length).toBe(1);
      expect(stepResult.collectedRelationships.length).toBe(1);
      expect(stepResult).toMatchStepMetadata(stepConfig);
    });
  });
});
