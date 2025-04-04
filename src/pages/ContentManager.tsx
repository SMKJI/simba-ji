
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, FileEdit, Save, Trash2 } from 'lucide-react';
import PageEditor from '@/components/content/PageEditor';

interface PageContent {
  id: string;
  title: string;
  slug: string;
  content: string;
  updated_at: string;
}

const ContentManager = () => {
  const { currentUser, hasRole } = useRegistrations();
  const { toast } = useToast();
  const [pages, setPages] = useState<PageContent[]>([]);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageContent | null>(null);

  useEffect(() => {
    if (currentUser && (hasRole('admin') || hasRole('content'))) {
      fetchPages();
    }
  }, [currentUser]);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('page_contents')
        .select('*')
        .order('title');
      
      if (error) throw error;
      
      setPages(data || []);
      
      // Set initial page based on activeTab
      if (data && data.length > 0) {
        const initialPage = data.find(page => page.slug === activeTab) || data[0];
        setCurrentPage(initialPage);
        setActiveTab(initialPage.slug);
      }
    } catch (error: any) {
      console.error('Error fetching pages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load page content',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (slug: string) => {
    setActiveTab(slug);
    const selectedPage = pages.find(page => page.slug === slug);
    if (selectedPage) {
      setCurrentPage(selectedPage);
    }
  };

  const handleContentChange = (content: string) => {
    if (currentPage) {
      setCurrentPage({
        ...currentPage,
        content
      });
    }
  };

  const saveContent = async () => {
    if (!currentPage) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('page_contents')
        .update({
          content: currentPage.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentPage.id);
      
      if (error) throw error;
      
      toast({
        title: 'Content Saved',
        description: `${currentPage.title} page has been updated successfully`,
      });
      
      // Refresh pages
      fetchPages();
    } catch (error: any) {
      console.error('Error saving content:', error);
      toast({
        title: 'Error',
        description: 'Failed to save page content',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser || (!hasRole('admin') && !hasRole('content'))) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Content Manager</h1>
            <p className="text-muted-foreground">Edit website content</p>
          </div>
          <Button onClick={saveContent} disabled={saving || !currentPage}>
            {saving ? 'Saving...' : 'Save Changes'}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
          </div>
        ) : pages.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p>No pages found. Please create pages first.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden border-0 shadow-md">
            <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
              <TabsList className="bg-muted/50 p-0 w-full justify-start rounded-none border-b">
                {pages.map(page => (
                  <TabsTrigger 
                    key={page.id} 
                    value={page.slug}
                    className="py-3 px-6 font-medium data-[state=active]:bg-background"
                  >
                    {page.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {pages.map(page => (
                <TabsContent 
                  key={page.id} 
                  value={page.slug}
                  className="p-0 mt-0"
                >
                  <div className="p-4 bg-muted/20 border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium flex items-center">
                          <FileEdit className="h-4 w-4 mr-2" />
                          Editing: {page.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Last updated: {new Date(page.updated_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {currentPage && currentPage.slug === page.slug && (
                      <PageEditor 
                        content={currentPage.content} 
                        onChange={handleContentChange}
                      />
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ContentManager;
