import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { CheckCircle, Clock, FileText, Users } from 'lucide-react';

export default function ApplicationStatus() {
  const { user } = useAuth();
  const [application, setApplication] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: app } = await supabase.from('applications').select('*').eq('user_id', user.id).maybeSingle();
      if (app) {
        setApplication(app);
        const { data: members } = await supabase.from('team_members').select('*').eq('application_id', app.id);
        setTeamMembers(members || []);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  if (!application) return <div className="text-center py-20 text-muted-foreground">No application found</div>;

  const steps = [
    { label: 'Application Created', done: true, icon: FileText },
    { label: 'Submitted', done: application.status !== 'draft', icon: CheckCircle },
    { label: 'Under Review', done: ['under_review', 'accepted', 'rejected', 'waitlisted'].includes(application.status), icon: Clock },
    { label: 'Decision Made', done: ['accepted', 'rejected', 'waitlisted'].includes(application.status), icon: Users },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold font-heading">Application Status</h1>
        <p className="text-muted-foreground">Track your application progress</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-heading">{application.venture_title || 'Untitled'}</CardTitle>
            <StatusBadge status={application.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center gap-2">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${step.done ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <step.icon className="h-4 w-4" />
                </div>
                <span className={`text-xs hidden md:inline ${step.done ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{step.label}</span>
                {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${step.done ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Category:</span> <span className="ml-1 font-medium">{application.category?.replace('_', ' ') || '—'}</span></div>
            <div><span className="text-muted-foreground">Submitted:</span> <span className="ml-1 font-medium">{application.submitted_at ? new Date(application.submitted_at).toLocaleDateString() : '—'}</span></div>
            <div><span className="text-muted-foreground">Team Size:</span> <span className="ml-1 font-medium">{teamMembers.length}</span></div>
            <div><span className="text-muted-foreground">Commitment:</span> <span className="ml-1 font-medium">{application.commitment_agreed ? '✓ Agreed' : '✗ Not agreed'}</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
