import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from './client';

/**
 * A type describing the configuration fields required to execute the
 * integration for a specific account in the data provider.
 *
 * When executing the integration in a development environment, these values may
 * be provided in a `.env` file with environment variables. For example:
 *
 * - `VERACODE_API_ID=123` becomes `instance.config.veracodeApiId = '123'`
 * - `VERACODE_API_SECRET=abc` becomes `instance.config.veracodeApiSecret = 'abc'`
 *
 * Environment variables are NOT used when the integration is executing in a
 * managed environment. For example, in JupiterOne, users configure
 * `instance.config` in a UI.
 */
export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  veracodeApiId: {
    type: 'string',
    mask: true,
  },
  veracodeApiSecret: {
    type: 'string',
    mask: true,
  },
};

/**
 * Properties provided by the `IntegrationInstance.config`. This reflects the
 * same properties defined by `instanceConfigFields`.
 */
export interface IntegrationConfig extends IntegrationInstanceConfig {
  /**
   * The provider API client ID used to authenticate requests.
   */
  veracodeApiId: string;

  /**
   * The provider API client secret used to authenticate requests.
   */
  veracodeApiSecret: string;

  /**
   * For use in tests only. Avoid ingesting entire account's worth of applications to reduce PollyJS Recording size
   */
  targetApplication?: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (!config.veracodeApiId || !config.veracodeApiSecret) {
    throw new IntegrationValidationError(
      'Config requires all of {veracodeApiId, veracodeApiSecret}',
    );
  }

  const apiClient = createAPIClient(config, context.logger);
  await apiClient.verifyAuthentication();
}
