import {
  IntegrationLogger,
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { randomBytes, createHmac } from 'crypto';

import got, { RequiredRetryOptions } from 'got';
import { IntegrationConfig } from './config';
import {
  Application,
  ApplicationApiResponse,
  FindingsApiResponse,
  Finding,
} from './types';

const AUTH_SCHEME = 'VERACODE-HMAC-SHA-256';
const HASH_ALGORITHM = 'sha256';
const REQUEST_VERSION = 'vcode_request_version_1';
const NONCE_SIZE = 16;

const BASE_URI_V1 = 'https://api.veracode.com/appsec/v1/';
const BASE_URI_V2 = 'https://api.veracode.com/appsec/v2/';

// https://github.com/sindresorhus/got/blob/HEAD/documentation/7-retry.md#retry-api
const gotRetryOptions: Partial<RequiredRetryOptions> = {
  limit: 3,
};

interface PaginatedResponse<T> {
  items: T[];
  nextUri?: string;
}

class VeracodeClient {
  constructor(
    readonly config: IntegrationConfig,
    readonly logger: IntegrationLogger,
  ) {}

  private currentDateStamp() {
    return Date.now().toString();
  }

  private newNonce(size) {
    return randomBytes(size);
  }

  private computeHash(data, key) {
    const hmac = createHmac(HASH_ALGORITHM, key);
    hmac.update(data);
    return hmac.digest();
  }

  private calculateDataSignature(apiKey, nonceBytes, dateStamp, data) {
    const kNonce = this.computeHash(nonceBytes, Buffer.from(apiKey, 'hex'));
    const kDate = this.computeHash(dateStamp, kNonce);
    const kSignature = this.computeHash(REQUEST_VERSION, kDate);
    return this.computeHash(data, kSignature);
  }

  private calculateAuthorizationHeader(urlString, httpMethod) {
    const { apiId, apiSecret } = this.config;
    const url = new URL(urlString);
    const hostName = url.hostname;
    const veraURL = url.pathname + url.search;
    const data = `id=${apiId}&host=${hostName}&url=${veraURL}&method=${httpMethod}`;
    const dateStamp = this.currentDateStamp();
    const nonceBytes = this.newNonce(NONCE_SIZE);
    const dataSignature = this.calculateDataSignature(
      apiSecret,
      nonceBytes,
      dateStamp,
      data,
    );
    const authorizationParam = `id=${apiId},ts=${dateStamp},nonce=${nonceBytes.toString(
      'hex',
    )},sig=${dataSignature.toString('hex')}`;
    return `${AUTH_SCHEME} ${authorizationParam}`;
  }

  // call v1 applications route and v2 findings route to ensure adequate permissions are enabled
  public async verifyAuthentication(): Promise<void> {
    const applicationsEndpoint = BASE_URI_V1 + 'applications';
    const applicationsRequest = got.get(applicationsEndpoint, {
      headers: {
        Authorization: this.calculateAuthorizationHeader(
          applicationsEndpoint,
          'GET',
        ),
      },
      retry: gotRetryOptions,
    });
    try {
      await applicationsRequest;
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: applicationsEndpoint,
        status: err.response?.statusCode,
        statusText: err.response?.statusMessage,
      });
    }
  }

  public async getApplicationBatch(
    uri: string = BASE_URI_V1 + 'applications',
  ): Promise<PaginatedResponse<Application>> {
    const applicationsRequest = got.get(uri, {
      headers: {
        Authorization: this.calculateAuthorizationHeader(uri, 'GET'),
      },
      retry: gotRetryOptions,
    });
    let response: ApplicationApiResponse;
    try {
      const result = await applicationsRequest;
      response = JSON.parse(result.body);
      return {
        items: response._embedded.applications,
        nextUri: response._links.next?.href,
      };
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: err,
        endpoint: uri,
        status: err.response?.statusCode,
        statusText: err.response?.statusMessage,
      });
    }
  }

  public async getFindingsBatch(
    applicationGuid: string,
    uri?: string,
  ): Promise<PaginatedResponse<Finding>> {
    if (!uri) {
      uri = BASE_URI_V2 + `applications/${applicationGuid}/findings`;
    }
    const findingsRequest = got.get(uri, {
      headers: {
        Authorization: this.calculateAuthorizationHeader(uri, 'GET'),
      },
      retry: gotRetryOptions,
    });
    let response: FindingsApiResponse;
    try {
      const result = await findingsRequest;
      response = JSON.parse(result.body);
      return {
        items: response._embedded?.findings || [],
        nextUri: response._links.next?.href,
      };
    } catch (err) {
      console.error(err);
      throw new IntegrationProviderAPIError({
        cause: err,
        endpoint: uri,
        status: err.response?.statusCode,
        statusText: err.response?.statusMessage,
      });
    }
  }
}

export function createAPIClient(
  config: IntegrationConfig,
  logger: IntegrationLogger,
): VeracodeClient {
  return new VeracodeClient(config, logger);
}
