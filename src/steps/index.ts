import { accountSteps } from './account';
import { applicationSteps } from './application';

const integrationSteps = [...accountSteps, ...applicationSteps];

export { integrationSteps };
