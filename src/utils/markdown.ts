
/**
 * A helper to safely use markdown-it
 */
export const renderMarkdown = (text: string): string => {
  if (!window.markdownit) {
    console.warn('markdown-it not found');
    return text;
  }
  
  try {
    const md = window.markdownit();
    return md.render(text);
  } catch (error) {
    console.error('Error rendering markdown:', error);
    return text;
  }
};
