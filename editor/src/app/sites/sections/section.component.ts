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
        <button [attr.title]="(section['@attributes'].published > 0 ? 'Unpublish': 'Publish')"
                (click)="updateField({'@attributes': {published: (section['@attributes'].published > 0 ? '0' : '1')}})">
          <berta-icon-publish [published]="(section['@attributes'].published > 0)"></berta-icon-publish>
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
                [routerLink]="['/sections', (isExpanded ? '' : section.name)]"
                queryParamsHandling="merge">
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
