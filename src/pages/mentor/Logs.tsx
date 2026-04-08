import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function MentorLogs() {
  const [mentorships, setMentorships] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const load = async () => {
      const [{ data: ments }, { data: apps }] = await Promise.all([
        supabase.from('mentorship_records').select('*').eq('mentorship_assigned', true),
        supabase.from('applications').select('id, venture_title'),
      ]);
      setMentorships(ments || []);
      setApplications(apps || []);
      setLoading(false);
    };
    load();
  }, []);

  const saveNotes = async (id: string) => {
    await supabase.from('mentorship_records').update({ mentorship_notes: notes }).eq('id', id);
    setMentorships(mentorships.map(m => m.id === id ? { ...m, mentorship_notes: notes } : m));
    setEditingId(null);
    toast.success('Notes saved');
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading">Mentorship Logs</h1>
        <p className="text-muted-foreground">Track mentorship activities</p>
      </div>

      {mentorships.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No active mentorships</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {mentorships.map(m => {
            const app = applications.find(a => a.id === m.application_id);
            const isEditing = editingId === m.id;
            return (
              <Card key={m.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{app?.venture_title || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">Mentor: {m.mentor_name} · {m.mentorship_type || 'General'}</p>
                      <p className="text-xs text-muted-foreground">{m.mentorship_start_date} — {m.mentorship_end_date || 'Ongoing'}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => { if (isEditing) { setEditingId(null); } else { setNotes(m.mentorship_notes || ''); setEditingId(m.id); } }}>
                      {isEditing ? 'Cancel' : 'Edit Notes'}
                    </Button>
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label>Mentorship Notes</Label>
                      <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} />
                      <Button size="sm" onClick={() => saveNotes(m.id)}>Save</Button>
                    </div>
                  ) : m.mentorship_notes ? (
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">{m.mentorship_notes}</p>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
