import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CandidateStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: CandidateStatus;
  className?: string;
}

const statusColors: Record<CandidateStatus, string> = {
  "New": "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300",
  "Screened": "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300",
  "Phone Interview": "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300",
  "Technical Interview": "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300",
  "Final Interview": "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300",
  "Offer Extended": "bg-cyan-100 dark:bg-cyan-900/20 text-cyan-800 dark:text-cyan-300",
  "Hired": "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300",
  "Rejected": "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300",
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge 
      variant="secondary"
      className={cn(
        "text-xs font-medium",
        statusColors[status],
        className
      )}
    >
      {status}
    </Badge>
  );
}
