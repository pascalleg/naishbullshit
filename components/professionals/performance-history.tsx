import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PerformanceHistoryProps {
  professionalId: string;
}

export function PerformanceHistory({ professionalId }: PerformanceHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance History</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Performance history for professional ID: {professionalId}</p>
        {/* TODO: Implement actual performance history display */}
      </CardContent>
    </Card>
  );
} 