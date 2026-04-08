import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lightbulb, Users, Award } from 'lucide-react';

export default function Landing() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/app/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm font-heading">IE</span>
            </div>
            <span className="font-heading font-bold text-lg">IEP Platform</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost">Sign In</Button></Link>
            <Link to="/signup"><Button>Apply Now</Button></Link>
          </div>
        </div>
      </header>

      <section className="container py-20 md:py-32 text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight">
          Innovation &<br />
          <span className="text-primary">Entrepreneurship Program</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Transform your venture idea into reality. Apply to our program and get access to mentorship, resources, and a community of innovators.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/signup"><Button size="lg" className="gap-2">Start Application <ArrowRight className="h-4 w-4" /></Button></Link>
          <Link to="/login"><Button size="lg" variant="outline">Sign In</Button></Link>
        </div>
      </section>

      <section className="container py-16 border-t">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { icon: Lightbulb, title: 'Submit Your Idea', desc: 'Share your venture concept with our review committee through a comprehensive application.' },
            { icon: Users, title: 'Expert Evaluation', desc: 'Applications are scored by experienced reviewers using rigorous weighted criteria.' },
            { icon: Award, title: 'Mentorship & Growth', desc: 'Accepted founders receive dedicated mentorship and support to grow their ventures.' },
          ].map((f, i) => (
            <div key={i} className="text-center space-y-3 p-6">
              <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t py-8">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Innovation & Entrepreneurship Program. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
