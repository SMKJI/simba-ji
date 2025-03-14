
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContentPreviewProps {
  title: string;
  content: string;
  onClose: () => void;
}

const ContentPreview = ({ title, content, onClose }: ContentPreviewProps) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Preview</h3>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default ContentPreview;
