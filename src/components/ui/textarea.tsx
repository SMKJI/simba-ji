
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  attachmentSupport?: boolean;
  onAttachmentChange?: (files: File[]) => void;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, attachmentSupport, onAttachmentChange, ...props }, ref) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [attachments, setAttachments] = React.useState<File[]>([]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const newFiles = Array.from(e.target.files);
        setAttachments(prev => [...prev, ...newFiles]);
        
        if (onAttachmentChange) {
          onAttachmentChange([...attachments, ...newFiles]);
        }
        
        // Reset input so the same file can be selected again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    
    const removeAttachment = (index: number) => {
      const newAttachments = attachments.filter((_, i) => i !== index);
      setAttachments(newAttachments);
      
      if (onAttachmentChange) {
        onAttachmentChange(newAttachments);
      }
    };
    
    return (
      <div className="space-y-2">
        <textarea
          className={cn(
            "flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        
        {attachmentSupport && (
          <div className="space-y-2">
            {attachments.length > 0 && (
              <div className="space-y-1 mt-2">
                <p className="text-xs text-muted-foreground">Lampiran:</p>
                <div className="flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <div 
                      key={`${file.name}-${index}`}
                      className="flex items-center bg-muted/50 text-xs px-2 py-1 rounded-full"
                    >
                      <span className="truncate max-w-[120px]">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="ml-1 text-muted-foreground hover:text-destructive"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-primary hover:text-primary/80 underline"
              >
                + Tambahkan Lampiran
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
