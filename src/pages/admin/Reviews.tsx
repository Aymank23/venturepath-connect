import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: revs }, { data: apps }] = await Promise.all([
        supabase.from('reviews').select('*').order('created_at', { ascending: false }),
        supabase.from('applications').select('id, venture_title'),
      ]);
      setReviews(revs || []);
      setApplications(apps || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading">Reviews</h1>
        <p className="text-muted-foreground">{reviews.length} total reviews</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Venture</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Score</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Reviewed</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(rev => {
                  const app = applications.find(a => a.id === rev.application_id);
                  return (
                    <tr key={rev.id} className="border-b hover:bg-muted/30">
                      <td className="p-4 font-medium">{app?.venture_title || 'Unknown'}</td>
                      <td className="p-4"><StatusBadge status={rev.review_status} /></td>
                      <td className="p-4 font-medium text-primary">{rev.weighted_total_score ? Number(rev.weighted_total_score).toFixed(2) : '—'}</td>
                      <td className="p-4 text-sm text-muted-foreground">{rev.reviewed_at ? new Date(rev.reviewed_at).toLocaleDateString() : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {reviews.length === 0 && <p className="text-center py-8 text-muted-foreground">No reviews yet</p>}
        </CardContent>
      </Card>
    </div>
  );
}
