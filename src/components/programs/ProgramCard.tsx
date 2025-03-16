
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
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
      <CardHeader className="bg-primary/5 border-b">
        <CardTitle className="text-xl font-semibold text-primary">
          {program.name}
        </CardTitle>
        <CardDescription>
          Program Keahlian
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 flex-grow">
        <p className="text-gray-600 mb-4 text-sm sm:text-base">
          {program.description}
        </p>
        
        <div className="mb-4">
          <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Keahlian yang Dipelajari:</h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-1 text-xs sm:text-sm">
            {program.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Prospek Karir:</h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-1 text-xs sm:text-sm">
            {program.prospects.map((prospect, index) => (
              <li key={index}>{prospect}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t p-3 sm:p-4">
        <Button asChild className="w-full text-xs sm:text-sm">
          <Link to="/register">
            Daftar Sekarang <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProgramCard;
