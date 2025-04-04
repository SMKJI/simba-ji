
import MainLayout from '@/components/layouts/MainLayout';
import ContentDisplay from '@/components/content/ContentDisplay';
import { programs } from '@/data/programData';
import { Card, CardContent } from '@/components/ui/card';

const Programs = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <ContentDisplay slug="programs" className="mx-auto max-w-3xl" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {programs.map((program) => (
            <Card key={program.id} className="overflow-hidden border shadow-md hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <img 
                  src={program.image} 
                  alt={program.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-5">
                <h3 className="text-xl font-bold mb-2">{program.name}</h3>
                <p className="text-muted-foreground mb-4">{program.description}</p>
                <div className="flex flex-wrap gap-2">
                  {program.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Programs;
