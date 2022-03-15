import { accountSteps } from './account';
import { applicationSteps } from './application';
import { findingSteps } from './findings';

const integrationSteps = [
  ...accountSteps,
  ...applicationSteps,
  ...findingSteps,
];

export { integrationSteps };
