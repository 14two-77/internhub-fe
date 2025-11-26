interface Tag {
  tagId: number;
  tagName: string;
}

interface Company {
  companyId: number;
  companyNameTh: string;
  companyNameEn: string;
  logoUrl: string;
  website: string;
  facebook: string;
  line: string;
}

interface CompensationType {
  compensationTypeId: number;
  compensationType: string;
}

interface JobItem {
  openingId: number;
  sessionId: number;
  company: Company;
  title: string;
  description: string;
  quota: number;
  openForCooperativeInternship: boolean;
  compensationAmount: number | null;
  compensationType: CompensationType | null;
  workingCondition: string | null;
  requirements: string | null;
  tags: Tag[];
  officeName: string;
  officeAddressLine1: string;
  officeAddressLine2: string;
  recruitmentContactChannel: string;
  openingDetailContactChannel: string;
  startDate: string | null;
  endDate: string | null;
  isPublished: boolean;
  isAcceptingApplication: boolean;
  inStudentDraftCount: number;
  isBookmarked: boolean;
}

interface Meta {
  totalItem: number;
  itemCount: number;
  itemsPerPage: number;
  totalPage: number;
  currentPage: number;
}

interface DataResponse {
  items: JobItem[];
  meta: Meta;
}

export type { Tag, Company, CompensationType, JobItem, Meta, DataResponse };
