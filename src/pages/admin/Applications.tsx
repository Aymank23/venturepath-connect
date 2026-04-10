import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const trackLabels: Record<string, string> = {
  innovation_entrepreneurship: 'Innovation & Entrepreneurship',
  ai_innovation: 'AI Innovation',
};

export default function AdminApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [trackFilter, setTrackFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('applications').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setApplications(data || []); setLoading(false); });
  }, []);

  const filtered = applications.filter(a => {
    const matchSearch = (a.venture_title || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchTrack = trackFilter === 'all' || (a as any).track === trackFilter;
    return matchSearch && matchStatus && matchTrack;
  });

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading">All Applications</h1>
        <p className="text-muted-foreground">{applications.length} total applications</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ventures..." className="pl-9" />
        </div>
        <Select value={trackFilter} onValueChange={setTrackFilter}>
          <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tracks</SelectItem>
            <SelectItem value="innovation_entrepreneurship">Innovation & Entrepreneurship</SelectItem>
            <SelectItem value="ai_innovation">AI Innovation</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="waitlisted">Waitlisted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Venture</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Track</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Submitted</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => (
                  <tr key={app.id} className="border-b hover:bg-muted/30">
                    <td className="p-4 font-medium">{app.venture_title || 'Untitled'}</td>
                    <td className="p-4 text-sm">
                      {(app as any).track ? (
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-accent text-accent-foreground">
                          {trackLabels[(app as any).track] || (app as any).track}
                        </span>
                      ) : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{app.category?.replace('_', ' ') || '—'}</td>
                    <td className="p-4"><StatusBadge status={app.status} /></td>
                    <td className="p-4 text-sm text-muted-foreground">{app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : '—'}</td>
                    <td className="p-4">
                      <Link to={`/app/admin/applications/${app.id}`}>
                        <Button size="sm" variant="outline">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
