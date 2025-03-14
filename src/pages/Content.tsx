
import { useState } from 'react';
import { Edit, Save, Trash, FileText, Pencil, Eye, Check, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

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

const Content = () => {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
  const [faqs, setFaqs] = useState(MOCK_FAQ);
  const [editingAnnouncement, setEditingAnnouncement] = useState<string | null>(null);
  const [editingFaq, setEditingFaq] = useState<string | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
  });
  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: '',
  });
  const [previewContent, setPreviewContent] = useState<{ title: string; content: string } | null>(null);

  // Announcement handlers
  const handleAnnouncementChange = (id: string, field: 'title' | 'content', value: string) => {
    setAnnouncements(prev => prev.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast({
        title: 'Form tidak lengkap',
        description: 'Judul dan konten pengumuman harus diisi',
        variant: 'destructive',
      });
      return;
    }
    
    const newId = `a${Date.now()}`;
    setAnnouncements(prev => [
      {
        id: newId,
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      ...prev
    ]);
    
    setNewAnnouncement({ title: '', content: '' });
    
    toast({
      title: 'Pengumuman Ditambahkan',
      description: 'Pengumuman baru telah berhasil ditambahkan',
    });
  };

  const handleUpdateAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.map(a => 
      a.id === id ? { ...a, updatedAt: new Date().toISOString() } : a
    ));
    
    setEditingAnnouncement(null);
    
    toast({
      title: 'Pengumuman Diperbarui',
      description: 'Pengumuman telah berhasil diperbarui',
    });
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

  const handleAddFaq = () => {
    if (!newFaq.question || !newFaq.answer) {
      toast({
        title: 'Form tidak lengkap',
        description: 'Pertanyaan dan jawaban harus diisi',
        variant: 'destructive',
      });
      return;
    }
    
    const newId = `f${Date.now()}`;
    const maxOrder = Math.max(...faqs.map(f => f.order), 0);
    
    setFaqs(prev => [
      ...prev,
      {
        id: newId,
        question: newFaq.question,
        answer: newFaq.answer,
        isActive: true,
        order: maxOrder + 1,
      }
    ]);
    
    setNewFaq({ question: '', answer: '' });
    
    toast({
      title: 'FAQ Ditambahkan',
      description: 'FAQ baru telah berhasil ditambahkan',
    });
  };

  const handleUpdateFaq = (id: string) => {
    setEditingFaq(null);
    
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Content Management
              </h1>
            </div>
            
            <Tabs defaultValue="announcements" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="announcements" className="text-base">Pengumuman</TabsTrigger>
                <TabsTrigger value="faq" className="text-base">FAQ</TabsTrigger>
              </TabsList>
              
              <TabsContent value="announcements" className="animate-fade-in">
                <Card className="border-0 shadow-lg rounded-xl overflow-hidden mb-8">
                  <CardHeader className="bg-primary/5 border-b p-6">
                    <CardTitle className="text-xl font-semibold text-primary">
                      Tambah Pengumuman Baru
                    </CardTitle>
                    <CardDescription>
                      Buat pengumuman baru untuk ditampilkan di halaman utama
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Judul</label>
                        <Input 
                          placeholder="Masukkan judul pengumuman" 
                          value={newAnnouncement.title}
                          onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Konten</label>
                        <Textarea 
                          placeholder="Masukkan isi pengumuman" 
                          className="min-h-[120px]"
                          value={newAnnouncement.content}
                          onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline"
                          onClick={() => setPreviewContent(newAnnouncement)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                        <Button onClick={handleAddAnnouncement}>
                          <FileText className="mr-2 h-4 w-4" />
                          Tambah Pengumuman
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 gap-6">
                  {announcements.map((announcement) => (
                    <Card key={announcement.id} className={`border-0 shadow-md rounded-xl overflow-hidden ${!announcement.isActive ? 'opacity-70' : ''}`}>
                      <CardHeader className="bg-primary/5 border-b p-4 flex-row items-start justify-between space-y-0">
                        {editingAnnouncement === announcement.id ? (
                          <Input 
                            className="font-semibold text-lg mb-1"
                            value={announcement.title}
                            onChange={(e) => handleAnnouncementChange(announcement.id, 'title', e.target.value)}
                          />
                        ) : (
                          <CardTitle className="text-lg font-semibold">
                            {announcement.title}
                          </CardTitle>
                        )}
                        <div className="flex gap-2">
                          {editingAnnouncement === announcement.id ? (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setEditingAnnouncement(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleUpdateAnnouncement(announcement.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleToggleAnnouncementStatus(announcement.id)}
                              >
                                {announcement.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setEditingAnnouncement(announcement.id)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteAnnouncement(announcement.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        {editingAnnouncement === announcement.id ? (
                          <Textarea 
                            className="min-h-[100px]"
                            value={announcement.content}
                            onChange={(e) => handleAnnouncementChange(announcement.id, 'content', e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{announcement.content}</p>
                        )}
                        <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                          <span>Dibuat: {new Date(announcement.createdAt).toLocaleDateString('id-ID')}</span>
                          <span>Diperbarui: {new Date(announcement.updatedAt).toLocaleDateString('id-ID')}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="faq" className="animate-fade-in">
                <Card className="border-0 shadow-lg rounded-xl overflow-hidden mb-8">
                  <CardHeader className="bg-primary/5 border-b p-6">
                    <CardTitle className="text-xl font-semibold text-primary">
                      Tambah FAQ Baru
                    </CardTitle>
                    <CardDescription>
                      Tambahkan pertanyaan dan jawaban untuk FAQ
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Pertanyaan</label>
                        <Input 
                          placeholder="Masukkan pertanyaan" 
                          value={newFaq.question}
                          onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Jawaban</label>
                        <Textarea 
                          placeholder="Masukkan jawaban" 
                          className="min-h-[120px]"
                          value={newFaq.answer}
                          onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleAddFaq}>
                          <FileText className="mr-2 h-4 w-4" />
                          Tambah FAQ
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 gap-6">
                  {faqs.map((faq) => (
                    <Card key={faq.id} className={`border-0 shadow-md rounded-xl overflow-hidden ${!faq.isActive ? 'opacity-70' : ''}`}>
                      <CardHeader className="bg-primary/5 border-b p-4 flex-row items-start justify-between space-y-0">
                        {editingFaq === faq.id ? (
                          <Input 
                            className="font-semibold text-lg mb-1"
                            value={faq.question}
                            onChange={(e) => handleFaqChange(faq.id, 'question', e.target.value)}
                          />
                        ) : (
                          <CardTitle className="text-lg font-semibold">
                            {faq.question}
                          </CardTitle>
                        )}
                        <div className="flex gap-2">
                          {editingFaq === faq.id ? (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setEditingFaq(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleUpdateFaq(faq.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleToggleFaqStatus(faq.id)}
                              >
                                {faq.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setEditingFaq(faq.id)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteFaq(faq.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        {editingFaq === faq.id ? (
                          <Textarea 
                            className="min-h-[100px]"
                            value={faq.answer}
                            onChange={(e) => handleFaqChange(faq.id, 'answer', e.target.value)}
                          />
                        ) : (
                          <p className="text-sm">{faq.answer}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            {previewContent && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Preview</h3>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setPreviewContent(null)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h2 className="text-xl font-bold mb-4">{previewContent.title}</h2>
                    <p className="whitespace-pre-wrap">{previewContent.content}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Content;
