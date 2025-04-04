
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ContentDisplayProps {
  slug: string;
  className?: string;
}

const ContentDisplay = ({ slug, className = '' }: ContentDisplayProps) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        // Explicitly cast the result type to avoid type errors
        const { data, error } = await supabase
          .from('page_contents')
          .select('content')
          .eq('slug', slug)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setContent(data.content);
        }
      } catch (err: any) {
        console.error(`Error fetching ${slug} content:`, err);
        setError(`Failed to load content: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [slug]);

  useEffect(() => {
    if (!loading && content && window.markdownit) {
      try {
        const md = window.markdownit();
        const renderedHtml = md.render(content);
        const element = document.getElementById(`content-${slug}`);
        if (element) {
          element.innerHTML = renderedHtml;
        }
      } catch (err) {
        console.error('Error rendering markdown:', err);
      }
    }
  }, [content, loading, slug]);

  if (loading) {
    return (
      <div className={className}>
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-6" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`prose max-w-none ${className}`}>
      <div id={`content-${slug}`}></div>
    </div>
  );
};

export default ContentDisplay;
