import { accountSteps } from './account';
import { findingSteps } from './findings';

const integrationSteps = [...accountSteps, ...findingSteps];

export { integrationSteps };
