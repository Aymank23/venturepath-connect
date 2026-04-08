import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function ReviewerApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: apps } = await supabase.from('applications').select('*').neq('status', 'draft').order('submitted_at', { ascending: false });
      const { data: revs } = await supabase.from('reviews').select('*');
      setApplications(apps || []);
      setReviews(revs || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = applications.filter(a => (a.venture_title || '').toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading">Applications</h1>
          <p className="text-muted-foreground">{applications.length} submitted applications</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-9 w-64" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Venture</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Submitted</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Review</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Score</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => {
                  const review = reviews.find(r => r.application_id === app.id);
                  return (
                    <tr key={app.id} className="border-b hover:bg-muted/30">
                      <td className="p-4 font-medium">{app.venture_title || 'Untitled'}</td>
                      <td className="p-4 text-sm text-muted-foreground">{app.category?.replace('_', ' ') || '—'}</td>
                      <td className="p-4 text-sm text-muted-foreground">{app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : '—'}</td>
                      <td className="p-4"><StatusBadge status={review?.review_status || 'pending'} /></td>
                      <td className="p-4 font-medium">{review?.weighted_total_score ? Number(review.weighted_total_score).toFixed(2) : '—'}</td>
                      <td className="p-4">
                        <Link to={`/app/reviewer/applications/${app.id}`}>
                          <Button size="sm" variant="outline">{review?.review_status === 'completed' ? 'View' : 'Review'}</Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
