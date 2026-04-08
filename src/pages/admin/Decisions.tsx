import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function AdminDecisions() {
  const [applications, setApplications] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: apps }, { data: revs }] = await Promise.all([
        supabase.from('applications').select('*').in('status', ['submitted', 'under_review']).order('created_at'),
        supabase.from('reviews').select('*').eq('review_status', 'completed'),
      ]);
      setApplications(apps || []);
      setReviews(revs || []);
      setLoading(false);
    };
    load();
  }, []);

  const decide = async (appId: string, status: string) => {
    await supabase.from('applications').update({ status: status as any }).eq('id', appId);
    setApplications(applications.map(a => a.id === appId ? { ...a, status } : a));
    toast.success(`Application ${status}`);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading">Decisions</h1>
        <p className="text-muted-foreground">Accept, reject, or waitlist applications</p>
      </div>

      {applications.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No applications pending decision</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {applications.map(app => {
            const review = reviews.find(r => r.application_id === app.id);
            return (
              <Card key={app.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="font-medium">{app.venture_title || 'Untitled'}</p>
                      <p className="text-sm text-muted-foreground">{app.category?.replace('_', ' ') || '—'}</p>
                      {review && <p className="text-sm font-medium text-primary mt-1">Score: {Number(review.weighted_total_score).toFixed(2)}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={app.status} />
                      <Button size="sm" variant="outline" className="text-success border-success/30" onClick={() => decide(app.id, 'accepted')}>Accept</Button>
                      <Button size="sm" variant="outline" onClick={() => decide(app.id, 'waitlisted')}>Waitlist</Button>
                      <Button size="sm" variant="outline" className="text-destructive border-destructive/30" onClick={() => decide(app.id, 'rejected')}>Reject</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
