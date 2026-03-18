import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PipesModule } from '../pipes/pipes.module';
import { AiAssistantComponent } from './ai-assistant.component';

@NgModule({
  imports: [CommonModule, FormsModule, PipesModule],
  declarations: [AiAssistantComponent],
  exports: [AiAssistantComponent],
})
export class AiAssistantModule {}
