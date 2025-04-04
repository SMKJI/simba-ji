
// Custom TypeScript definitions

// Define the window interface to include markdownit
interface Window {
  markdownit: any;
}

// Define interface for MarkdownIt
interface MarkdownIt {
  render(text: string): string;
}

declare global {
  interface Window {
    markdownit: {
      (): MarkdownIt;
      new(options?: any): MarkdownIt;
    };
  }
}

// Extend Supabase database types
declare module '@supabase/supabase-js' {
  interface Database {
    public: {
      Tables: {
        page_contents: {
          Row: {
            id: string;
            created_at: string;
            updated_at: string;
            title: string;
            slug: string;
            content: string;
          };
          Insert: {
            id?: string;
            created_at?: string;
            updated_at?: string;
            title: string;
            slug: string;
            content?: string;
          };
          Update: {
            id?: string;
            created_at?: string;
            updated_at?: string;
            title?: string;
            slug?: string;
            content?: string;
          };
          Relationships: [];
        };
      };
    };
  }
}

// Define PageContent type for our application
export interface PageContent {
  id: string;
  title: string;
  slug: string;
  content: string;
  updated_at: string;
}
