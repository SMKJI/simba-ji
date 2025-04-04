
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { renderMarkdown } from '@/utils/markdown';

interface PageEditorProps {
  initialTitle: string;
  initialContent: string;
  onSave: (title: string, content: string) => void;
}

const PageEditor = ({ initialTitle, initialContent, onSave }: PageEditorProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [preview, setPreview] = useState('');
  const [activeTab, setActiveTab] = useState('write');

  useEffect(() => {
    if (activeTab === 'preview') {
      setPreview(renderMarkdown(content));
    }
  }, [content, activeTab]);

  const handleSave = () => {
    onSave(title, content);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">Title</label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Page title"
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-2">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="write" className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content (Markdown supported)"
            className="min-h-[300px] font-mono"
          />
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4">
          <div 
            className="min-h-[300px] p-4 border rounded-md prose max-w-none bg-white"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </TabsContent>
      </Tabs>
      
      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  );
};

export default PageEditor;
