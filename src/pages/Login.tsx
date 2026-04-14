import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { GraduationCap, BookOpen } from 'lucide-react';
import lauLogo from '@/assets/lau-aksob-logo.png';

export default function Login() {
  const { user, loading, signIn, signOut } = useAuth();
  const [searchParams] = useSearchParams();
  const isStaff = searchParams.get('role') === 'staff';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password, { portal: isStaff ? 'staff' : 'participant' });
    if (error) {
      toast.error(error.message);
    }
    setSubmitting(false);
  };

  const handleUseDifferentAccount = async () => {
    setSubmitting(true);
    await signOut();
    setSubmitting(false);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center space-y-4">
          <img src={lauLogo} alt="LAU" className="h-16 md:h-20 mx-auto object-contain" />
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center mx-auto ${isStaff ? 'bg-muted' : 'bg-primary'}`}>
            {isStaff
              ? <BookOpen className="h-6 w-6 text-muted-foreground" />
              : <GraduationCap className="h-6 w-6 text-primary-foreground" />
            }
          </div>
          <h1 className="text-2xl font-bold font-heading">
            {isStaff ? 'Faculty Sign In' : 'Participant Sign In'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isStaff
              ? 'Access the reviewer, mentor, or admin workspace'
              : 'Sign in to the Innovation & Entrepreneurship Platform'}
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            {!loading && user ? (
              <div className="space-y-4">
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="font-medium">You’re already signed in as {user.email}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {isStaff
                      ? 'Continue to the faculty workspace, or sign out to use another faculty account.'
                      : 'Continue to your participant workspace, or sign out to use another account.'}
                  </p>
                </div>
                <Button asChild className="w-full" variant={isStaff ? 'secondary' : 'default'}>
                  <Link to="/app/dashboard" state={isStaff ? { preferStaff: true } : undefined}>
                    Continue to Dashboard
                  </Link>
                </Button>
                <Button type="button" className="w-full" variant="outline" disabled={submitting} onClick={handleUseDifferentAccount}>
                  {submitting ? 'Signing out...' : 'Use a Different Account'}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder={isStaff ? 'faculty@email.com' : 'yourname@lau.edu.lb'} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full" disabled={submitting} variant={isStaff ? 'secondary' : 'default'}>
                  {submitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
        {!isStaff && (
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-medium hover:underline">Sign Up</Link>
          </p>
        )}
        <p className="text-center text-sm text-muted-foreground">
          <Link to="/" className="hover:underline">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
