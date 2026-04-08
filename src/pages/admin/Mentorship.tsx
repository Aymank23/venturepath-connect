import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

export default function AdminMentorship() {
  const [applications, setApplications] = useState<any[]>([]);
  const [mentorships, setMentorships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ mentorship_assigned: false, mentor_name: '', mentorship_type: '', mentorship_start_date: '', mentorship_end_date: '', mentorship_notes: '' });

  useEffect(() => {
    const load = async () => {
      const [{ data: apps }, { data: ments }] = await Promise.all([
        supabase.from('applications').select('*').eq('status', 'accepted'),
        supabase.from('mentorship_records').select('*'),
      ]);
      setApplications(apps || []);
      setMentorships(ments || []);
      setLoading(false);
    };
    load();
  }, []);

  const saveMentorship = async (appId: string) => {
    const existing = mentorships.find(m => m.application_id === appId);
    const data = { application_id: appId, ...form };
    
    try {
      if (existing) {
        await supabase.from('mentorship_records').update(data).eq('id', existing.id);
        setMentorships(mentorships.map(m => m.id === existing.id ? { ...m, ...data } : m));
      } else {
        const { data: newRec } = await supabase.from('mentorship_records').insert(data).select().single();
        if (newRec) setMentorships([...mentorships, newRec]);
      }
      toast.success('Mentorship saved');
      setEditingId(null);
    } catch (err: any) { toast.error(err.message); }
  };

  const startEdit = (appId: string) => {
    const m = mentorships.find(r => r.application_id === appId);
    setForm({
      mentorship_assigned: m?.mentorship_assigned || false,
      mentor_name: m?.mentor_name || '',
      mentorship_type: m?.mentorship_type || '',
      mentorship_start_date: m?.mentorship_start_date || '',
      mentorship_end_date: m?.mentorship_end_date || '',
      mentorship_notes: m?.mentorship_notes || '',
    });
    setEditingId(appId);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading">Mentorship</h1>
        <p className="text-muted-foreground">Assign mentors to accepted participants</p>
      </div>

      {applications.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No accepted applications yet</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {applications.map(app => {
            const m = mentorships.find(r => r.application_id === app.id);
            const isEditing = editingId === app.id;
            return (
              <Card key={app.id}>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{app.venture_title}</p>
                      <p className="text-sm text-muted-foreground">{m?.mentorship_assigned ? `Mentor: ${m.mentor_name}` : 'No mentor assigned'}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => isEditing ? setEditingId(null) : startEdit(app.id)}>
                      {isEditing ? 'Cancel' : m ? 'Edit' : 'Assign'}
                    </Button>
                  </div>
                  {isEditing && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Checkbox checked={form.mentorship_assigned} onCheckedChange={v => setForm({ ...form, mentorship_assigned: !!v })} />
                        <Label>Mentorship Assigned</Label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Mentor Name</Label><Input value={form.mentor_name} onChange={e => setForm({ ...form, mentor_name: e.target.value })} /></div>
                        <div className="space-y-2"><Label>Type</Label><Input value={form.mentorship_type} onChange={e => setForm({ ...form, mentorship_type: e.target.value })} placeholder="e.g., Business, Technical" /></div>
                        <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={form.mentorship_start_date} onChange={e => setForm({ ...form, mentorship_start_date: e.target.value })} /></div>
                        <div className="space-y-2"><Label>End Date</Label><Input type="date" value={form.mentorship_end_date} onChange={e => setForm({ ...form, mentorship_end_date: e.target.value })} /></div>
                      </div>
                      <div className="space-y-2"><Label>Notes</Label><Textarea value={form.mentorship_notes} onChange={e => setForm({ ...form, mentorship_notes: e.target.value })} rows={3} /></div>
                      <Button onClick={() => saveMentorship(app.id)}>Save Mentorship</Button>
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
