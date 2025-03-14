
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Group } from '@/hooks/useRegistrations';

interface GroupsManagerProps {
  groups: Group[];
}

const GroupsManager = ({ groups }: GroupsManagerProps) => {
  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b p-6">
        <CardTitle className="text-xl font-semibold text-primary">
          Manajemen Grup WhatsApp
        </CardTitle>
        <CardDescription>
          Kelola grup WhatsApp untuk calon murid
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{group.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {group.count} pendaftar dari 1000 kapasitas
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Lihat Link
                  </Button>
                  <Button size="sm" variant={group.isFull ? "secondary" : "outline"}>
                    {group.isFull ? 'Penuh' : 'Tersedia'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupsManager;
