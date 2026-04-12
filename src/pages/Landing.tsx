import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight, Lightbulb, Users, Award, BookOpen, Sparkles, Rocket, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import lauLogo from '@/assets/lau-aksob-logo.png';

export default function Landing() {
  const { user, loading } = useAuth();
  if (!loading && user) return <Navigate to="/app/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Header */}
      <header className="relative border-b bg-card">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        {/* Floating animated shapes */}
        <motion.div
          className="absolute top-6 left-[10%] h-3 w-3 rounded-full bg-primary/20"
          animate={{ y: [0, -12, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-12 right-[15%] h-2 w-2 rounded-full bg-primary/15"
          animate={{ y: [0, -8, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute bottom-8 left-[20%] h-2.5 w-2.5 rounded-full bg-accent-foreground/10"
          animate={{ y: [0, -10, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
        <div className="container relative flex flex-col items-center justify-center py-8 md:py-10 gap-4 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={lauLogo}
              alt="LAU Adnan Kassar School of Business"
              className="h-14 md:h-20 lg:h-24 object-contain drop-shadow-md"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '4rem' }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="h-0.5 bg-primary/40 rounded-full"
          />
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="text-xs md:text-sm font-medium tracking-widest uppercase text-primary/70"
          >
            Lebanese American University
          </motion.p>
        </div>
      </header>

      {/* Main Hero */}
      <section className="container py-14 md:py-20 text-center max-w-3xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-2"
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 2 }}
          >
            <BookOpen className="h-4 w-4 text-primary" />
          </motion.span>
          Adnan Kassar School of Business
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight"
        >
          Innovation &<br />
          <motion.span
            className="text-primary inline-block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Entrepreneurship Program
          </motion.span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-lg text-muted-foreground max-w-xl mx-auto"
        >
          Transform your venture idea into reality. Apply to our program and get access to mentorship, resources, and a community of innovators.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="flex items-center justify-center gap-3 pt-2 flex-wrap"
        >
          <motion.span
            whileHover={{ scale: 1.05, y: -2 }}
            className="rounded-full border border-primary/30 bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground cursor-default flex items-center gap-1.5"
          >
            <Rocket className="h-3.5 w-3.5" />
            Innovation & Entrepreneurship Track
          </motion.span>
          <motion.span
            whileHover={{ scale: 1.05, y: -2 }}
            className="rounded-full border border-primary/30 bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground cursor-default flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI Innovation Track
          </motion.span>
        </motion.div>
      </section>

      {/* Access Cards */}
      <section className="container pb-16">
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            whileHover={{ y: -4 }}
          >
            <Card className="group hover:shadow-lg transition-shadow border-2 hover:border-primary/40 h-full">
              <CardContent className="pt-8 pb-8 px-8 text-center space-y-4">
                <motion.div
                  className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <GraduationCap className="h-7 w-7 text-primary" />
                </motion.div>
                <h2 className="font-heading font-bold text-xl">Participant Access</h2>
                <p className="text-sm text-muted-foreground">
                  LAU students and alumni — sign up or log in to submit your venture application.
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  <Link to="/signup">
                    <Button className="w-full gap-2 group/btn">
                      Apply Now <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                  <Link to="/login?role=participant">
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            whileHover={{ y: -4 }}
          >
            <Card className="group hover:shadow-lg transition-shadow border-2 hover:border-muted-foreground/30 h-full">
              <CardContent className="pt-8 pb-8 px-8 text-center space-y-4">
                <motion.div
                  className="mx-auto h-14 w-14 rounded-2xl bg-muted flex items-center justify-center"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <BookOpen className="h-7 w-7 text-muted-foreground" />
                </motion.div>
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
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 border-t">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-heading font-bold text-center mb-10"
        >
          How It Works
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { icon: Lightbulb, title: 'Submit Your Idea', desc: 'Share your venture concept with our review committee through a comprehensive application.' },
            { icon: Target, title: 'Expert Evaluation', desc: 'Applications are scored by experienced reviewers using rigorous weighted criteria.' },
            { icon: Award, title: 'Mentorship & Growth', desc: 'Accepted founders receive dedicated mentorship and support to grow their ventures.' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -5 }}
              className="text-center space-y-3 p-6 rounded-xl border bg-card hover:shadow-md transition-shadow"
            >
              <motion.div
                className="mx-auto h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <f.icon className="h-6 w-6 text-primary" />
              </motion.div>
              <h3 className="font-heading font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="container py-12 border-t">
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto text-center">
          {[
            { value: '2', label: 'Tracks' },
            { value: '6', label: 'Criteria' },
            { value: '∞', label: 'Potential' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="space-y-1"
            >
              <p className="text-3xl md:text-4xl font-heading font-bold text-primary">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 bg-card">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="container flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <img src={lauLogo} alt="LAU" className="h-10 object-contain opacity-70" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LAU Adnan Kassar School of Business — Innovation & Entrepreneurship Program
          </p>
        </motion.div>
      </footer>
    </div>
  );
}