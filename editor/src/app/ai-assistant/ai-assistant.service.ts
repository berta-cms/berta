import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppStateService } from '../app-state/app-state.service';

export interface AiChangeItem {
  group: string;
  setting: string;
  value: string;
  previous_value?: string | null;
}

export interface AiSectionChangeItem {
  operation: 'create' | 'clone' | 'update' | 'delete' | 'reorder';
  name?: string;
  title?: string;
  property?: string;
  value?: string;
  previous_value?: string | null;
  order?: number;
}

export interface AiEntryChangeItem {
  operation: 'create' | 'update' | 'delete';
  section?: string;
  entry_id?: string;
  value?: string;
  previous_value?: string | null;
  description?: string;
}

export interface AiGalleryChangeItem {
  operation: 'update_setting' | 'update_caption';
  section?: string;
  entry_id?: string;
  setting?: string;
  file_index?: number;
  value?: string;
  previous_value?: string | null;
}

export interface AiChatResponse {
  reply: string;
  is_undo: boolean;
  design_changes: AiChangeItem[];
  settings_changes: AiChangeItem[];
  section_changes: AiSectionChangeItem[];
  entry_changes: AiEntryChangeItem[];
  gallery_changes: AiGalleryChangeItem[];
}

@Injectable({
  providedIn: 'root',
})
export class AiAssistantService {
  constructor(private appStateService: AppStateService) {}

  chat(
    message: string,
    history: { role: string; content: string }[],
    site: string,
    template: string,
    changeHistory: { user_message: string; design_changes: AiChangeItem[]; settings_changes: AiChangeItem[]; section_changes: AiSectionChangeItem[]; entry_changes: AiEntryChangeItem[]; gallery_changes: AiGalleryChangeItem[] }[] = [],
  ): Observable<AiChatResponse> {
    return this.appStateService
      .sync('aiChat', { message, history, site, template, change_history: changeHistory }, 'POST')
      .pipe(map((response: any) => response.data as AiChatResponse));
  }
}
