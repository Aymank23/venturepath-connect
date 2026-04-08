import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  submitted: 'bg-info/15 text-info border-info/30',
  under_review: 'bg-warning/15 text-warning border-warning/30',
  accepted: 'bg-success/15 text-success border-success/30',
  rejected: 'bg-destructive/15 text-destructive border-destructive/30',
  waitlisted: 'bg-accent text-accent-foreground',
  pending: 'bg-muted text-muted-foreground',
  in_progress: 'bg-warning/15 text-warning border-warning/30',
  completed: 'bg-success/15 text-success border-success/30',
};

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under Review',
  accepted: 'Accepted',
  rejected: 'Rejected',
  waitlisted: 'Waitlisted',
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge variant="outline" className={cn('font-medium', statusStyles[status] || '', className)}>
      {statusLabels[status] || status}
    </Badge>
  );
}
