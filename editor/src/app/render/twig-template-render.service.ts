import { Injectable } from '@angular/core';
import { TWIG_TEMPLATES } from './twig-templates';

declare const Twig: any;

@Injectable({
  providedIn: 'root',
})
export class TwigTemplateRenderService {
  private templateCache = new Map<string, any>();

  constructor() {
    // Verify Twig is loaded
    if (typeof Twig === 'undefined') {
      console.error(
        'Twig library not loaded! Make sure twig.min.js is included in angular.json scripts.'
      );
    }
  }

  /**
   * Load and compile a Twig template from bundled templates
   */
  private loadTemplate(templateName: string): any {
    // Check cache first
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName);
    }

    // Get template content from bundled templates
    const twigContent = TWIG_TEMPLATES[templateName];

    if (!twigContent) {
      throw new Error(`Template not found: ${templateName}`);
    }

    // Compile the template
    const template = Twig.twig({
      data: twigContent,
      allowInlineIncludes: false,
    });

    // Cache it
    this.templateCache.set(templateName, template);
    return template;
  }

  /**
   * Render a Twig template with dynamic data (synchronous!)
   */
  render(templateName: string, context: Record<string, any>): string {
    try {
      const template = this.loadTemplate(templateName);
      return template.render(context);
    } catch (error) {
      console.error(`Failed to render template: ${templateName}`, error);
      throw error;
    }
  }
}
