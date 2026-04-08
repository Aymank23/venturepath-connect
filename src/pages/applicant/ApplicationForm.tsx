import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Plus, Trash2, Save, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TeamMember {
  id?: string;
  full_name: string;
  email: string;
  phone: string;
  resume_url: string;
  is_main_applicant: boolean;
}

export default function ApplicationForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appId, setAppId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form fields
  const [ventureTitle, setVentureTitle] = useState('');
  const [ventureSummary, setVentureSummary] = useState('');
  const [motivationStatement, setMotivationStatement] = useState('');
  const [category, setCategory] = useState('');
  const [alumniYear, setAlumniYear] = useState('');
  const [alumniSchool, setAlumniSchool] = useState('');
  const [commitmentAgreed, setCommitmentAgreed] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { full_name: '', email: '', phone: '', resume_url: '', is_main_applicant: true }
  ]);

  useEffect(() => {
    if (!user) return;
    loadApplication();
  }, [user]);

  const loadApplication = async () => {
    const { data } = await supabase.from('applications').select('*').eq('user_id', user!.id).maybeSingle();
    if (data) {
      setAppId(data.id);
      setVentureTitle(data.venture_title || '');
      setVentureSummary(data.venture_summary || '');
      setMotivationStatement(data.motivation_statement || '');
      setCategory(data.category || '');
      setAlumniYear(data.alumni_graduation_year?.toString() || '');
      setAlumniSchool(data.alumni_school || '');
      setCommitmentAgreed(data.commitment_agreed || false);
      setIsSubmitted(data.status !== 'draft');

      const { data: members } = await supabase.from('team_members').select('*').eq('application_id', data.id).order('is_main_applicant', { ascending: false });
      if (members && members.length > 0) {
        setTeamMembers(members.map(m => ({ id: m.id, full_name: m.full_name, email: m.email || '', phone: m.phone || '', resume_url: m.resume_url || '', is_main_applicant: m.is_main_applicant || false })));
      }
    }
    setLoading(false);
  };

  const saveApplication = async (submit = false) => {
    if (!user) return;
    setSaving(true);

    try {
      const appData = {
        user_id: user.id,
        venture_title: ventureTitle,
        venture_summary: ventureSummary,
        motivation_statement: motivationStatement,
        category: category || null,
        alumni_graduation_year: alumniYear ? parseInt(alumniYear) : null,
        alumni_school: alumniSchool || null,
        commitment_agreed: commitmentAgreed,
        ...(submit ? { status: 'submitted' as const, submitted_at: new Date().toISOString() } : {}),
      };

      let applicationId = appId;
      if (appId) {
        await supabase.from('applications').update(appData).eq('id', appId);
      } else {
        const { data, error } = await supabase.from('applications').insert(appData).select().single();
        if (error) throw error;
        applicationId = data.id;
        setAppId(data.id);
      }

      // Save team members
      if (applicationId) {
        // Delete existing members and re-insert
        await supabase.from('team_members').delete().eq('application_id', applicationId);
        const membersToInsert = teamMembers.map(m => ({
          application_id: applicationId!,
          full_name: m.full_name,
          email: m.email,
          phone: m.phone,
          resume_url: m.resume_url,
          is_main_applicant: m.is_main_applicant,
        }));
        await supabase.from('team_members').insert(membersToInsert);
      }

      if (submit) {
        setIsSubmitted(true);
        toast.success('Application submitted successfully!');
        navigate('/app/status');
      } else {
        toast.success('Application saved as draft');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    }
    setSaving(false);
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { full_name: '', email: '', phone: '', resume_url: '', is_main_applicant: false }]);
  };

  const removeTeamMember = (index: number) => {
    if (teamMembers[index].is_main_applicant) return;
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, field: keyof TeamMember, value: string | boolean) => {
    const updated = [...teamMembers];
    (updated[index] as any)[field] = value;
    setTeamMembers(updated);
  };

  const handleFileUpload = async (index: number, file: File) => {
    if (!user) return;
    const path = `${user.id}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('documents').upload(path, file);
    if (error) { toast.error('Upload failed'); return; }
    const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(path);
    updateMember(index, 'resume_url', path);
    toast.success('Resume uploaded');
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  if (isSubmitted) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold font-heading">Application Submitted</h1>
        <Card>
          <CardContent className="py-8 text-center space-y-4">
            <p className="text-muted-foreground">Your application has been submitted and is being reviewed.</p>
            <Button variant="outline" onClick={() => navigate('/app/status')}>View Status</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold font-heading">Application Form</h1>
        <p className="text-muted-foreground">Complete all sections before submitting</p>
      </div>

      {/* Venture Information */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Venture Information</CardTitle>
          <CardDescription>Tell us about your venture idea</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Venture Idea Title *</Label>
            <Input value={ventureTitle} onChange={e => setVentureTitle(e.target.value)} placeholder="Your venture name or idea title" />
          </div>
          <div className="space-y-2">
            <Label>Venture Concept Summary *</Label>
            <Textarea value={ventureSummary} onChange={e => setVentureSummary(e.target.value)} placeholder="Describe your venture concept..." rows={4} />
          </div>
          <div className="space-y-2">
            <Label>Motivation Statement *</Label>
            <Textarea value={motivationStatement} onChange={e => setMotivationStatement(e.target.value)} placeholder="Why are you applying to this program?" rows={4} />
          </div>
        </CardContent>
      </Card>

      {/* Category */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Applicant Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Select your category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="aksob_student">AKSOB Student</SelectItem>
                <SelectItem value="lau_other">LAU Student (Other Schools)</SelectItem>
                <SelectItem value="alumni">Alumni</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {category === 'alumni' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Year of Graduation</Label>
                <Input type="number" value={alumniYear} onChange={e => setAlumniYear(e.target.value)} placeholder="e.g., 2020" />
              </div>
              <div className="space-y-2">
                <Label>School</Label>
                <Input value={alumniSchool} onChange={e => setAlumniSchool(e.target.value)} placeholder="School name" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Team Members</CardTitle>
          <CardDescription>Add yourself and any team members</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {teamMembers.map((member, i) => (
            <div key={i} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">
                  {member.is_main_applicant ? '👤 Main Applicant' : `Team Member ${i}`}
                </span>
                {!member.is_main_applicant && (
                  <Button variant="ghost" size="sm" onClick={() => removeTeamMember(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input value={member.full_name} onChange={e => updateMember(i, 'full_name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" value={member.email} onChange={e => updateMember(i, 'email', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={member.phone} onChange={e => updateMember(i, 'phone', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Resume</Label>
                  <Input type="file" accept=".pdf,.doc,.docx" onChange={e => { if (e.target.files?.[0]) handleFileUpload(i, e.target.files[0]); }} />
                  {member.resume_url && <p className="text-xs text-primary">✓ Uploaded</p>}
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addTeamMember} className="gap-2"><Plus className="h-4 w-4" /> Add Team Member</Button>
        </CardContent>
      </Card>

      {/* Commitment */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Commitment Agreement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <Checkbox checked={commitmentAgreed} onCheckedChange={(v) => setCommitmentAgreed(!!v)} id="commitment" />
            <Label htmlFor="commitment" className="text-sm leading-relaxed">
              I commit to actively participating in the Innovation & Entrepreneurship Program, attending required sessions, and engaging with assigned mentors. I understand that acceptance into the program comes with responsibilities and expectations for progress.
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end pb-8">
        <Button variant="outline" onClick={() => saveApplication(false)} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" /> Save Draft
        </Button>
        <Button onClick={() => {
          if (!ventureTitle || !ventureSummary || !motivationStatement || !category || !commitmentAgreed) {
            toast.error('Please complete all required fields and agree to the commitment');
            return;
          }
          if (!teamMembers[0]?.full_name || !teamMembers[0]?.email) {
            toast.error('Main applicant name and email are required');
            return;
          }
          saveApplication(true);
        }} disabled={saving} className="gap-2">
          <Send className="h-4 w-4" /> Submit Application
        </Button>
      </div>
    </div>
  );
}
