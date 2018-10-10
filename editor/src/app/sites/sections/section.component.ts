import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngxs/store';
import { SiteSectionStateModel } from './sections-state/site-sections-state.model';
import { SiteTemplateSectionTypesModel } from '../template-settings/site-templates.interface';
import { DeleteSiteSectionAction, CloneSectionAction } from './sections-state/site-sections.actions';

@Component({
  selector: 'berta-section',
  template: `
    <div class="setting-group" [class.is-expanded]="isExpanded">
      <h3>
        <berta-inline-text-input [value]="section.title"
                                 (inputFocus)="updateComponentFocus($event)"
                                 (update)="updateTextField('title', $event)"></berta-inline-text-input>

        <div class="expand"></div>
        <button *ngIf="section['@attributes'].published < 1"
                [class.bt-active]="section['@attributes'].published"
                title="Publish"
                (click)="updateField({'@attributes': {published: '1'}})">
          <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" width="16" height="12" version="1.1" viewBox="0 0 16 12"><path d="M5 9.3 5.7 8.1Q4.9 7.5 4.4 6.7 4 5.8 4 4.9q0-1.1 0.5-2-2 1-3.4 3.2 1.5 2.3 3.8 3.3zM8.4 2.6q0-0.2-0.1-0.3-0.1-0.1-0.3-0.1-1.1 0-1.9 0.8-0.8 0.8-0.8 1.9 0 0.2 0.1 0.3 0.1 0.1 0.3 0.1 0.2 0 0.3-0.1 0.1-0.1 0.1-0.3 0-0.8 0.5-1.3 0.5-0.5 1.3-0.5 0.2 0 0.3-0.1Q8.4 2.7 8.4 2.6ZM11.7 0.9q0 0.1 0 0.1Q10.7 2.6 8.8 6 7 9.4 6 11.1l-0.4 0.8q-0.1 0.1-0.3 0.1-0.1 0-1.2-0.6-0.1-0.1-0.1-0.3 0-0.1 0.4-0.8Q3.1 9.8 2 8.8 1 7.8 0.2 6.6 0 6.3 0 6 0 5.7 0.2 5.4 1.5 3.3 3.6 2.1 5.6 0.9 8 0.9q0.8 0 1.6 0.2l0.5-0.9q0.1-0.1 0.3-0.1 0 0 0.2 0.1 0.1 0.1 0.3 0.1 0.2 0.1 0.3 0.2 0.1 0.1 0.3 0.2 0.1 0.1 0.2 0.1 0.1 0.1 0.1 0.2zm0.3 4q0 1.2-0.7 2.3-0.7 1-1.9 1.5L11.9 4.1q0.1 0.4 0.1 0.8zm4 1.1q0 0.3-0.2 0.6-0.3 0.6-1 1.3-1.3 1.5-3.1 2.4-1.8 0.8-3.7 0.8L8.7 10q1.9-0.2 3.5-1.2 1.6-1.1 2.7-2.7-1-1.6-2.5-2.6l0.6-1q0.8 0.6 1.6 1.4 0.8 0.8 1.3 1.6 0.2 0.3 0.2 0.6z" stroke-width="0"/></svg>
        </button>
        <button *ngIf="section['@attributes'].published > 0"
                [class.bt-active]="section['@attributes'].published"
                title="Unpublish"
                (click)="updateField({'@attributes': {published: '0'}})">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" version="1.1" viewBox="0 0 16 12"><path d="m14.9 6q-1.4-2.1-3.4-3.2 0.5 0.9 0.5 2 0 1.7-1.2 2.8-1.2 1.2-2.8 1.2-1.7 0-2.8-1.2-1.2-1.2-1.2-2.8 0-1.1 0.5-2-2 1-3.4 3.2 1.2 1.8 3 2.9 1.8 1.1 3.9 1.1 2.1 0 3.9-1.1 1.8-1.1 3-2.9zm-6.4-3.4q0-0.2-0.1-0.3-0.1-0.1-0.3-0.1-1.1 0-1.9 0.8-0.8 0.8-0.8 1.9 0 0.2 0.1 0.3 0.1 0.1 0.3 0.1t0.3-0.1q0.1-0.1 0.1-0.3 0-0.8 0.5-1.3 0.5-0.5 1.3-0.5 0.2 0 0.3-0.1 0.1-0.1 0.1-0.3zm7.6 3.4q0 0.3-0.2 0.6-1.2 2.1-3.4 3.3-2.1 1.2-4.5 1.2-2.3 0-4.5-1.2-2.1-1.2-3.4-3.3-0.2-0.3-0.2-0.6 0-0.3 0.2-0.6 1.3-2 3.4-3.3 2.1-1.2 4.5-1.2 2.3 0 4.5 1.2 2.1 1.2 3.4 3.3 0.2 0.3 0.2 0.6z" stroke-width="0"/></svg>
        </button>
        <button title="copy"
                (click)="cloneSection()">
          <bt-icon-clone></bt-icon-clone>
        </button>
        <button title="delete"
                class="delete"
                (click)="deleteSection()">
          <bt-icon-delete></bt-icon-delete>
        </button>
        <button title="settings"
                [class.active]="isExpanded"
                [routerLink]="['/sections', (isExpanded ? '' : section.name)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" version="1.1" viewBox="0 0 16 16">
            <path d="m10.7 8q0-1.1-0.8-1.9-0.8-0.8-1.9-0.8t-1.9 0.8q-0.8 0.8-0.8 1.9t0.8 1.9q0.8 0.8 1.9 0.8t1.9-0.8q0.8-0.8 0.8-1.9zm5.3-1.1v2.3q0 0.1-0.1 0.2t-0.2 0.1l-1.9 0.3q-0.2 0.6-0.4 0.9 0.4 0.5 1.1 1.4 0.1 0.1 0.1 0.3t-0.1 0.2q-0.3 0.4-1 1.1t-1 0.7q-0.1 0-0.3-0.1l-1.4-1.1q-0.5 0.2-0.9 0.4-0.2 1.4-0.3 1.9-0.1 0.3-0.4 0.3h-2.3q-0.1 0-0.3-0.1-0.1-0.1-0.1-0.2l-0.3-1.9q-0.5-0.2-0.9-0.4l-1.5 1.1q-0.1 0.1-0.3 0.1-0.1 0-0.3-0.1-1.3-1.2-1.7-1.7-0.1-0.1-0.1-0.2 0-0.1 0.1-0.2 0.2-0.2 0.5-0.7 0.4-0.5 0.6-0.7-0.3-0.5-0.4-1l-1.9-0.3q-0.1 0-0.2-0.1-0.1-0.1-0.1-0.2v-2.3q0-0.1 0.1-0.2 0.1-0.1 0.2-0.1l1.9-0.3q0.1-0.5 0.4-1-0.4-0.6-1.1-1.4-0.1-0.1-0.1-0.2 0-0.1 0.1-0.2 0.3-0.4 1-1.1 0.8-0.7 1-0.7 0.1 0 0.3 0.1l1.4 1.1q0.5-0.2 0.9-0.4 0.2-1.4 0.3-1.9 0.1-0.3 0.4-0.3h2.3q0.1 0 0.3 0.1 0.1 0.1 0.1 0.2l0.3 1.9q0.5 0.2 0.9 0.4l1.5-1.1q0.1-0.1 0.3-0.1 0.1 0 0.3 0.1 1.3 1.2 1.7 1.8 0.1 0.1 0.1 0.2 0 0.1-0.1 0.2-0.2 0.2-0.5 0.7t-0.6 0.7q0.3 0.5 0.4 1l1.9 0.3q0.1 0 0.2 0.1 0.1 0.1 0.1 0.2z" stroke-width="0"/>
          </svg>
        </button>
      </h3>
      <div class="settings">
        <div class="setting">
          <berta-select-input [label]="'Type'"
                              [value]="section['@attributes'].type"
                              [values]="templateSectionTypes"
                              (inputFocus)="updateComponentFocus($event)"
                              (update)="updateField({'@attributes': {type: $event}})"></berta-select-input>
        </div>

        <div *ngIf="params.length > 0" class="section-params">
          <berta-setting *ngFor="let param of params"
                        [setting]="param.setting"
                        [config]="param.config"
                        (update)="updateSectionParams($event)"></berta-setting>
        </div>

        <div class="setting">
          <h4>SEO</h4>
        </div>

        <div class="setting">
          <berta-long-text-input [label]="'Title'"
                                 [value]="section.seoTitle"
                                 (inputFocus)="updateComponentFocus($event)"
                                 (update)="updateTextField('seoTitle', $event)"></berta-long-text-input>
        </div>

        <div class="setting">
          <berta-long-text-input [label]="'Keywords'"
                                 [value]="section.seoKeywords"
                                 (inputFocus)="updateComponentFocus($event)"
                                 (update)="updateTextField('seoKeywords', $event)"></berta-long-text-input>
        </div>

        <div class="setting">
          <berta-long-text-input [label]="'Description'"
                                 [value]="section.seoDescription"
                                 (inputFocus)="updateComponentFocus($event)"
                                 (update)="updateTextField('seoDescription', $event)"></berta-long-text-input>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .expand,
    h3 input[type=text] {
      flex-grow: 1;
    }
  `]
})
export class SectionComponent {
  @Input('section') section: SiteSectionStateModel;
  @Input('isExpanded') isExpanded: boolean;
  @Input('templateSectionTypes') templateSectionTypes: SiteTemplateSectionTypesModel;
  @Input('params') params: any[] = [];

  @Output() inputFocus = new EventEmitter();
  @Output('update') update = new EventEmitter<{section: string|number, data: {[k: string]: any}}>();

  constructor(private store: Store) { }

  updateComponentFocus(isFocused) {
    this.inputFocus.emit(isFocused);
  }

  updateTextField(field, value) {
    const data = {};
    data[field] = value;

    this.updateField(data);
  }

  updateField(data) {
    this.update.emit({
      section: this.section.order,
      data
    });
  }

  updateSectionParams(updateEvent) {
    this.updateField({
      [updateEvent.field]: updateEvent.value
    });
  }

  cloneSection() {
    this.store.dispatch(new CloneSectionAction(this.section));
  }

  deleteSection() {
    this.store.dispatch(new DeleteSiteSectionAction(this.section));
  }
}
