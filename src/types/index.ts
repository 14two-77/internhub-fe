export interface Tag {
  tagId: number;
  tagName: string;
}

export interface Company {
  companyId: number;
  companyNameTh: string;
  companyNameEn: string;
  logoUrl: string | null;
  website: string | null;
  facebook: string | null;
  line: string | null;
}

export interface CompensationType {
  compensationTypeId: number;
  compensationType: string;
}

export interface JobOpening {
  openingId: number;
  sessionId: number;
  company: Company;
  title: string;
  description: string | null;
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

export type SelectionStatus =
  | "interested"
  | "not_interested"
  | "applied"
  | "interviewing"
  | "got_offer"
  | null;

export interface SelectionState {
  selections: Record<number, SelectionStatus>;
  setStatus: (openingId: number, status: SelectionStatus) => void;
  getStatus: (openingId: number) => SelectionStatus;
}

export interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
}
