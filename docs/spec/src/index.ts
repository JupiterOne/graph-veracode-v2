import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../../src/config';
import { accountSpec } from './account';
import { applicationSpec } from './application';
import { findingsSpec } from './findings';

export const invocationConfig: IntegrationSpecConfig<IntegrationConfig> = {
  integrationSteps: [...accountSpec, ...applicationSpec, ...findingsSpec],
};
