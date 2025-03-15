
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const programs = [
  {
    id: 'tkj',
    name: 'Teknik Komputer dan Jaringan',
    description: 'Program keahlian yang mempelajari tentang instalasi jaringan komputer, perakitan komputer, dan troubleshooting perangkat keras & jaringan.',
    skills: ['Instalasi jaringan', 'Perakitan komputer', 'Troubleshooting', 'Network security'],
    prospects: ['IT Support', 'Network Administrator', 'System Administrator', 'Network Engineer']
  },
  {
    id: 'rpl',
    name: 'Rekayasa Perangkat Lunak',
    description: 'Program keahlian yang mempelajari tentang pengembangan perangkat lunak, pemrograman, dan manajemen basis data.',
    skills: ['Pemrograman', 'Basis Data', 'Web Development', 'Mobile Development'],
    prospects: ['Programmer', 'Software Developer', 'Web Developer', 'Database Administrator']
  },
  {
    id: 'mm',
    name: 'Multimedia',
    description: 'Program keahlian yang mempelajari tentang desain grafis, animasi, editing video, dan pengembangan media interaktif.',
    skills: ['Desain Grafis', 'Animasi', 'Video Editing', 'Photography'],
    prospects: ['Graphic Designer', 'Video Editor', 'Animator', 'Content Creator']
  },
  {
    id: 'akl',
    name: 'Akuntansi dan Keuangan Lembaga',
    description: 'Program keahlian yang mempelajari tentang akuntansi, keuangan, perpajakan, dan aplikasi komputer akuntansi.',
    skills: ['Akuntansi Dasar', 'Perpajakan', 'Komputer Akuntansi', 'Administrasi Keuangan'],
    prospects: ['Staff Accounting', 'Tax Consultant', 'Finance Staff', 'Auditor']
  },
  {
    id: 'otkp',
    name: 'Otomatisasi dan Tata Kelola Perkantoran',
    description: 'Program keahlian yang mempelajari tentang administrasi perkantoran, kesekretariatan, dan manajemen kantor.',
    skills: ['Administrasi Perkantoran', 'Kesekretariatan', 'Korespondensi', 'Kearsipan'],
    prospects: ['Secretary', 'Administrative Staff', 'Office Manager', 'Customer Service']
  },
  {
    id: 'bdp',
    name: 'Bisnis Daring dan Pemasaran',
    description: 'Program keahlian yang mempelajari tentang pemasaran, bisnis online, manajemen bisnis, dan komunikasi pemasaran.',
    skills: ['Digital Marketing', 'E-commerce', 'Sales', 'Customer Relationship'],
    prospects: ['Digital Marketer', 'Online Shop Owner', 'Sales Executive', 'Marketing Staff']
  }
];

const Programs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Program Keahlian
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            SMKN 1 Kendal menawarkan berbagai program keahlian berkualitas untuk menyiapkan siswa menghadapi dunia kerja dan industri
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {programs.map((program) => (
            <Card key={program.id} className="border-0 shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
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
          ))}
        </div>
        
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Masih punya pertanyaan tentang program keahlian kami?
          </p>
          <Button asChild variant="outline">
            <Link to="/faq">
              Lihat FAQ
            </Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Programs;
