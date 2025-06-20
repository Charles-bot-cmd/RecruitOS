import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  CalendarPlus, 
  Video, 
  Phone, 
  Users, 
  MapPin,
  ExternalLink,
  Star 
} from "lucide-react";
import { useInterviews } from "@/hooks/use-interviews";
import { formatTime, formatDate, getInitials } from "@/lib/utils";
import StatusBadge from "@/components/shared/status-badge";

export default function Interviews() {
  const { data: allInterviews = [], isLoading } = useInterviews();

  // Get today's interviews
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaysInterviews = allInterviews.filter(interview => {
    const interviewDate = new Date(interview.scheduledDate);
    return interviewDate >= today && interviewDate < tomorrow;
  });

  const upcomingInterviews = allInterviews
    .filter(interview => {
      const interviewDate = new Date(interview.scheduledDate);
      return interviewDate >= tomorrow;
    })
    .slice(0, 5);

  const completedInterviews = allInterviews
    .filter(interview => interview.status === 'Completed')
    .slice(0, 10);

  const getInterviewIcon = (type: string) => {
    switch (type) {
      case 'Video':
        return Video;
      case 'Phone':
        return Phone;
      case 'In-Person':
        return MapPin;
      case 'Technical':
        return Users;
      default:
        return Video;
    }
  };

  const getInterviewIconColor = (type: string) => {
    switch (type) {
      case 'Video':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
      case 'Phone':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400';
      case 'In-Person':
        return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400';
      case 'Technical':
        return 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400';
      default:
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Interviews</h1>
          <p className="text-muted-foreground mt-2">Loading interviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Interviews</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track candidate interviews
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button>
            <CalendarPlus className="w-4 h-4 mr-2" />
            Schedule Interview
          </Button>
        </div>
      </div>

      {/* Interview Calendar/Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Interviews */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Today's Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaysInterviews.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No interviews scheduled for today
                  </div>
                ) : (
                  todaysInterviews.map((interview) => {
                    const Icon = getInterviewIcon(interview.type);
                    const iconColor = getInterviewIconColor(interview.type);
                    
                    return (
                      <div key={interview.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconColor}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              Candidate #{interview.candidateId}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {interview.type} Interview - {interview.duration} minutes
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatTime(interview.scheduledDate)} with {interview.interviewer}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={interview.status === 'Completed' ? 'default' : 'secondary'}
                          >
                            {interview.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Interviews */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingInterviews.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No upcoming interviews
                  </div>
                ) : (
                  upcomingInterviews.map((interview) => (
                    <div key={interview.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          Candidate #{interview.candidateId}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(interview.scheduledDate)}, {formatTime(interview.scheduledDate)}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {interview.type}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Interview History */}
      <Card>
        <CardHeader>
          <CardTitle>Interview History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Candidate</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Interviewer</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Rating</th>
                </tr>
              </thead>
              <tbody>
                {completedInterviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      No completed interviews yet
                    </td>
                  </tr>
                ) : (
                  completedInterviews.map((interview) => (
                    <tr key={interview.id} className="border-b hover:bg-muted/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-muted text-xs">
                              C{interview.candidateId}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">
                            Candidate #{interview.candidateId}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-foreground">{interview.type}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-muted-foreground">
                          {formatDate(interview.scheduledDate)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-foreground">{interview.interviewer}</span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="default">
                          {interview.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        {interview.rating ? (
                          <div className="flex items-center space-x-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < interview.rating!
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-muted-foreground ml-2">
                              {interview.rating}.0
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
