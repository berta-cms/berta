import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppStateService } from '../app-state/app-state.service';
import { SiteStateModel } from '../sites/sites-state/site-state.model';
import { SiteSettingsSiteResponse } from '../sites/settings/site-settings.interface';
import { SitesTemplateSettingsSiteResponse } from '../sites/template-settings/site-template-settings.interface';
import { SiteSectionStateModel } from '../sites/sections/sections-state/site-sections-state.model';
import { SectionEntry } from '../sites/sections/entries/entries-state/section-entries-state.model';
import { SectionTagsInterface } from '../sites/sections/tags/section-tags-state.model';

/** One changed value of a change, as the server's change log records it. */
export interface AiChangeItem {
  group: string;
  key: string;
  previous: string;
  value: string;
}

/** A change the chat made, logged on the server, so it can be undone. */
export interface AiChange {
  change_id: string;
  tool: string;
  subsite: string;
  kind: string;
  action: string;
  items: AiChangeItem[];
}

/** Fresh data of a site's parts that changes touched, in the shapes the state endpoint gives them. */
export interface AiSiteData {
  settings?: SiteSettingsSiteResponse;
  template_settings?: SitesTemplateSettingsSiteResponse;
  sections?: SiteSectionStateModel[];
  entries?: { [sectionName: string]: SectionEntry[] };
  tags?: { section: SectionTagsInterface[] };
}

/** The parts of the editor's data that changes touched, read fresh by the server. */
export interface AiRefresh {
  sites?: SiteStateModel[];
  site_data: { [siteName: string]: AiSiteData };
}

/** A delete the chat parked on the server until the user approves or rejects it. */
export interface AiApproval {
  id: string;
  tool: string;
  summary: string;
}

export interface AiApproveResponse {
  approved: boolean;
  /** The tool's message when it refused, e.g. because the item is gone. */
  error?: string | null;
  changes?: AiChange[];
  refresh?: AiRefresh;
}

export interface AiChatResponse {
  reply: string;
  changes: AiChange[];
  approvals?: AiApproval[];
  refresh: AiRefresh;
  daily_usage?: { count: number; limit: number };
}

export interface AiUndoResponse {
  undone: string[];
  refusal: string | null;
  changes: AiChange[];
  refresh: AiRefresh;
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
  ): Observable<AiChatResponse> {
    return this.appStateService
      .sync('aiChat', { message, history, site }, 'POST')
      .pipe(map((response: any) => response.data as AiChatResponse));
  }

  /** Undoes changes of a reply on the server, without the AI. */
  undo(changeIds: string[]): Observable<AiUndoResponse> {
    return this.appStateService
      .sync('aiUndo', { change_ids: changeIds }, 'POST')
      .pipe(map((response: any) => response.data as AiUndoResponse));
  }

  /** Runs or drops a delete the chat parked for approval, without the AI. */
  approve(id: string, approve: boolean): Observable<AiApproveResponse> {
    return this.appStateService
      .sync('aiApprove', { id, approve }, 'POST')
      .pipe(map((response: any) => response.data as AiApproveResponse));
  }

  getQuota(): Observable<{ count: number; limit: number }> {
    return this.appStateService
      .sync('aiQuota', {}, 'GET')
      .pipe(
        map(
          (response: any) => response.data as { count: number; limit: number },
        ),
      );
  }

  feedback(
    vote: 'up' | 'down',
    userMessage: string,
    assistantMessage: string,
    conversation: { role: string; content: string }[],
  ): Observable<void> {
    return this.appStateService
      .sync(
        'aiFeedback',
        {
          vote,
          user_message: userMessage,
          assistant_message: assistantMessage,
          conversation,
        },
        'POST',
      )
      .pipe(map(() => undefined));
  }
}
