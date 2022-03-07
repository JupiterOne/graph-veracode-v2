interface ApplicationProfile {
  name: string;
}

export interface Application {
  guid: string;
  profile: ApplicationProfile;
  last_completed_scan_date: String;
  created: String;
  Modified: String;
}

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

export interface ApplicationResponse {
  _embedded: Application[];
  _links: Links;
  page: PaginationData;
}
