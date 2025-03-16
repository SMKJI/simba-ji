
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Program } from '@/data/programData';

interface ProgramCardProps {
  program: Program;
}

const ProgramCard = ({ program }: ProgramCardProps) => {
  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
      <CardHeader className="bg-primary/5 border-b">
        <CardTitle className="text-xl font-semibold text-primary">
          {program.name}
        </CardTitle>
        <CardDescription>
          Program Keahlian
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-gray-600 mb-4">
          {program.description}
        </p>
        
        <div className="mb-4">
          <h3 className="font-medium text-gray-900 mb-2">Keahlian yang Dipelajari:</h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            {program.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Prospek Karir:</h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            {program.prospects.map((prospect, index) => (
              <li key={index}>{prospect}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t p-4">
        <Button asChild className="w-full">
          <Link to="/register">
            Daftar Sekarang <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProgramCard;
