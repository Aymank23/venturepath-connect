import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, Clock, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const trackLabels: Record<string, string> = {
  innovation_entrepreneurship: 'Innovation & Entrepreneurship',
  ai_innovation: 'AI Innovation',
};

export default function ReviewerDashboard() {
  const [allApplications, setAllApplications] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [trackFilter, setTrackFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: apps } = await supabase.from('applications').select('*').neq('status', 'draft').order('submitted_at', { ascending: false });
      const { data: revs } = await supabase.from('reviews').select('*');
      setAllApplications(apps || []);
      setReviews(revs || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  const applications = trackFilter === 'all'
    ? allApplications
    : allApplications.filter(a => (a as any).track === trackFilter);

  const appIds = new Set(applications.map(a => a.id));
  const filteredReviews = reviews.filter(r => appIds.has(r.application_id));

  const reviewed = filteredReviews.filter(r => r.review_status === 'completed').length;
  const pending = applications.length - reviewed;
  const avgScore = filteredReviews.length > 0 ? (filteredReviews.reduce((sum, r) => sum + (Number(r.weighted_total_score) || 0), 0) / filteredReviews.length).toFixed(2) : '—';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Reviewer Dashboard</h1>
          <p className="text-muted-foreground">Review submitted applications</p>
        </div>
        <Select value={trackFilter} onValueChange={setTrackFilter}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tracks</SelectItem>
            <SelectItem value="innovation_entrepreneurship">Innovation & Entrepreneurship</SelectItem>
            <SelectItem value="ai_innovation">AI Innovation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Submitted" value={applications.length} icon={FileText} />
        <StatCard title="Pending Review" value={pending} icon={Clock} />
        <StatCard title="Reviewed" value={reviewed} icon={CheckCircle} />
        <StatCard title="Avg Score" value={avgScore} icon={BarChart3} />
      </div>

      <Card>
        <CardHeader><CardTitle className="font-heading">Recent Applications</CardTitle></CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No submitted applications yet</p>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 5).map(app => {
                const review = reviews.find(r => r.application_id === app.id);
                return (
                  <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{app.venture_title || 'Untitled'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {(app as any).track && (
                          <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium bg-accent text-accent-foreground">
                            {trackLabels[(app as any).track]}
                          </span>
                        )}
                        <span className="text-sm text-muted-foreground">{app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={review?.review_status || 'pending'} />
                      <Link to={`/app/reviewer/applications/${app.id}`}>
                        <Button size="sm" variant="outline">Review</Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {applications.length > 5 && (
            <div className="mt-4 text-center">
              <Link to="/app/reviewer/applications"><Button variant="outline">View All Applications</Button></Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
