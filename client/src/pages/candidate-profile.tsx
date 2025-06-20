import { useState } from "react";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  LinkedinIcon, 
  FileText, 
  Edit, 
  MessageSquare,
  Clock,
  Star,
  User,
  Briefcase,
  GraduationCap,
  CalendarPlus
} from "lucide-react";
import { useCandidate } from "@/hooks/use-candidates";
import { useInterviews } from "@/hooks/use-interviews";
import { formatDate, formatDateTime, getInitials } from "@/lib/utils";
import StatusBadge from "@/components/shared/status-badge";
import CandidateModal from "@/components/modals/candidate-modal";
import type { Candidate } from "@/lib/types";

export default function CandidateProfile() {
  const { id } = useParams();
  const candidateId = parseInt(id as string);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newNote, setNewNote] = useState("");

  const { data: candidate, isLoading } = useCandidate(candidateId);
  const { data: interviews = [] } = useInterviews(candidateId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span>Loading candidate profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-foreground mb-2">Candidate Not Found</h2>
          <p className="text-muted-foreground">
            The candidate you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const completedInterviews = interviews.filter(interview => interview.status === 'Completed');
  const upcomingInterviews = interviews.filter(interview => interview.status === 'Scheduled');

  const handleSaveNote = () => {
    if (newNote.trim()) {
      // TODO: Implement note saving
      console.log("Saving note:", newNote);
      setNewNote("");
    }
  };

  const handleScheduleInterview = () => {
    // TODO: Implement interview scheduling
    console.log("Schedule interview for candidate:", candidateId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg bg-muted">
              {getInitials(candidate.firstName, candidate.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {candidate.firstName} {candidate.lastName}
            </h1>
            <p className="text-xl text-muted-foreground mt-1">{candidate.position}</p>
            <div className="flex items-center space-x-4 mt-2">
              <StatusBadge status={candidate.status} />
              <Badge variant="outline">Phase {candidate.phase}</Badge>
              <Badge variant="outline">{candidate.source}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button onClick={handleScheduleInterview}>
            <CalendarPlus className="w-4 h-4 mr-2" />
            Schedule Interview
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{candidate.email}</p>
                  </div>
                </div>
                {candidate.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{candidate.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Applied</p>
                    <p className="font-medium">{formatDate(candidate.appliedDate)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{formatDate(candidate.lastUpdated)}</p>
                  </div>
                </div>
              </div>
              {candidate.linkedinUrl && (
                <div className="flex items-center space-x-3 pt-2">
                  <LinkedinIcon className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">LinkedIn</p>
                    <a 
                      href={candidate.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Professional Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Professional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="font-medium">{candidate.position}</p>
                </div>
                {candidate.experience && (
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="font-medium">{candidate.experience} years</p>
                  </div>
                )}
              </div>
              {candidate.skills && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.split(',').map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {candidate.resumeUrl && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Resume</p>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    View Resume
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interview History */}
          <Card>
            <CardHeader>
              <CardTitle>Interview History</CardTitle>
            </CardHeader>
            <CardContent>
              {interviews.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No interviews scheduled yet
                </div>
              ) : (
                <div className="space-y-4">
                  {interviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <div>
                          <p className="font-medium">{interview.type} Interview</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(interview.scheduledDate)} • {interview.duration} minutes
                          </p>
                          <p className="text-sm text-muted-foreground">
                            with {interview.interviewer}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant={interview.status === 'Completed' ? 'default' : 'secondary'}
                        >
                          {interview.status}
                        </Badge>
                        {interview.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm">{interview.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <CalendarPlus className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                View Resume
              </Button>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {candidate.notes && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm">{candidate.notes}</p>
                </div>
              )}
              <div className="space-y-3">
                <Textarea
                  placeholder="Add a note about this candidate..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
                <Button 
                  size="sm" 
                  onClick={handleSaveNote}
                  disabled={!newNote.trim()}
                  className="w-full"
                >
                  Add Note
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Interviews</span>
                <span className="font-medium">{interviews.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="font-medium">{completedInterviews.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Upcoming</span>
                <span className="font-medium">{upcomingInterviews.length}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Days in Pipeline</span>
                <span className="font-medium">
                  {Math.floor((new Date().getTime() - new Date(candidate.appliedDate).getTime()) / (1000 * 60 * 60 * 24))}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Candidate Modal */}
      <CandidateModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        candidate={candidate}
        mode="edit"
      />
    </div>
  );
}
