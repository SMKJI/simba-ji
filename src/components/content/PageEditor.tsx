
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bold, Italic, List, ListOrdered, AlignLeft,
  AlignCenter, AlignRight, Heading1, Heading2,
  Link, Image, FileImage, Undo, Redo,
  Code, Quote
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PageEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const PageEditor = ({ content, onChange }: PageEditorProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content, showPreview]);

  const handleButtonClick = (tag: string, placeholder?: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText = '';
    
    switch(tag) {
      case 'b':
        newText = `**${selectedText || 'bold text'}**`;
        break;
      case 'i':
        newText = `*${selectedText || 'italic text'}*`;
        break;
      case 'h1':
        newText = `# ${selectedText || 'Heading 1'}\n`;
        break;
      case 'h2':
        newText = `## ${selectedText || 'Heading 2'}\n`;
        break;
      case 'li':
        newText = `- ${selectedText || 'List item'}\n`;
        break;
      case 'ol':
        newText = `1. ${selectedText || 'Ordered list item'}\n`;
        break;
      case 'link':
        newText = `[${selectedText || 'Link text'}](https://example.com)`;
        break;
      case 'img':
        newText = `![${selectedText || 'Image alt text'}](image-url)`;
        break;
      case 'code':
        newText = `\`\`\`\n${selectedText || 'Code block'}\n\`\`\``;
        break;
      case 'quote':
        newText = `> ${selectedText || 'Blockquote'}\n`;
        break;
      case 'left':
        newText = `<div style="text-align: left">${selectedText || 'Left aligned text'}</div>`;
        break;
      case 'center':
        newText = `<div style="text-align: center">${selectedText || 'Center aligned text'}</div>`;
        break;
      case 'right':
        newText = `<div style="text-align: right">${selectedText || 'Right aligned text'}</div>`;
        break;
      default:
        newText = selectedText;
    }
    
    const newContent = content.substring(0, start) + newText + content.substring(end);
    onChange(newContent);
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + newText.length;
      textarea.selectionEnd = start + newText.length;
    }, 0);
  };

  const handleUploadImage = async (file: File) => {
    if (!file) return;
    
    setUploadingImage(true);
    
    try {
      // Upload to Supabase storage
      const filename = `${Date.now()}-${file.name}`;
      const filePath = `page-images/${filename}`;
      
      const { data, error } = await supabase.storage
        .from('content')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('content')
        .getPublicUrl(filePath);
      
      // Insert into content
      if (textareaRef.current) {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        const imageMarkdown = `![${file.name}](${publicUrl})`;
        const newContent = content.substring(0, start) + imageMarkdown + content.substring(end);
        onChange(newContent);
        
        toast({
          title: 'Image uploaded',
          description: 'Image has been uploaded and inserted',
        });
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload error',
        description: error.message || 'Failed to upload image',
        variant: 'destructive'
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadImage(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 bg-background border rounded-md p-2 flex flex-wrap gap-1">
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={() => handleButtonClick('b')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={() => handleButtonClick('i')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={() => handleButtonClick('h1')}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={() => handleButtonClick('h2')}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={() => handleButtonClick('li')}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={() => handleButtonClick('ol')}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={() => handleButtonClick('code')}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={() => handleButtonClick('quote')}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1"></div>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={() => handleButtonClick('left')}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={() => handleButtonClick('center')}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={() => handleButtonClick('right')}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1"></div>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={() => handleButtonClick('link')}
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={triggerFileInput}
          title="Upload Image"
          disabled={uploadingImage}
        >
          {uploadingImage ? (
            <div className="h-4 w-4 border-2 border-primary rounded-full border-t-transparent animate-spin"></div>
          ) : (
            <FileImage className="h-4 w-4" />
          )}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <div className="flex-grow"></div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? 'Edit' : 'Preview'}
        </Button>
      </div>

      {showPreview ? (
        <div 
          className="border rounded-md p-4 min-h-[400px] prose prose-sm max-w-none" 
          dangerouslySetInnerHTML={{ 
            __html: window.markdownit ? window.markdownit().render(content) : content 
          }}
        ></div>
      ) : (
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[400px] font-mono text-sm resize-none"
          placeholder="Enter markdown content here..."
        />
      )}
    </div>
  );
};

export default PageEditor;
