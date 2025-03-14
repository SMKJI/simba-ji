
import { useState } from 'react';
import { Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface NewAnnouncementFormProps {
  onAdd: (title: string, content: string) => void;
  onPreview: (title: string, content: string) => void;
}

const NewAnnouncementForm = ({ onAdd, onPreview }: NewAnnouncementFormProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!title || !content) {
      toast({
        title: 'Form tidak lengkap',
        description: 'Judul dan konten pengumuman harus diisi',
        variant: 'destructive',
      });
      return;
    }
    
    onAdd(title, content);
    setTitle('');
    setContent('');
    
    toast({
      title: 'Pengumuman Ditambahkan',
      description: 'Pengumuman baru telah berhasil ditambahkan',
    });
  };

  return (
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Konten</label>
            <Textarea 
              placeholder="Masukkan isi pengumuman" 
              className="min-h-[120px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline"
              onClick={() => onPreview(title, content)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button onClick={handleSubmit}>
              <FileText className="mr-2 h-4 w-4" />
              Tambah Pengumuman
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewAnnouncementForm;
