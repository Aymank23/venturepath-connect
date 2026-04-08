import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminSettings() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading">Settings</h1>
        <p className="text-muted-foreground">Platform configuration</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="font-heading text-lg">Application Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Application deadline management and scoring configuration will be available in future updates.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 border rounded-lg">
              <p className="font-medium">Scoring Criteria</p>
              <ul className="text-muted-foreground mt-2 space-y-1">
                <li>Problem Significance — 25%</li>
                <li>Innovation Potential — 20%</li>
                <li>Feasibility — 15%</li>
                <li>Team Capability — 15%</li>
                <li>Motivation & Commitment — 15%</li>
                <li>SDG & Impact — 10%</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-medium">Application Statuses</p>
              <ul className="text-muted-foreground mt-2 space-y-1">
                <li>Draft → Submitted → Under Review</li>
                <li>→ Accepted / Rejected / Waitlisted</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
