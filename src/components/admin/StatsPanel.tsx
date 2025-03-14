
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const StatsPanel = () => {
  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b p-6">
        <CardTitle className="text-xl font-semibold text-primary">
          Statistik Pendaftaran
        </CardTitle>
        <CardDescription>
          Data statistik pendaftaran calon murid
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <p className="text-center text-lg">
              Visualisasi statistik pendaftaran akan ditampilkan di sini.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsPanel;
