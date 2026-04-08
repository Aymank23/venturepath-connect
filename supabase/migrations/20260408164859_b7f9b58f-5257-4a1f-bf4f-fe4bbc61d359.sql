
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('applicant', 'reviewer', 'mentor', 'admin');

-- Create application status enum
CREATE TYPE public.application_status AS ENUM ('draft', 'submitted', 'under_review', 'accepted', 'rejected', 'waitlisted');

-- Create applicant category enum
CREATE TYPE public.applicant_category AS ENUM ('aksob_student', 'lau_other', 'alumni', 'other');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  venture_title TEXT,
  venture_summary TEXT,
  motivation_statement TEXT,
  category applicant_category,
  alumni_graduation_year INTEGER,
  alumni_school TEXT,
  commitment_agreed BOOLEAN DEFAULT FALSE,
  status application_status NOT NULL DEFAULT 'draft',
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Team members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  resume_url TEXT,
  is_main_applicant BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Application documents table
CREATE TABLE public.application_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;

-- Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  problem_significance_score INTEGER CHECK (problem_significance_score BETWEEN 1 AND 5),
  innovation_potential_score INTEGER CHECK (innovation_potential_score BETWEEN 1 AND 5),
  feasibility_score INTEGER CHECK (feasibility_score BETWEEN 1 AND 5),
  team_capability_score INTEGER CHECK (team_capability_score BETWEEN 1 AND 5),
  motivation_commitment_score INTEGER CHECK (motivation_commitment_score BETWEEN 1 AND 5),
  sdg_impact_score INTEGER CHECK (sdg_impact_score BETWEEN 1 AND 5),
  weighted_total_score NUMERIC(5,2) GENERATED ALWAYS AS (
    (problem_significance_score * 0.25 +
     innovation_potential_score * 0.20 +
     feasibility_score * 0.15 +
     team_capability_score * 0.15 +
     motivation_commitment_score * 0.15 +
     sdg_impact_score * 0.10)
  ) STORED,
  reviewer_comments TEXT,
  review_status TEXT DEFAULT 'pending' CHECK (review_status IN ('pending', 'in_progress', 'completed')),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Mentorship records table
CREATE TABLE public.mentorship_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  mentorship_assigned BOOLEAN DEFAULT FALSE,
  mentor_name TEXT,
  mentorship_type TEXT,
  mentorship_start_date DATE,
  mentorship_end_date DATE,
  mentorship_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.mentorship_records ENABLE ROW LEVEL SECURITY;

-- Founder tracking table
CREATE TABLE public.founder_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  incubator_participation BOOLEAN DEFAULT FALSE,
  startup_registered BOOLEAN DEFAULT FALSE,
  startup_name TEXT,
  registration_location TEXT,
  funding_amount NUMERIC(12,2),
  investor_access_notes TEXT,
  alumni_support_notes TEXT,
  outcomes_notes TEXT,
  follow_up_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.founder_tracking ENABLE ROW LEVEL SECURITY;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mentorship_records_updated_at BEFORE UPDATE ON public.mentorship_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_founder_tracking_updated_at BEFORE UPDATE ON public.founder_tracking FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'applicant');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- RLS POLICIES

-- user_roles: users can read their own roles, admins can read all
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- applications
CREATE POLICY "Applicants can view own applications" ON public.applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Applicants can insert own applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Applicants can update own draft applications" ON public.applications FOR UPDATE USING (auth.uid() = user_id AND status = 'draft');
CREATE POLICY "Reviewers can view submitted applications" ON public.applications FOR SELECT USING (public.has_role(auth.uid(), 'reviewer') AND status != 'draft');
CREATE POLICY "Mentors can view accepted applications" ON public.applications FOR SELECT USING (public.has_role(auth.uid(), 'mentor') AND status = 'accepted');
CREATE POLICY "Admins can do anything with applications" ON public.applications FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- team_members: access through application ownership
CREATE POLICY "Applicants can manage own team members" ON public.team_members FOR ALL USING (
  EXISTS (SELECT 1 FROM public.applications WHERE id = application_id AND user_id = auth.uid())
);
CREATE POLICY "Reviewers can view team members" ON public.team_members FOR SELECT USING (
  public.has_role(auth.uid(), 'reviewer') AND EXISTS (SELECT 1 FROM public.applications WHERE id = application_id AND status != 'draft')
);
CREATE POLICY "Mentors can view team members" ON public.team_members FOR SELECT USING (
  public.has_role(auth.uid(), 'mentor') AND EXISTS (SELECT 1 FROM public.applications WHERE id = application_id AND status = 'accepted')
);
CREATE POLICY "Admins can manage all team members" ON public.team_members FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- application_documents
CREATE POLICY "Applicants can manage own documents" ON public.application_documents FOR ALL USING (
  EXISTS (SELECT 1 FROM public.applications WHERE id = application_id AND user_id = auth.uid())
);
CREATE POLICY "Reviewers can view documents" ON public.application_documents FOR SELECT USING (
  public.has_role(auth.uid(), 'reviewer')
);
CREATE POLICY "Admins can manage all documents" ON public.application_documents FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- reviews
CREATE POLICY "Reviewers can manage reviews" ON public.reviews FOR ALL USING (public.has_role(auth.uid(), 'reviewer'));
CREATE POLICY "Admins can manage all reviews" ON public.reviews FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- mentorship_records
CREATE POLICY "Mentors can view and update mentorship" ON public.mentorship_records FOR SELECT USING (public.has_role(auth.uid(), 'mentor'));
CREATE POLICY "Mentors can update mentorship" ON public.mentorship_records FOR UPDATE USING (public.has_role(auth.uid(), 'mentor'));
CREATE POLICY "Admins can manage mentorship" ON public.mentorship_records FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- founder_tracking
CREATE POLICY "Mentors can view founder tracking" ON public.founder_tracking FOR SELECT USING (public.has_role(auth.uid(), 'mentor'));
CREATE POLICY "Mentors can update founder tracking" ON public.founder_tracking FOR UPDATE USING (public.has_role(auth.uid(), 'mentor'));
CREATE POLICY "Admins can manage founder tracking" ON public.founder_tracking FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Storage policies
CREATE POLICY "Authenticated users can upload documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');
CREATE POLICY "Users can view own documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete own documents" ON storage.objects FOR DELETE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
