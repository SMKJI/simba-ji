
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { renderMarkdown } from '@/utils/markdown';

interface ContentDisplayProps {
  title: string;
  content: string;
}

const ContentDisplay = ({ title, content }: ContentDisplayProps) => {
  const [renderedContent, setRenderedContent] = useState<string>('');

  useEffect(() => {
    setRenderedContent(renderMarkdown(content));
  }, [content]);

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      </CardContent>
    </Card>
  );
};

export default ContentDisplay;
