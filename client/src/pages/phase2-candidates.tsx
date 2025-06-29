import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus, RefreshCw, Search, Download, Table, CalendarPlus } from "lucide-react";
import { useCandidates } from "@/hooks/use-candidates";
import CandidateTable from "@/components/shared/candidate-table";
import CandidateModal from "@/components/modals/candidate-modal";
import ScheduleInterviewModal from "@/components/modals/schedule-interview-modal";
import { exportToCSV } from "@/lib/utils";
import type { Candidate } from "@/lib/types";

export default function Phase2Candidates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sourceFilter, setSourceFilter] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | undefined>();
  const [candidateToSchedule, setCandidateToSchedule] = useState<Candidate | undefined>();

  const { data: candidates = [], isLoading, refetch } = useCandidates(2, searchQuery);

  // Filter candidates based on selected filters
  const filteredCandidates = candidates.filter((candidate) => {
    if (statusFilter && statusFilter !== "all" && candidate.status !== statusFilter) return false;
    if (sourceFilter && sourceFilter !== "all" && candidate.source !== sourceFilter) return false;
    return true;
  });

  const handleEdit = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleScheduleInterview = (candidate: Candidate) => {
    setCandidateToSchedule(candidate);
    setIsScheduleModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCandidate(undefined);
  };

  const handleExport = () => {
    if (filteredCandidates.length > 0) {
      const exportData = filteredCandidates.map(candidate => ({
        'First Name': candidate.firstName,
        'Last Name': candidate.lastName,
        'Email': candidate.email,
        'Phone': candidate.phone || '',
        'Position': candidate.position,
        'Status': candidate.status,
        'Source': candidate.source,
        'Applied Date': new Date(candidate.appliedDate).toLocaleDateString(),
        'Skills': candidate.skills || '',
        'Experience': candidate.experience || 0,
        'Notes': candidate.notes || '',
      }));
      exportToCSV(exportData, 'phase2-candidates.csv');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Phase 2 Candidates</h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
            Advanced interviews and final selection
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Candidate
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsScheduleModalOpen(true)} 
            className="w-full sm:w-auto"
          >
            <CalendarPlus className="w-4 h-4 mr-2" />
            Schedule Interview
          </Button>
          <Button variant="outline" onClick={() => refetch()} className="w-full sm:w-auto">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Technical Interview">Technical Interview</SelectItem>
                  <SelectItem value="Final Interview">Final Interview</SelectItem>
                  <SelectItem value="Offer Extended">Offer Extended</SelectItem>
                  <SelectItem value="Hired">Hired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Indeed">Indeed</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Website">Website</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <Table className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleExport}>
                <Download className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Table */}
      <Card>
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Loading candidates...</span>
            </div>
          </div>
        ) : (
          <CandidateTable
            candidates={filteredCandidates}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onEdit={handleEdit}
          />
        )}
      </Card>

      {/* Pagination */}
      {filteredCandidates.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Showing {filteredCandidates.length} of {candidates.length} candidates
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Add/Edit Candidate Modal */}
      <CandidateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        candidate={editingCandidate}
        mode={editingCandidate ? "edit" : "create"}
      />

      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setCandidateToSchedule(undefined);
        }}
        preselectedCandidate={candidateToSchedule}
      />
    </div>
  );
}
