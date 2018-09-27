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
          Publish
        </button>
        <button *ngIf="section['@attributes'].published > 0"
                [class.bt-active]="section['@attributes'].published"
                title="Unpublish"
                (click)="updateField({'@attributes': {published: '0'}})">
                Unpublish
        </button>
        <button title="copy"
                (click)="cloneSection()">Clone</button>
        <button title="delete"
                (click)="deleteSection()">x</button>
        <button title="settings"
                [class.active]="isExpanded"
                [routerLink]="['/sections', (isExpanded ? '' : section.name)]">Settings</button>
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
