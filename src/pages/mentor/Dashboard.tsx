import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Target, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function MentorDashboard() {
  const [mentorships, setMentorships] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: ments }, { data: apps }] = await Promise.all([
        supabase.from('mentorship_records').select('*'),
        supabase.from('applications').select('*').eq('status', 'accepted'),
      ]);
      setMentorships(ments || []);
      setApplications(apps || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  const active = mentorships.filter(m => m.mentorship_assigned).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading">Mentor Dashboard</h1>
        <p className="text-muted-foreground">Support founders in the program</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Accepted Participants" value={applications.length} icon={Users} />
        <StatCard title="Active Mentorships" value={active} icon={BookOpen} />
        <StatCard title="Pending Assignment" value={applications.length - active} icon={Target} />
      </div>

      <Card>
        <CardHeader><CardTitle className="font-heading">Recent Participants</CardTitle></CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No accepted participants yet</p>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 5).map(app => {
                const m = mentorships.find(r => r.application_id === app.id);
                return (
                  <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{app.venture_title}</p>
                      <p className="text-sm text-muted-foreground">{m?.mentorship_assigned ? `Mentor: ${m.mentor_name}` : 'Not assigned'}</p>
                    </div>
                    <Link to="/app/mentor/participants"><Button size="sm" variant="outline">View</Button></Link>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
