import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked, Renderer } from 'marked';

@Pipe({ name: 'markdown', standalone: false })
export class MarkdownPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    const renderer = new Renderer();
    renderer.link = ({ href, title, text }: { href: string; title?: string | null; text: string }) => {
      const titleAttr = title ? ` title="${title}"` : '';
      return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
    };
    const html = marked.parse(value, { renderer }) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
