
/**
 * Safely renders markdown to HTML with fallback
 */
export const renderMarkdown = (markdownContent: string): string => {
  try {
    if (window.markdownit) {
      const md = window.markdownit({
        html: true,
        linkify: true,
        typographer: true
      });
      return md.render(markdownContent || '');
    }
    return markdownContent || '';
  } catch (error) {
    console.error('Error rendering markdown:', error);
    return markdownContent || '';
  }
};
