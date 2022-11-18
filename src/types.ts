// Assessments & Projects (derived by hitting the Applications endpoint for veracode api)
interface ApplicationProfile {
  name: string;
}

interface ApplicationScan {
  internal_status: string;
  modified_date: string;
  scan_type: string;
  scan_url: string;
}

// Application from veracode api.
// This is used to derive a Project and Assessment Enitity in our data model.
export interface Application {
  guid: string;
  profile: ApplicationProfile;
  last_completed_scan_date: string;
  created: string;
  modified: string;
  results_url: string;
  scans: ApplicationScan[];
}

// Findings

interface CWE {
  id: number;
  name: string;
  href: string;
}

interface Annotation {
  action: string;
  comment: string;
  created: string;
  remaining_risk: string;
  specifics: string;
  technique: string;
  user_name: string;
  verification: string;
}

interface FindingStatus {
  first_found_date: string;
  last_seen_date: string;
  mitigation_review_status: string;
  new: boolean;
  resolution: string;
  resolution_status: string;
  status: string;
}

interface FindingCategory {
  id: number;
  name: string;
}

// TODO: address variance in findingDetails based on scan type
// https://app.swaggerhub.com/apis/Veracode/veracode-findings_api_specification/2.0#/Finding
interface FindingDetails {
  severity: number;
  file_path: string;
  file_name: string;
  module: string;
  relative_location: number;
  procedure: string;
  exploitability: number;
  attack_vector: string;
  file_line_number: number;
  cwe: CWE;
  finding_category: FindingCategory;
}

export interface Finding {
  annotations: Annotation[];
  build_id: number;
  context_guid: string;
  context_type: string;
  count: number;
  description: string;
  finding_details: FindingDetails;
  finding_status: FindingStatus;
  grace_period_expires_date: string;
  issue_id: number;
  scan_type: string;
  // not applicable for SCA
  violates_policy: boolean;
}

// TODO: get test data for Manual before officially supporting
export enum Scans {
  STATIC = 'STATIC',
  DYNAMIC = 'DYNAMIC',
  SCA = 'SCA',
  // MANUAL = 'MANUAL',
}

// common Api Response types
interface LinkContents {
  href: string;
  templated?: boolean;
}

interface Links {
  self: LinkContents;
  prev?: LinkContents;
  first: LinkContents;
  last: LinkContents;
  next?: LinkContents;
}

interface PaginationData {
  size: number;
  total_elements: number;
  total_pages: number;
  number: number;
}

export interface ApplicationApiResponse {
  _embedded: { applications: Application[] };
  _links: Links;
  page: PaginationData;
}

export interface FindingsApiResponse {
  _embedded: { findings: Finding[] };
  _links: Links;
  page: PaginationData;
}
