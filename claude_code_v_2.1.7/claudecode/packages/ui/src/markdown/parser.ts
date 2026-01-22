/**
 * @claudecode/ui - Simple Markdown Parser
 * 
 * Basic tokenizer for markdown strings.
 * In a production environment, this should be replaced by 'marked' or a similar robust parser.
 */

import type { 
  MarkdownToken, 
  CodeBlockToken, 
  HeadingToken, 
  ListToken, 
  ListItemToken, 
  ParagraphToken 
} from './types.js';

/**
 * Basic markdown tokenizer.
 */
export function parseMarkdown(text: string): MarkdownToken[] {
  const tokens: MarkdownToken[] = [];
  const lines = text.split('\n');
  
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLanguage = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;

    // Code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        tokens.push({
          type: 'code',
          content: codeBuffer.join('\n'),
          language: codeLanguage
        } as CodeBlockToken);
        inCodeBlock = false;
        codeBuffer = [];
        codeLanguage = '';
      } else {
        inCodeBlock = true;
        codeLanguage = line.trim().slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      tokens.push({
        type: 'heading',
        level: headingMatch[1]!.length as any,
        content: headingMatch[2]!
      } as HeadingToken);
      continue;
    }

    // Lists (very basic)
    const listMatch = line.match(/^([\*\-\+])\s+(.*)$/);
    if (listMatch) {
      const bullet = listMatch[1];
      const content = listMatch[2];
      
      // Check if we can append to last list or start new one
      const lastToken = tokens[tokens.length - 1];
      if (lastToken?.type === 'list' && !(lastToken as ListToken).ordered) {
        (lastToken as ListToken).children.push({
          type: 'list_item',
          children: [{ type: 'text', content: content }]
        } as ListItemToken);
      } else {
        tokens.push({
          type: 'list',
          ordered: false,
          children: [{
            type: 'list_item',
            children: [{ type: 'text', content: content }]
          }]
        } as ListToken);
      }
      continue;
    }

    // Paragraphs
    if (line.trim() !== '') {
      tokens.push({
        type: 'paragraph',
        content: line,
        children: [{ type: 'text', content: line }]
      } as ParagraphToken);
    }
  }

  return tokens;
}
