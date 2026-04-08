import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MentorParticipants() {
  const [applications, setApplications] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [mentorships, setMentorships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: apps } = await supabase.from('applications').select('*').eq('status', 'accepted');
      if (apps && apps.length > 0) {
        const ids = apps.map(a => a.id);
        const [{ data: members }, { data: ments }] = await Promise.all([
          supabase.from('team_members').select('*').in('application_id', ids),
          supabase.from('mentorship_records').select('*').in('application_id', ids),
        ]);
        setTeamMembers(members || []);
        setMentorships(ments || []);
      }
      setApplications(apps || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading">Participants</h1>
        <p className="text-muted-foreground">Accepted founders in the program</p>
      </div>

      {applications.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No participants yet</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {applications.map(app => {
            const members = teamMembers.filter(m => m.application_id === app.id);
            const mentorship = mentorships.find(m => m.application_id === app.id);
            return (
              <Card key={app.id}>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <p className="font-medium text-lg">{app.venture_title}</p>
                    <p className="text-sm text-muted-foreground">{app.venture_summary?.slice(0, 120)}...</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-muted-foreground">Category:</span> {app.category?.replace('_', ' ')}</div>
                    <div><span className="text-muted-foreground">Team Size:</span> {members.length}</div>
                    <div><span className="text-muted-foreground">Mentor:</span> {mentorship?.mentor_name || 'Not assigned'}</div>
                    <div><span className="text-muted-foreground">Type:</span> {mentorship?.mentorship_type || '—'}</div>
                  </div>
                  {members.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Team Members</p>
                      <div className="flex flex-wrap gap-2">
                        {members.map(m => (
                          <span key={m.id} className="text-xs bg-muted px-2 py-1 rounded">
                            {m.full_name} {m.is_main_applicant && '(Lead)'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
