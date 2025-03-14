
import { useState } from 'react';
import { Check, Pencil, Trash, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AnnouncementItemProps {
  announcement: Announcement;
  onUpdate: (id: string, field: 'title' | 'content', value: string) => void;
  onUpdateStatus: (id: string) => void;
  onSave: (id: string) => void;
  onDelete: (id: string) => void;
}

const AnnouncementItem = ({ 
  announcement, 
  onUpdate, 
  onUpdateStatus, 
  onSave, 
  onDelete 
}: AnnouncementItemProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    onSave(announcement.id);
    setIsEditing(false);
    toast({
      title: 'Pengumuman Diperbarui',
      description: 'Pengumuman telah berhasil diperbarui',
    });
  };

  return (
    <Card className={`border-0 shadow-md rounded-xl overflow-hidden ${!announcement.isActive ? 'opacity-70' : ''}`}>
      <CardHeader className="bg-primary/5 border-b p-4 flex-row items-start justify-between space-y-0">
        {isEditing ? (
          <Input 
            className="font-semibold text-lg mb-1"
            value={announcement.title}
            onChange={(e) => onUpdate(announcement.id, 'title', e.target.value)}
          />
        ) : (
          <CardTitle className="text-lg font-semibold">
            {announcement.title}
          </CardTitle>
        )}
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleCancel}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                size="sm"
                onClick={handleSave}
              >
                <Check className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onUpdateStatus(announcement.id)}
              >
                {announcement.isActive ? 'Nonaktifkan' : 'Aktifkan'}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleEdit}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onDelete(announcement.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isEditing ? (
          <Textarea 
            className="min-h-[100px]"
            value={announcement.content}
            onChange={(e) => onUpdate(announcement.id, 'content', e.target.value)}
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
  );
};

export default AnnouncementItem;
