export type { 
  Candidate, 
  Interview, 
  DashboardStats,
  CandidateStatus,
  CandidateSource,
  InterviewType,
  InterviewStatus
} from "@shared/schema";

export interface ActivityItem {
  id: string;
  type: 'candidate' | 'interview' | 'sync';
  candidateName?: string;
  action: string;
  timestamp: Date | string;
  interviewer?: string;
  count?: number;
}

export interface FilterState {
  search?: string;
  status?: string;
  source?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface ViewState {
  type: 'table' | 'kanban';
  selectedIds: string[];
}
