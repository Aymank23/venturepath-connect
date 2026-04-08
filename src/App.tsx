import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Applicant
import ApplicantDashboard from "./pages/applicant/Dashboard";
import ApplicationForm from "./pages/applicant/ApplicationForm";
import Documents from "./pages/applicant/Documents";
import Status from "./pages/applicant/Status";

// Reviewer
import ReviewerDashboard from "./pages/reviewer/Dashboard";
import ReviewerApplications from "./pages/reviewer/Applications";
import ReviewApplication from "./pages/reviewer/ReviewApplication";

// Admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminApplications from "./pages/admin/Applications";
import AdminApplicationDetail from "./pages/admin/ApplicationDetail";
import AdminDecisions from "./pages/admin/Decisions";
import AdminReviews from "./pages/admin/Reviews";
import AdminMentorship from "./pages/admin/Mentorship";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";

// Mentor
import MentorDashboard from "./pages/mentor/Dashboard";
import MentorParticipants from "./pages/mentor/Participants";
import MentorLogs from "./pages/mentor/Logs";
import MentorOutcomes from "./pages/mentor/Outcomes";

const queryClient = new QueryClient();

function RoleDashboardRedirect() {
  const { activeRole, loading } = useAuth();
  if (loading) return null;
  switch (activeRole) {
    case 'admin': return <Navigate to="/app/admin" replace />;
    case 'reviewer': return <Navigate to="/app/reviewer" replace />;
    case 'mentor': return <Navigate to="/app/mentor" replace />;
    default: return <ApplicantDashboard />;
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/app" element={<AppLayout />}>
              <Route path="dashboard" element={<RoleDashboardRedirect />} />
              
              {/* Applicant */}
              <Route path="application" element={<ApplicationForm />} />
              <Route path="documents" element={<Documents />} />
              <Route path="status" element={<Status />} />

              {/* Reviewer */}
              <Route path="reviewer" element={<ReviewerDashboard />} />
              <Route path="reviewer/applications" element={<ReviewerApplications />} />
              <Route path="reviewer/applications/:id" element={<ReviewApplication />} />

              {/* Admin */}
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/applications" element={<AdminApplications />} />
              <Route path="admin/applications/:id" element={<AdminApplicationDetail />} />
              <Route path="admin/decisions" element={<AdminDecisions />} />
              <Route path="admin/reviews" element={<AdminReviews />} />
              <Route path="admin/mentorship" element={<AdminMentorship />} />
              <Route path="admin/reports" element={<AdminReports />} />
              <Route path="admin/settings" element={<AdminSettings />} />

              {/* Mentor */}
              <Route path="mentor" element={<MentorDashboard />} />
              <Route path="mentor/participants" element={<MentorParticipants />} />
              <Route path="mentor/logs" element={<MentorLogs />} />
              <Route path="mentor/outcomes" element={<MentorOutcomes />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
