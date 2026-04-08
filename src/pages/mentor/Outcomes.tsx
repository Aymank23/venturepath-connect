import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export default function MentorOutcomes() {
  const [applications, setApplications] = useState<any[]>([]);
  const [tracking, setTracking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    const load = async () => {
      const [{ data: apps }, { data: track }] = await Promise.all([
        supabase.from('applications').select('*').eq('status', 'accepted'),
        supabase.from('founder_tracking').select('*'),
      ]);
      setApplications(apps || []);
      setTracking(track || []);
      setLoading(false);
    };
    load();
  }, []);

  const startEdit = (appId: string) => {
    const t = tracking.find(r => r.application_id === appId);
    setForm({
      incubator_participation: t?.incubator_participation || false,
      startup_registered: t?.startup_registered || false,
      startup_name: t?.startup_name || '',
      registration_location: t?.registration_location || '',
      funding_amount: t?.funding_amount || '',
      investor_access_notes: t?.investor_access_notes || '',
      alumni_support_notes: t?.alumni_support_notes || '',
      outcomes_notes: t?.outcomes_notes || '',
      follow_up_date: t?.follow_up_date || '',
    });
    setEditingId(appId);
  };

  const save = async (appId: string) => {
    const existing = tracking.find(r => r.application_id === appId);
    const data = { application_id: appId, ...form, funding_amount: form.funding_amount ? parseFloat(form.funding_amount) : null };
    try {
      if (existing) {
        await supabase.from('founder_tracking').update(data).eq('id', existing.id);
        setTracking(tracking.map(t => t.id === existing.id ? { ...t, ...data } : t));
      } else {
        const { data: newRec } = await supabase.from('founder_tracking').insert(data).select().single();
        if (newRec) setTracking([...tracking, newRec]);
      }
      toast.success('Outcome saved');
      setEditingId(null);
    } catch (err: any) { toast.error(err.message); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading">Outcomes</h1>
        <p className="text-muted-foreground">Track founder and venture outcomes</p>
      </div>

      {applications.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No accepted participants</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {applications.map(app => {
            const t = tracking.find(r => r.application_id === app.id);
            const isEditing = editingId === app.id;
            return (
              <Card key={app.id}>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{app.venture_title}</p>
                      <p className="text-sm text-muted-foreground">
                        {t?.startup_registered ? `Startup: ${t.startup_name}` : 'No startup registered'}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => isEditing ? setEditingId(null) : startEdit(app.id)}>
                      {isEditing ? 'Cancel' : t ? 'Update' : 'Track'}
                    </Button>
                  </div>
                  {isEditing && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex gap-6">
                        <div className="flex items-center gap-2"><Checkbox checked={form.incubator_participation} onCheckedChange={v => setForm({ ...form, incubator_participation: !!v })} /><Label>Incubator Participation</Label></div>
                        <div className="flex items-center gap-2"><Checkbox checked={form.startup_registered} onCheckedChange={v => setForm({ ...form, startup_registered: !!v })} /><Label>Startup Registered</Label></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Startup Name</Label><Input value={form.startup_name} onChange={e => setForm({ ...form, startup_name: e.target.value })} /></div>
                        <div className="space-y-2"><Label>Registration Location</Label><Input value={form.registration_location} onChange={e => setForm({ ...form, registration_location: e.target.value })} /></div>
                        <div className="space-y-2"><Label>Funding Amount ($)</Label><Input type="number" value={form.funding_amount} onChange={e => setForm({ ...form, funding_amount: e.target.value })} /></div>
                        <div className="space-y-2"><Label>Follow-up Date</Label><Input type="date" value={form.follow_up_date} onChange={e => setForm({ ...form, follow_up_date: e.target.value })} /></div>
                      </div>
                      <div className="space-y-2"><Label>Investor Access Notes</Label><Textarea value={form.investor_access_notes} onChange={e => setForm({ ...form, investor_access_notes: e.target.value })} rows={2} /></div>
                      <div className="space-y-2"><Label>Outcomes Notes</Label><Textarea value={form.outcomes_notes} onChange={e => setForm({ ...form, outcomes_notes: e.target.value })} rows={2} /></div>
                      <Button onClick={() => save(app.id)}>Save Outcome</Button>
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
