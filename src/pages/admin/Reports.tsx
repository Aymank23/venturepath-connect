import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/StatCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, CheckCircle, Award, BarChart3 } from 'lucide-react';

export default function AdminReports() {
  const [applications, setApplications] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [mentorships, setMentorships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: apps }, { data: revs }, { data: ments }] = await Promise.all([
        supabase.from('applications').select('*'),
        supabase.from('reviews').select('*').eq('review_status', 'completed'),
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

  const totalApps = applications.length;
  const accepted = applications.filter(a => a.status === 'accepted').length;
  const avgScore = reviews.length > 0 ? (reviews.reduce((s, r) => s + Number(r.weighted_total_score || 0), 0) / reviews.length).toFixed(2) : '—';
  const mentorAssigned = mentorships.filter(m => m.mentorship_assigned).length;

  const categoryData = Object.entries(applications.reduce((acc: Record<string, number>, a) => {
    const cat = a.category?.replace('_', ' ') || 'Unknown';
    acc[cat] = (acc[cat] || 0) + 1; return acc;
  }, {})).map(([name, count]) => ({ name, count }));

  const statusData = Object.entries(applications.reduce((acc: Record<string, number>, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1; return acc;
  }, {})).map(([name, value]) => ({ name: name.replace('_', ' '), value }));

  const COLORS = ['#059669', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading">Reports & Analytics</h1>
        <p className="text-muted-foreground">Program performance overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Applications" value={totalApps} icon={FileText} />
        <StatCard title="Accepted" value={accepted} icon={CheckCircle} />
        <StatCard title="Avg Review Score" value={avgScore} icon={BarChart3} />
        <StatCard title="Mentorships" value={mentorAssigned} icon={Award} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="font-heading text-lg">By Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-heading text-lg">Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="font-heading text-lg">Score Distribution</CardTitle></CardHeader>
        <CardContent>
          {reviews.length === 0 ? <p className="text-center py-4 text-muted-foreground">No completed reviews</p> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={reviews.map((r, i) => ({ name: `#${i + 1}`, score: Number(r.weighted_total_score).toFixed(2) }))}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="score" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
