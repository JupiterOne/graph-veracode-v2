import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Steps } from '../constants';

describe('#fetchAccountDetails', () => {
  test('should collect data', async () => {
    const stepConfig = buildStepTestConfigForStep(Steps.ACCOUNT);
    await expect(
      executeStepWithDependencies(stepConfig),
    ).resolves.toMatchStepMetadata(stepConfig);
  });
});
