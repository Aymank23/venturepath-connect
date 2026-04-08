import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Upload, FileText, Trash2 } from 'lucide-react';

export default function Documents() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [appId, setAppId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: app } = await supabase.from('applications').select('id').eq('user_id', user.id).maybeSingle();
      if (app) {
        setAppId(app.id);
        const { data: docs } = await supabase.from('application_documents').select('*').eq('application_id', app.id).order('uploaded_at', { ascending: false });
        setDocuments(docs || []);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const uploadDoc = async (file: File) => {
    if (!user || !appId) { toast.error('Create an application first'); return; }
    const path = `${user.id}/${Date.now()}_${file.name}`;
    const { error: uploadErr } = await supabase.storage.from('documents').upload(path, file);
    if (uploadErr) { toast.error('Upload failed'); return; }
    const { error } = await supabase.from('application_documents').insert({
      application_id: appId,
      file_name: file.name,
      file_path: path,
      file_type: file.type,
    });
    if (error) { toast.error('Failed to save document record'); return; }
    toast.success('Document uploaded');
    const { data: docs } = await supabase.from('application_documents').select('*').eq('application_id', appId).order('uploaded_at', { ascending: false });
    setDocuments(docs || []);
  };

  const deleteDoc = async (doc: any) => {
    await supabase.storage.from('documents').remove([doc.file_path]);
    await supabase.from('application_documents').delete().eq('id', doc.id);
    setDocuments(documents.filter(d => d.id !== doc.id));
    toast.success('Document deleted');
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold font-heading">Documents</h1>
        <p className="text-muted-foreground">Upload and manage your application documents</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="font-heading text-lg">Upload Document</CardTitle></CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-3">Upload resumes, certificates, or supporting documents</p>
            <Input type="file" accept=".pdf,.doc,.docx,.jpg,.png" onChange={e => { if (e.target.files?.[0]) uploadDoc(e.target.files[0]); }} className="max-w-xs mx-auto" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-heading text-lg">Uploaded Documents ({documents.length})</CardTitle></CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No documents uploaded yet</p>
          ) : (
            <div className="space-y-3">
              {documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{doc.file_name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(doc.uploaded_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteDoc(doc)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
