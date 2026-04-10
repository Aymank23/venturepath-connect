import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight, Lightbulb, Users, Award, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import lauLogo from '@/assets/lau-aksob-logo.png';

export default function Landing() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/app/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex items-center justify-between h-16">
          <img src={lauLogo} alt="LAU Adnan Kassar School of Business" className="h-10 md:h-12 object-contain" />
        </div>
      </header>

      <section className="container py-20 md:py-28 text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-2">
          <BookOpen className="h-4 w-4 text-primary" />
          Adnan Kassar School of Business
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight">
          Innovation &<br />
          <span className="text-primary">Entrepreneurship Program</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Transform your venture idea into reality. Apply to our program and get access to mentorship, resources, and a community of innovators.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
          <span className="rounded-full border border-primary/30 bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground">
            Innovation & Entrepreneurship Track
          </span>
          <span className="rounded-full border border-primary/30 bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground">
            AI Innovation Track
          </span>
        </div>
      </section>

      <section className="container pb-20">
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Card className="group hover:shadow-lg transition-shadow border-2 hover:border-primary/40">
            <CardContent className="pt-8 pb-8 px-8 text-center space-y-4">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-heading font-bold text-xl">Participant Access</h2>
              <p className="text-sm text-muted-foreground">
                LAU students and alumni — sign up or log in to submit your venture application.
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/signup">
                  <Button className="w-full gap-2">
                    Apply Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login?role=participant">
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow border-2 hover:border-muted-foreground/30">
            <CardContent className="pt-8 pb-8 px-8 text-center space-y-4">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
                <BookOpen className="h-7 w-7 text-muted-foreground" />
              </div>
              <h2 className="font-heading font-bold text-xl">Faculty Access</h2>
              <p className="text-sm text-muted-foreground">
                Reviewers, mentors, and administrators — log in to your workspace.
              </p>
              <div className="pt-2">
                <Link to="/login?role=staff">
                  <Button variant="secondary" className="w-full">Faculty Sign In</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
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

      <footer className="border-t py-8 bg-card">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <img src={lauLogo} alt="LAU" className="h-8 object-contain opacity-70" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LAU Adnan Kassar School of Business — Innovation & Entrepreneurship Program
          </p>
        </div>
      </footer>
    </div>
  );
}
