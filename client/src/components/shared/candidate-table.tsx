import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Edit2 } from "lucide-react";
import { Link } from "wouter";
import { formatDate, getInitials, cn } from "@/lib/utils";
import type { Candidate } from "@/lib/types";
import StatusBadge from "./status-badge";

interface CandidateTableProps {
  candidates: Candidate[];
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  onEdit?: (candidate: Candidate) => void;
}

export default function CandidateTable({
  candidates,
  selectedIds,
  onSelectionChange,
  onEdit,
}: CandidateTableProps) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(candidates.map(c => c.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const isAllSelected = candidates.length > 0 && selectedIds.length === candidates.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < candidates.length;

  return (
    <div className="overflow-x-auto -mx-3 sm:mx-0">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all candidates"
                className={cn(isIndeterminate && "data-[state=checked]:bg-primary")}
              />
            </TableHead>
            <TableHead>Candidate</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => {
            const isSelected = selectedIds.includes(candidate.id);
            
            return (
              <TableRow key={candidate.id} className="hover:bg-muted/50">
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleSelectOne(candidate.id, checked as boolean)}
                    aria-label={`Select ${candidate.firstName} ${candidate.lastName}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-muted">
                        {getInitials(candidate.firstName, candidate.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">
                        {candidate.firstName} {candidate.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {candidate.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-foreground">{candidate.position}</span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={candidate.status} />
                </TableCell>
                <TableCell>
                  <span className="text-foreground">{candidate.source}</span>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">
                    {formatDate(candidate.appliedDate)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Link href={`/candidates/${candidate.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    {onEdit && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onEdit(candidate)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      {candidates.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No candidates found
        </div>
      )}
    </div>
  );
}
