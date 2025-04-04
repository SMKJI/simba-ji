import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Program } from '@/data/programData';

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    // Replace this with your actual data fetching logic
    const fetchPrograms = async () => {
      try {
        // Simulate fetching data from an API or database
        const programData = [
          {
            id: "1",
            title: "Rekayasa Perangkat Lunak",
            description: "Program keahlian yang mempelajari dan mendalami cara-cara pengembangan perangkat lunak.",
            imageUrl: "/lovable-uploads/a99f791a-889f-446a-894c-09442c2d1f8f.png",
            prospects: "Pengembang Perangkat Lunak, Analis Sistem, Konsultan TI"
          },
          {
            id: "2",
            title: "Teknik Komputer dan Jaringan",
            description: "Program keahlian yang mempelajari tentang cara merakit komputer, instalasi program, jaringan komputer, dan lain-lain.",
            imageUrl: "/lovable-uploads/59299995-348a-496b-891a-595c18b49599.png",
            prospects: "Teknisi Komputer, Administrator Jaringan, Keamanan Jaringan"
          },
          {
            id: "3",
            title: "Multimedia",
            description: "Program keahlian yang mempelajari tentang desain grafis, animasi, audio, video, dan interaktif media.",
            imageUrl: "/lovable-uploads/99993995-4459-4794-899a-69494994a494.png",
            prospects: "Desainer Grafis, Animator, Editor Video"
          },
          {
            id: "4",
            title: "Otomatisasi dan Tata Kelola Perkantoran",
            description: "Program keahlian yang mempelajari tentang administrasi perkantoran, korespondensi, kearsipan, dan penggunaan teknologi perkantoran.",
            imageUrl: "/lovable-uploads/09090909-5454-4545-899b-78787878c78c.png",
            prospects: "Staf Administrasi, Sekretaris, Resepsionis"
          },
          {
            id: "5",
            title: "Akuntansi dan Keuangan Lembaga",
            description: "Program keahlian yang mempelajari tentang akuntansi, keuangan, perpajakan, dan pengelolaan keuangan lembaga.",
            imageUrl: "/lovable-uploads/11111111-6565-4646-899c-90909090d90d.png",
            prospects: "Akuntan, Staf Keuangan, Auditor"
          },
          {
            id: "6",
            title: "Bisnis Daring dan Pemasaran",
            description: "Program keahlian yang mempelajari tentang bisnis online, pemasaran digital, e-commerce, dan strategi pemasaran online.",
            imageUrl: "/lovable-uploads/22222222-7676-4747-899d-12121212e12e.png",
            prospects: "Spesialis Pemasaran Digital, Manajer E-commerce, Analis Pemasaran"
          }
        ];

        setPrograms(programData);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <Shell>
      <section className="container grid items-center gap-6 pt-20 pb-12 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            Program Keahlian
          </h1>
          <p className="max-w-[700px] text-gray-500 md:text-lg">
            Lihat program keahlian yang tersedia di SMKN 1 Kendal.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {programs.map((program) => (
            <Card key={program.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <CardHeader className="p-4">
                <CardTitle className="text-lg font-semibold">{program.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={program.imageUrl}
                    alt={program.title}
                    className="object-cover w-full h-full rounded-md"
                  />
                </div>
                <CardDescription className="text-sm text-gray-600 mt-2">
                  {program.description}
                </CardDescription>
                <div className="mt-3">
                  <h4 className="text-sm font-semibold">Prospek Karir:</h4>
                  <p className="text-xs text-gray-500">{program.prospects}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
          <Button asChild>
            <Link to="/">Kembali ke Beranda</Link>
          </Button>
        </div>
      </section>
    </Shell>
  );
};

export default Programs;
