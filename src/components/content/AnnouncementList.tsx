
import AnnouncementItem, { Announcement } from './AnnouncementItem';

interface AnnouncementListProps {
  announcements: Announcement[];
  onUpdate: (id: string, field: 'title' | 'content', value: string) => void;
  onUpdateStatus: (id: string) => void;
  onSave: (id: string) => void;
  onDelete: (id: string) => void;
}

const AnnouncementList = ({ 
  announcements, 
  onUpdate, 
  onUpdateStatus, 
  onSave, 
  onDelete 
}: AnnouncementListProps) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {announcements.map((announcement) => (
        <AnnouncementItem 
          key={announcement.id}
          announcement={announcement}
          onUpdate={onUpdate}
          onUpdateStatus={onUpdateStatus}
          onSave={onSave}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default AnnouncementList;
