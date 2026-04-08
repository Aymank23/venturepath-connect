import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ApplicantDashboard() {
  const { user } = useAuth();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from('applications').select('*').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => { setApplication(data); setLoading(false); });
  }, [user]);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  const hasApp = !!application;
  const status = application?.status || 'none';
  const isSubmitted = status !== 'draft' && status !== 'none';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading">Applicant Dashboard</h1>
        <p className="text-muted-foreground">Track your application progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Application Status" value={hasApp ? (status === 'draft' ? 'Draft' : status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')) : 'Not Started'} icon={FileText} />
        <StatCard title="Submitted" value={isSubmitted ? 'Yes' : 'No'} subtitle={application?.submitted_at ? new Date(application.submitted_at).toLocaleDateString() : undefined} icon={isSubmitted ? CheckCircle : Clock} />
        <StatCard title="Completion" value={hasApp ? (isSubmitted ? '100%' : 'In Progress') : '0%'} icon={AlertCircle} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Your Application</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasApp ? (
            <div className="text-center py-8 space-y-4">
              <p className="text-muted-foreground">You haven't started an application yet.</p>
              <Link to="/app/application"><Button>Start Application</Button></Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{application.venture_title || 'Untitled Venture'}</p>
                  <p className="text-sm text-muted-foreground">Created {new Date(application.created_at).toLocaleDateString()}</p>
                </div>
                <StatusBadge status={status} />
              </div>
              {status === 'draft' && (
                <Link to="/app/application"><Button>Continue Application</Button></Link>
              )}
              {isSubmitted && (
                <Link to="/app/status"><Button variant="outline">View Status Details</Button></Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
