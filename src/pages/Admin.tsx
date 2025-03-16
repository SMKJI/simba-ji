
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRegistrations } from '@/hooks/useRegistrations';
import StatCards from '@/components/admin/StatCards';
import ApplicantsTable from '@/components/admin/ApplicantsTable';
import GroupsManager from '@/components/admin/GroupsManager';
import StatsPanel from '@/components/admin/StatsPanel';
import { useToast } from '@/hooks/use-toast';
import NewAnnouncementForm from '@/components/content/NewAnnouncementForm';
import AnnouncementList from '@/components/content/AnnouncementList';
import { Announcement } from '@/components/content/AnnouncementItem';
import NewFaqForm from '@/components/content/NewFaqForm';
import FaqList from '@/components/content/FaqList';
import { Faq } from '@/components/content/FaqItem';
import ContentPreview from '@/components/content/ContentPreview';
import PageTitle from '@/components/ui/PageTitle';

// Mock content data
const MOCK_ANNOUNCEMENTS = [
  {
    id: 'a1',
    title: 'Pendaftaran Calon Murid Baru Telah Dibuka',
    content: 'SMKN 1 Kendal membuka pendaftaran calon murid baru untuk tahun ajaran 2023/2024. Pendaftaran dapat dilakukan secara online melalui website ini.',
    isActive: true,
    createdAt: '2023-06-01T08:00:00Z',
    updatedAt: '2023-06-01T08:00:00Z',
  },
  {
    id: 'a2',
    title: 'Informasi Program Keahlian',
    content: 'SMKN 1 Kendal menawarkan berbagai program keahlian seperti Teknik Komputer dan Jaringan, Rekayasa Perangkat Lunak, Multimedia, dan lainnya.',
    isActive: true,
    createdAt: '2023-06-02T09:30:00Z',
    updatedAt: '2023-06-02T09:30:00Z',
  },
  {
    id: 'a3',
    title: 'Jadwal Wawancara Calon Murid',
    content: 'Wawancara calon murid akan dilaksanakan pada tanggal 20-25 Juli 2023. Informasi lebih lanjut akan dikirimkan melalui email.',
    isActive: false,
    createdAt: '2023-06-05T14:15:00Z',
    updatedAt: '2023-06-05T14:15:00Z',
  },
];

const MOCK_FAQ = [
  {
    id: 'f1',
    question: 'Bagaimana cara mendaftar di SMKN 1 Kendal?',
    answer: 'Pendaftaran dapat dilakukan secara online melalui website ini. Isi formulir pendaftaran dengan lengkap dan benar, kemudian Anda akan menerima konfirmasi melalui email.',
    isActive: true,
    order: 1,
  },
  {
    id: 'f2',
    question: 'Apa saja persyaratan untuk mendaftar?',
    answer: 'Persyaratan untuk mendaftar meliputi: 1) Lulusan SMP/MTs atau sederajat, 2) Memiliki SKHUN, 3) Berusia maksimal 21 tahun, 4) Mengisi formulir pendaftaran dengan lengkap.',
    isActive: true,
    order: 2,
  },
  {
    id: 'f3',
    question: 'Kapan pengumuman hasil seleksi?',
    answer: 'Pengumuman hasil seleksi akan disampaikan melalui website dan email pada tanggal 30 Juli 2023.',
    isActive: true,
    order: 3,
  },
];

