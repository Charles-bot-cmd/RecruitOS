import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getRelativeTime } from "@/lib/utils";
import { UserPlus, CalendarPlus, Upload, CheckCircle } from "lucide-react";
import type { ActivityItem } from "@/lib/types";

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'candidate':
      return UserPlus;
    case 'interview':
      return CalendarPlus;
    case 'sync':
      return Upload;
    default:
      return CheckCircle;
  }
};

const getActivityIconColor = (type: string) => {
  switch (type) {
    case 'candidate':
      return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400';
    case 'interview':
      return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
    case 'sync':
      return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400';
    default:
      return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400';
  }
};

export default function ActivityFeed() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['/api/activity'],
    queryFn: async () => {
      const response = await fetch('/api/activity');
      if (!response.ok) throw new Error('Failed to fetch activity');
      return response.json() as Promise<ActivityItem[]>;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start space-x-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No recent activity to display
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = getActivityIcon(activity.type);
        const iconColor = getActivityIconColor(activity.type);
        
        return (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${iconColor}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">
                {activity.candidateName && (
                  <span className="font-medium">{activity.candidateName} </span>
                )}
                {activity.action}
                {activity.count && (
                  <span className="font-medium"> {activity.count}</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {getRelativeTime(activity.timestamp)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
