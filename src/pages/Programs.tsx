
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Program, programData } from '@/data/programData';
import PageTitle from '@/components/ui/PageTitle';
import ProgramCard from '@/components/programs/ProgramCard';

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    // Replace this with your actual data fetching logic
    const fetchPrograms = async () => {
      try {
        // We'll use the programData from our data file
        setPrograms(programData);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="grid items-center gap-6 pt-10 pb-12 md:py-10">
        <PageTitle 
          title="Program Keahlian" 
          description="Lihat program keahlian yang tersedia di SMKN 1 Kendal."
        />
        
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard 
              key={program.id} 
              program={program} 
            />
          ))}
        </div>
        
        <div className="flex justify-center mt-8">
          <Button asChild>
            <Link to="/">Kembali ke Beranda</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Programs;
