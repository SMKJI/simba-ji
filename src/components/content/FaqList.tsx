
import FaqItem, { Faq } from './FaqItem';

interface FaqListProps {
  faqs: Faq[];
  onUpdate: (id: string, field: 'question' | 'answer', value: string) => void;
  onUpdateStatus: (id: string) => void;
  onSave: (id: string) => void;
  onDelete: (id: string) => void;
}

const FaqList = ({ faqs, onUpdate, onUpdateStatus, onSave, onDelete }: FaqListProps) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {faqs.map((faq) => (
        <FaqItem 
          key={faq.id}
          faq={faq}
          onUpdate={onUpdate}
          onUpdateStatus={onUpdateStatus}
          onSave={onSave}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default FaqList;
