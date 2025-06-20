import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StatsCard from "@/components/shared/stats-card";
import ActivityFeed from "@/components/shared/activity-feed";
import { 
  Users, 
  UserCheck, 
  UserCog, 
  Calendar, 
  RefreshCw, 
  UserPlus, 
  CalendarPlus, 
  BarChart3 
} from "lucide-react";
import type { DashboardStats } from "@/lib/types";
import { getPipelineData } from "@/lib/mock-data";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) throw new Error('Failed to fetch dashboard stats');
      return response.json() as Promise<DashboardStats>;
    },
  });

  const pipelineData = getPipelineData();

  const handleSync = () => {
    // TODO: Implement sync functionality
    console.log('Sync triggered');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-96" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's what's happening with your recruitment.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Candidates"
          value={stats?.totalCandidates || 0}
          change="+12%"
          trend="up"
          icon={Users}
        />
        <StatsCard
          title="Phase 1"
          value={stats?.phase1Count || 0}
          change="+8%"
          trend="up"
          icon={UserCheck}
        />
        <StatsCard
          title="Phase 2"
          value={stats?.phase2Count || 0}
          change="+4%"
          trend="up"
          icon={UserCog}
        />
        <StatsCard
          title="Interviews Today"
          value={stats?.interviewsToday || 0}
          change="2 completed"
          trend="neutral"
          icon={Calendar}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed />
            </CardContent>
          </Card>
        </div>

        {/* Sync Status & Quick Actions */}
        <div className="space-y-6">
          {/* Sync Status Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Sync Status</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    {stats?.syncStatus || 'Synced'}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Last sync: {stats?.lastSync ? new Date(stats.lastSync).toLocaleString() : 'Never'}
              </p>
              <Button onClick={handleSync} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Now
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Candidate
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarPlus className="w-4 h-4 mr-2" />
                  Schedule Interview
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pipeline Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Candidate Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {pipelineData.new}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground">New</p>
              <p className="text-xs text-muted-foreground">Applications</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {pipelineData.screening}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground">Screening</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {pipelineData.interview}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground">Interview</p>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {pipelineData.hired}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground">Hired</p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
