## Phase 1: Foundation
1. **Design System** — Green-based premium palette, typography, tokens in index.css + tailwind.config.ts
2. **Database Schema** — All tables: applications, team_members, application_documents, reviews, mentorship_records, founder_tracking + user_roles + profiles
3. **Auth Setup** — Email/password signup for applicants, shared accounts for reviewer/mentor/admin
4. **Role-based routing** — Protected routes per role, role-based navigation

## Phase 2: Applicant Flow
5. **Applicant signup/login** — Registration with auto-applicant role
6. **Application form** — Multi-step: team info, venture info, document uploads, commitment, review & submit
7. **Draft/submit workflow** — Save draft, continue later, final submission with lock
8. **Applicant dashboard** — Status, progress, missing items

## Phase 3: Reviewer Flow  
9. **Reviewer dashboard** — Stats cards, submitted applications list
10. **Scoring form** — 6 weighted criteria (1-5), auto-calculated total, comments
11. **Application detail view** — Read-only applicant data + documents + scoring

## Phase 4: Admin Flow
12. **Admin dashboard** — All stats, status distribution, review completion
13. **Application management** — Status changes (accept/reject/waitlist), decision management
14. **Mentorship assignment** — Assign mentors to accepted applications
15. **Reports** — Basic analytics with charts

## Phase 5: Mentor Flow
16. **Mentor dashboard** — Assigned participants, active mentorships
17. **Mentorship logs** — Notes, meetings, outcome tracking
18. **Founder tracking** — Expandable structure for incubator, funding, etc.

## Phase 6: Seed Data & Polish
19. **Seed data** — Sample applications across all statuses, reviews, mentorship records
20. **Polish** — Empty states, validation feedback, mobile responsiveness

**Design Direction:** Premium green (#059669 primary), neutral slate backgrounds, clean cards with soft shadows, strong typography with Outfit headings + Inter body.