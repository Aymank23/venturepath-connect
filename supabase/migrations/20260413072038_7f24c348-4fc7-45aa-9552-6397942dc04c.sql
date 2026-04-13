
-- Admins can delete team_members
CREATE POLICY "Admins can delete team members"
ON public.team_members FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete reviews
CREATE POLICY "Admins can delete reviews"
ON public.reviews FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete mentorship_records
CREATE POLICY "Admins can delete mentorship records"
ON public.mentorship_records FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete founder_tracking
CREATE POLICY "Admins can delete founder tracking"
ON public.founder_tracking FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete applications
CREATE POLICY "Admins can delete applications"
ON public.applications FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Storage: Admins can read all documents
CREATE POLICY "Admins can read all documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'documents' AND public.has_role(auth.uid(), 'admin'));

-- Storage: Reviewers can read all documents
CREATE POLICY "Reviewers can read all documents"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'documents' AND public.has_role(auth.uid(), 'reviewer'));
