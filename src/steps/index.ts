import { accountSteps } from './account';
import { assessmentSteps } from './assessment_projects';
import { findingSteps } from './findings';

const integrationSteps = [...accountSteps, ...assessmentSteps, ...findingSteps];

export { integrationSteps };
