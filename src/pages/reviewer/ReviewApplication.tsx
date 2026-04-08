import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { StatusBadge } from '@/components/StatusBadge';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';

const CRITERIA = [
  { key: 'problem_significance_score', label: 'Problem Significance', weight: '25%' },
  { key: 'innovation_potential_score', label: 'Innovation Potential', weight: '20%' },
  { key: 'feasibility_score', label: 'Feasibility', weight: '15%' },
  { key: 'team_capability_score', label: 'Team Capability', weight: '15%' },
  { key: 'motivation_commitment_score', label: 'Motivation & Commitment', weight: '15%' },
  { key: 'sdg_impact_score', label: 'SDG & Impact Alignment', weight: '10%' },
] as const;

export default function ReviewApplication() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [app, setApp] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [review, setReview] = useState<any>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: application } = await supabase.from('applications').select('*').eq('id', id!).single();
      setApp(application);
      const { data: members } = await supabase.from('team_members').select('*').eq('application_id', id!);
      setTeamMembers(members || []);
      const { data: docs } = await supabase.from('application_documents').select('*').eq('application_id', id!);
      setDocuments(docs || []);
      const { data: rev } = await supabase.from('reviews').select('*').eq('application_id', id!).maybeSingle();
      if (rev) {
        setReview(rev);
        const s: Record<string, number> = {};
        CRITERIA.forEach(c => { s[c.key] = (rev as any)[c.key] || 3; });
        setScores(s);
        setComments(rev.reviewer_comments || '');
      } else {
        const s: Record<string, number> = {};
        CRITERIA.forEach(c => { s[c.key] = 3; });
        setScores(s);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const calcWeighted = () => {
    const weights = [0.25, 0.20, 0.15, 0.15, 0.15, 0.10];
    return CRITERIA.reduce((sum, c, i) => sum + (scores[c.key] || 3) * weights[i], 0).toFixed(2);
  };

  const saveReview = async (complete = false) => {
    if (!user) return;
    setSaving(true);
    const reviewData: any = {
      application_id: id,
      reviewer_id: user.id,
      reviewer_comments: comments,
      review_status: complete ? 'completed' : 'in_progress',
      ...(complete ? { reviewed_at: new Date().toISOString() } : {}),
    };
    CRITERIA.forEach(c => { reviewData[c.key] = scores[c.key]; });

    try {
      if (review) {
        await supabase.from('reviews').update(reviewData).eq('id', review.id);
      } else {
        const { data } = await supabase.from('reviews').insert(reviewData).select().single();
        setReview(data);
      }
      toast.success(complete ? 'Review completed!' : 'Review saved');
      if (complete) navigate('/app/reviewer/applications');
    } catch (err: any) {
      toast.error(err.message);
    }
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  if (!app) return <div className="text-center py-20 text-muted-foreground">Application not found</div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold font-heading">{app.venture_title || 'Untitled'}</h1>
          <p className="text-muted-foreground">Application Review</p>
        </div>
        <StatusBadge status={app.status} className="ml-auto" />
      </div>

      {/* Application Details */}
      <Card>
        <CardHeader><CardTitle className="font-heading text-lg">Application Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-muted-foreground text-xs">Venture Summary</Label>
            <p className="text-sm mt-1">{app.venture_summary || '—'}</p>
          </div>
          <div>
            <Label className="text-muted-foreground text-xs">Motivation Statement</Label>
            <p className="text-sm mt-1">{app.motivation_statement || '—'}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-muted-foreground text-xs">Category</Label><p className="text-sm">{app.category?.replace('_', ' ') || '—'}</p></div>
            <div><Label className="text-muted-foreground text-xs">Submitted</Label><p className="text-sm">{app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : '—'}</p></div>
          </div>
        </CardContent>
      </Card>

      {/* Team */}
      <Card>
        <CardHeader><CardTitle className="font-heading text-lg">Team ({teamMembers.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {teamMembers.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{m.full_name} {m.is_main_applicant && <span className="text-xs text-primary">(Lead)</span>}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scoring */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Scoring</CardTitle>
          <CardDescription>Rate each criterion from 1 to 5</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {CRITERIA.map(c => (
            <div key={c.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="font-medium">{c.label} <span className="text-muted-foreground font-normal">({c.weight})</span></Label>
                <span className="text-lg font-bold font-heading text-primary">{scores[c.key]}</span>
              </div>
              <Slider value={[scores[c.key]]} onValueChange={([v]) => setScores({ ...scores, [c.key]: v })} min={1} max={5} step={1} />
            </div>
          ))}
          <div className="pt-4 border-t flex items-center justify-between">
            <span className="font-heading font-semibold">Weighted Total</span>
            <span className="text-2xl font-bold text-primary font-heading">{calcWeighted()} / 5.00</span>
          </div>

          <div className="space-y-2">
            <Label>Comments</Label>
            <Textarea value={comments} onChange={e => setComments(e.target.value)} rows={4} placeholder="Additional comments..." />
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => saveReview(false)} disabled={saving} className="gap-2"><Save className="h-4 w-4" /> Save Draft</Button>
            <Button onClick={() => saveReview(true)} disabled={saving}>Complete Review</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
