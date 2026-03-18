import { NgModule } from '@angular/core';
import { SafePipe } from './safe.pipe';
import { MarkdownPipe } from './markdown.pipe';

@NgModule({
  declarations: [SafePipe, MarkdownPipe],
  exports: [SafePipe, MarkdownPipe],
})
export class PipesModule {}
