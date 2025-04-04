
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bold, Italic, List, ListOrdered, Heading1, Heading2, 
  Image, Link, Code, Undo, Redo, PanelLeft, Eye
} from 'lucide-react';

// Define interface for editor props
interface PageEditorProps {
  content: string;
  onChange: (content: string) => void;
}

// Define markdown formatter type
interface MarkdownFormatter {
  icon: React.ReactNode;
  label: string;
  prefix: string;
  suffix: string;
  block?: boolean;
}

const PageEditor = ({ content, onChange }: PageEditorProps) => {
  const [editorContent, setEditorContent] = useState(content);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<string>('write');
  const [textareaElement, setTextareaElement] = useState<HTMLTextAreaElement | null>(null);
  
  // Update local state when prop changes
  useEffect(() => {
    setEditorContent(content);
  }, [content]);
  
  // Generate preview HTML when content changes or tab changes
  useEffect(() => {
    if (selectedTab === 'preview' && typeof window !== 'undefined') {
      // Use the markdownit library from the window object
      try {
        if (window.markdownit) {
          const md = window.markdownit();
          const rendered = md.render(editorContent);
          setPreviewHtml(rendered);
        } else {
          setPreviewHtml('<p>Markdown library not loaded. Please refresh the page.</p>');
        }
      } catch (error) {
        console.error('Markdown rendering error:', error);
        setPreviewHtml('<p>Error rendering markdown</p>');
      }
    }
  }, [editorContent, selectedTab]);
  
  // Handle content change and notify parent
  const handleChange = (value: string) => {
    setEditorContent(value);
    onChange(value);
  };
  
  // Formatters configuration for toolbar buttons
  const formatters: MarkdownFormatter[] = [
    { 
      icon: <Heading1 className="h-4 w-4" />, 
      label: 'Heading 1', 
      prefix: '# ', 
      suffix: '\n',
      block: true
    },
    { 
      icon: <Heading2 className="h-4 w-4" />, 
      label: 'Heading 2', 
      prefix: '## ', 
      suffix: '\n',
      block: true
    },
    { 
      icon: <Bold className="h-4 w-4" />, 
      label: 'Bold', 
      prefix: '**', 
      suffix: '**' 
    },
    { 
      icon: <Italic className="h-4 w-4" />, 
      label: 'Italic', 
      prefix: '_', 
      suffix: '_' 
    },
    { 
      icon: <List className="h-4 w-4" />, 
      label: 'Bullet List', 
      prefix: '- ', 
      suffix: '\n',
      block: true
    },
    { 
      icon: <ListOrdered className="h-4 w-4" />, 
      label: 'Numbered List', 
      prefix: '1. ', 
      suffix: '\n',
      block: true
    },
    { 
      icon: <Link className="h-4 w-4" />, 
      label: 'Link', 
      prefix: '[', 
      suffix: '](https://)' 
    },
    { 
      icon: <Image className="h-4 w-4" />, 
      label: 'Image', 
      prefix: '![alt text](', 
      suffix: ')' 
    },
    { 
      icon: <Code className="h-4 w-4" />, 
      label: 'Code', 
      prefix: '```\n', 
      suffix: '\n```' 
    },
  ];
  
  // Apply formatting to selected text or insert at cursor position
  const applyFormatting = (prefix: string, suffix: string, block: boolean = false) => {
    if (!textareaElement) return;
    
    const start = textareaElement.selectionStart;
    const end = textareaElement.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    
    let newText;
    
    if (block) {
      // For block elements, we need to ensure they start at the beginning of a line
      const beforeSelection = editorContent.substring(0, start);
      const afterSelection = editorContent.substring(end);
      
      // Check if we need to insert a newline before the prefix
      const needsNewlineBefore = start > 0 && beforeSelection.charAt(beforeSelection.length - 1) !== '\n';
      
      // Format the text with proper newlines
      newText = editorContent.substring(0, start) + 
                (needsNewlineBefore ? '\n' : '') + 
                prefix + selectedText + suffix + 
                afterSelection;
      
      // Calculate new cursor position
      const newCursorPos = start + prefix.length + (needsNewlineBefore ? 1 : 0) + selectedText.length;
      
      // Update the content
      handleChange(newText);
      
      // Set the cursor position after the React update
      setTimeout(() => {
        if (textareaElement) {
          textareaElement.focus();
          textareaElement.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    } else {
      // For inline elements, simply wrap the selected text
      newText = editorContent.substring(0, start) + 
                prefix + selectedText + suffix + 
                editorContent.substring(end);
      
      // Calculate new cursor position and selection
      const newSelectionStart = start + prefix.length;
      const newSelectionEnd = newSelectionStart + selectedText.length;
      
      // Update the content
      handleChange(newText);
      
      // Set the cursor position or selection after the React update
      setTimeout(() => {
        if (textareaElement) {
          textareaElement.focus();
          
          if (selectedText.length > 0) {
            // If text was selected, keep the selection but with the formatting applied
            textareaElement.setSelectionRange(newSelectionStart, newSelectionEnd);
          } else {
            // If no text was selected, place cursor between prefix and suffix
            const cursorPos = start + prefix.length;
            textareaElement.setSelectionRange(cursorPos, cursorPos);
          }
        }
      }, 0);
    }
  };
  
  // Reference to the textarea for formatting operations
  const setTextareaRef = (textarea: HTMLTextAreaElement | null) => {
    setTextareaElement(textarea);
  };
  
  return (
    <div className="border rounded-md">
      <Tabs 
        defaultValue="write" 
        value={selectedTab} 
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <div className="flex items-center justify-between border-b px-2 bg-muted/50">
          <div className="flex flex-wrap gap-1 p-1">
            {formatters.map((formatter, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                title={formatter.label}
                onClick={() => applyFormatting(formatter.prefix, formatter.suffix, formatter.block)}
              >
                {formatter.icon}
              </Button>
            ))}
          </div>
          
          <TabsList className="bg-transparent border">
            <TabsTrigger value="write" className="data-[state=active]:bg-background">
              <PanelLeft className="h-4 w-4 mr-2" />
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-background">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="write" className="p-0 mt-0">
          <Textarea
            ref={setTextareaRef}
            value={editorContent}
            onChange={(e) => handleChange(e.target.value)}
            className="min-h-[400px] font-mono text-sm p-4 resize-y rounded-none"
            placeholder="Write your content in Markdown format..."
          />
        </TabsContent>
        
        <TabsContent value="preview" className="p-0 mt-0">
          <div className="prose prose-sm max-w-none p-4 min-h-[400px] bg-white">
            {previewHtml ? (
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            ) : (
              <div className="text-muted-foreground">
                Preview will appear here when you write content.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PageEditor;