const Admin = () => {
  const { stats, loading, getApplicants, applicants } = useRegistrations();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [faqs, setFaqs] = useState<Faq[]>(MOCK_FAQ);
  const [previewContent, setPreviewContent] = useState<{ title: string; content: string } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Data Diperbarui",
        description: "Data telah berhasil diperbarui"
      });
    }, 1000);
  };

  // Announcement handlers
  const handleAnnouncementChange = (id: string, field: 'title' | 'content', value: string) => {
    setAnnouncements(prev => prev.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  const handleAddAnnouncement = (title: string, content: string) => {
    const newId = `a${Date.now()}`;
    setAnnouncements(prev => [
      {
        id: newId,
        title,
        content,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      ...prev
    ]);
  };

  const handleUpdateAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.map(a => 
      a.id === id ? { ...a, updatedAt: new Date().toISOString() } : a
    ));
  };

  const handleToggleAnnouncementStatus = (id: string) => {
    setAnnouncements(prev => prev.map(a => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    ));
    
    toast({
      title: 'Status Diperbarui',
      description: 'Status pengumuman telah berhasil diperbarui',
    });
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    
    toast({
      title: 'Pengumuman Dihapus',
      description: 'Pengumuman telah berhasil dihapus',
    });
  };

  // FAQ handlers
  const handleFaqChange = (id: string, field: 'question' | 'answer', value: string) => {
    setFaqs(prev => prev.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  const handleAddFaq = (question: string, answer: string) => {
    const newId = `f${Date.now()}`;
    const maxOrder = Math.max(...faqs.map(f => f.order), 0);
    
    setFaqs(prev => [
      ...prev,
      {
        id: newId,
        question,
        answer,
        isActive: true,
        order: maxOrder + 1,
      }
    ]);
  };

  const handleUpdateFaq = (id: string) => {
    // Just used for callback, actual update is done in handleFaqChange
    toast({
      title: 'FAQ Diperbarui',
      description: 'FAQ telah berhasil diperbarui',
    });
  };

  const handleToggleFaqStatus = (id: string) => {
    setFaqs(prev => prev.map(f => 
      f.id === id ? { ...f, isActive: !f.isActive } : f
    ));
    
    toast({
      title: 'Status Diperbarui',
      description: 'Status FAQ telah berhasil diperbarui',
    });
  };

  const handleDeleteFaq = (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
    
    toast({
      title: 'FAQ Dihapus',
      description: 'FAQ telah berhasil dihapus',
    });
  };

  const handlePreview = (title: string, content: string) => {
    setPreviewContent({ title, content });
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <PageTitle 
            title="Admin Dashboard"
            description="Sistem Penerimaan Murid Baru (SPMB) SMKN 1 Kendal"
            className="mb-0" 
          />
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
        
        <StatCards stats={stats} />
        
        <Tabs defaultValue="applicants" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="applicants" className="text-base">Daftar Pendaftar</TabsTrigger>
            <TabsTrigger value="groups" className="text-base">Grup WhatsApp</TabsTrigger>
            <TabsTrigger value="content" className="text-base">Konten</TabsTrigger>
            <TabsTrigger value="stats" className="text-base">Statistik</TabsTrigger>
          </TabsList>
          
          <TabsContent value="applicants" className="animate-fade-in">
            <ApplicantsTable applicants={applicants} />
          </TabsContent>
          
          <TabsContent value="groups" className="animate-fade-in">
            <GroupsManager groups={stats.groups} />
          </TabsContent>
          
          <TabsContent value="content" className="animate-fade-in">
            <Tabs defaultValue="announcements" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="announcements" className="text-base">Pengumuman</TabsTrigger>
                <TabsTrigger value="faq" className="text-base">FAQ</TabsTrigger>
              </TabsList>
              
              <TabsContent value="announcements" className="animate-fade-in">
                <NewAnnouncementForm 
                  onAdd={handleAddAnnouncement} 
                  onPreview={handlePreview} 
                />
                
                <AnnouncementList 
                  announcements={announcements}
                  onUpdate={handleAnnouncementChange}
                  onUpdateStatus={handleToggleAnnouncementStatus}
                  onSave={handleUpdateAnnouncement}
                  onDelete={handleDeleteAnnouncement}
                />
              </TabsContent>
              
              <TabsContent value="faq" className="animate-fade-in">
                <NewFaqForm onAdd={handleAddFaq} />
                
                <FaqList 
                  faqs={faqs}
                  onUpdate={handleFaqChange}
                  onUpdateStatus={handleToggleFaqStatus}
                  onSave={handleUpdateFaq}
                  onDelete={handleDeleteFaq}
                />
              </TabsContent>
            </Tabs>
            
            {previewContent && (
              <ContentPreview 
                title={previewContent.title}
                content={previewContent.content}
                onClose={() => setPreviewContent(null)}
              />
            )}
          </TabsContent>
          
          <TabsContent value="stats" className="animate-fade-in">
            <StatsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Admin;
