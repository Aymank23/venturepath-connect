import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function AdminApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [review, setReview] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: application }, { data: members }, { data: rev }, { data: docs }] = await Promise.all([
        supabase.from('applications').select('*').eq('id', id!).single(),
        supabase.from('team_members').select('*').eq('application_id', id!),
        supabase.from('reviews').select('*').eq('application_id', id!).maybeSingle(),
        supabase.from('application_documents').select('*').eq('application_id', id!),
      ]);
      setApp(application);
      setTeamMembers(members || []);
      setReview(rev);
      setDocuments(docs || []);
      setLoading(false);
    };
    load();
  }, [id]);

  const updateStatus = async (status: string) => {
    await supabase.from('applications').update({ status: status as any }).eq('id', id!);
    setApp({ ...app, status });
    toast.success(`Application ${status}`);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  if (!app) return <div className="text-center py-20 text-muted-foreground">Not found</div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold font-heading">{app.venture_title || 'Untitled'}</h1>
          <p className="text-muted-foreground">Application Detail</p>
        </div>
        <StatusBadge status={app.status} />
      </div>

      {/* Status Change */}
      <Card>
        <CardHeader><CardTitle className="font-heading text-lg">Decision</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Select value={app.status} onValueChange={updateStatus}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="waitlisted">Waitlisted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Venture Info */}
      <Card>
        <CardHeader><CardTitle className="font-heading text-lg">Venture Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label className="text-muted-foreground text-xs">Summary</Label><p className="text-sm mt-1">{app.venture_summary || '—'}</p></div>
          <div><Label className="text-muted-foreground text-xs">Motivation</Label><p className="text-sm mt-1">{app.motivation_statement || '—'}</p></div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><Label className="text-muted-foreground text-xs">Category</Label><p>{app.category?.replace('_', ' ') || '—'}</p></div>
            <div><Label className="text-muted-foreground text-xs">Commitment</Label><p>{app.commitment_agreed ? '✓ Agreed' : '✗ Not agreed'}</p></div>
          </div>
        </CardContent>
      </Card>

      {/* Team */}
      <Card>
        <CardHeader><CardTitle className="font-heading text-lg">Team ({teamMembers.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {teamMembers.map(m => (
              <div key={m.id} className="p-3 border rounded-lg">
                <p className="font-medium text-sm">{m.full_name} {m.is_main_applicant && <span className="text-xs text-primary">(Lead)</span>}</p>
                <p className="text-xs text-muted-foreground">{m.email} · {m.phone || 'No phone'}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Review */}
      {review && (
        <Card>
          <CardHeader><CardTitle className="font-heading text-lg">Review</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Weighted Total</span>
              <span className="text-xl font-bold text-primary">{Number(review.weighted_total_score).toFixed(2)} / 5.00</span>
            </div>
            <StatusBadge status={review.review_status} />
            {review.reviewer_comments && <p className="text-sm text-muted-foreground mt-2">{review.reviewer_comments}</p>}
          </CardContent>
        </Card>
      )}

      {/* Documents */}
      <Card>
        <CardHeader><CardTitle className="font-heading text-lg">Documents ({documents.length})</CardTitle></CardHeader>
        <CardContent>
          {documents.length === 0 ? <p className="text-sm text-muted-foreground">No documents</p> : (
            <div className="space-y-2">
              {documents.map(d => (
                <div key={d.id} className="p-3 border rounded-lg flex justify-between items-center">
                  <span className="text-sm">{d.file_name}</span>
                  <span className="text-xs text-muted-foreground">{new Date(d.uploaded_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
