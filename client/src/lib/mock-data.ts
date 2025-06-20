import { type Candidate, type Interview, type ActivityItem } from "./types";

// This file contains mock data generators for development
// In production, all data comes from the API

export function generateMockActivity(): ActivityItem[] {
  return [
    {
      id: 'activity-1',
      type: 'candidate',
      candidateName: 'Sarah Johnson',
      action: 'moved to Phone Interview',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: 'activity-2',
      type: 'interview',
      action: 'Interview scheduled with Michael Chen for tomorrow at 2:00 PM',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      interviewer: 'Jane Doe',
    },
    {
      id: 'activity-3',
      type: 'sync',
      action: '15 new candidates synced from Airtable',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      count: 15,
    },
    {
      id: 'activity-4',
      type: 'candidate',
      candidateName: 'Emma Wilson',
      action: 'hired as Senior Developer',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
  ];
}

export function getPipelineData() {
  return {
    new: 42,
    screening: 38,
    interview: 24,
    hired: 12,
  };
}
