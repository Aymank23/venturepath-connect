import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { FileText, CheckCircle, XCircle, Clock, Users, Award, BarChart3, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const [applications, setApplications] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [mentorships, setMentorships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: apps }, { data: revs }, { data: ments }] = await Promise.all([
        supabase.from('applications').select('*'),
        supabase.from('reviews').select('*'),
        supabase.from('mentorship_records').select('*'),
      ]);
      setApplications(apps || []);
      setReviews(revs || []);
      setMentorships(ments || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  const statusCounts = applications.reduce((acc: Record<string, number>, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {});
  const submitted = applications.filter(a => a.status !== 'draft').length;
  const accepted = statusCounts['accepted'] || 0;
  const rejected = statusCounts['rejected'] || 0;
  const completedReviews = reviews.filter(r => r.review_status === 'completed').length;
  const mentorshipsAssigned = mentorships.filter(m => m.mentorship_assigned).length;

  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name: name.replace('_', ' '), value }));
  const COLORS = ['hsl(var(--muted))', 'hsl(var(--info))', 'hsl(var(--warning))', 'hsl(var(--success))', 'hsl(var(--destructive))', 'hsl(var(--accent))'];

  const categoryData = applications.reduce((acc: Record<string, number>, a) => {
    const cat = a.category?.replace('_', ' ') || 'Unknown';
    acc[cat] = (acc[cat] || 0) + 1; return acc;
  }, {});
  const categoryChartData = Object.entries(categoryData).map(([name, count]) => ({ name, count }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading">Admin Dashboard</h1>
        <p className="text-muted-foreground">Program overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Applications" value={applications.length} icon={FileText} />
        <StatCard title="Submitted" value={submitted} icon={Clock} />
        <StatCard title="Accepted" value={accepted} icon={CheckCircle} />
        <StatCard title="Reviews Done" value={`${completedReviews}/${submitted}`} icon={BarChart3} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Rejected" value={rejected} icon={XCircle} />
        <StatCard title="Waitlisted" value={statusCounts['waitlisted'] || 0} icon={AlertCircle} />
        <StatCard title="Mentorships" value={mentorshipsAssigned} icon={Award} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="font-heading text-lg">Applications by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryChartData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(158, 64%, 32%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-heading text-lg">Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statusData.map((s, i) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-sm capitalize">{s.name}</span>
                  </div>
                  <span className="font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
