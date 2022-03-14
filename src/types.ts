// Applications
interface ApplicationProfile {
  name: string;
}

interface ApplicationScan {
  internal_status: string;
  modified_date: string;
  scan_type: string;
  scan_url: string;
}

export interface Application {
  guid: string;
  profile: ApplicationProfile;
  last_completed_scan_date: string;
  created: string;
  modified: string;
  results_url: string;
  scans: ApplicationScan[];
}

// Scans
export enum Scans {
  DYNAMIC,
  MANUAL,
  STATIC,
}

// Findings

interface CWEReference {
  name: string;
  url: string;
}

export interface CWE {
  description: string;
  id: number;
  name: string;
  recommendation: string;
  references: CWEReference[];
  remediation_effort: number;
  severity: number;
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

export interface Finding {
  annotations: Annotation[];
  build_id: number;
  context_guid: string;
  context_type: string;
  count: number;
  description: string;
  finding_details: CWE;
  finding_status: FindingStatus;
  grace_period_expires_date: string;
  issue_id: number;
  scan_type: Scans;
  violates_policy: boolean;
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
