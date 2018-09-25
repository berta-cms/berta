import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngxs/store';
import { SiteSectionStateModel } from './sections-state/site-sections-state.model';
import { SiteTemplateSectionTypesModel } from '../template-settings/site-templates.interface';
import { DeleteSiteSectionAction, CloneSectionAction } from './sections-state/site-sections.actions';
import { UpdateInputFocus } from '../../app-state/app.actions';

@Component({
  selector: 'berta-section',
  template: `
    <div class="section-container" [class.is-expanded]="isExpanded">
      <h3>
        <span [style.display]="(edit==='title' ? 'none' : '')">{{ section.title || '...' }}</span>
        <input #title *ngIf="edit==='title'" bertaAutofocus
              type="text"
              [value]="section.title"
              (keydown)="updateTextField('title', title.value, $event)"
              (blur)="updateTextField('title', title.value, $event)">

        <svg *ngIf="edit!=='title'"
             title="Edit"
             type="button"
             (click)="editField('title')"
             class="edit"
             width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path class="icon" d="M6 34.5v7.5h7.5l22.13-22.13-7.5-7.5-22.13 22.13zm35.41-20.41c.78-.78.78-2.05 0-2.83l-4.67-4.67c-.78-.78-2.05-.78-2.83 0l-3.66 3.66 7.5 7.5 3.66-3.66z"/>
          <path d="M0 0h48v48h-48z" fill="none"/>
        </svg>

        <div *ngIf="edit!=='title'" class="expand"></div>
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
                [routerLink]="['/sections', section.name]">Settings</button>
      </h3>
      <div class="settings">
        <berta-select-input [label]="'Type'"
                            [value]="section['@attributes'].type"
                            [values]="templateSectionTypes"
                            (inputFocus)="updateComponentFocus($event)"
                            (update)="updateField({'@attributes': {type: $event}})"></berta-select-input>
        <div *ngIf="params.length > 0" class="section-params">
          <berta-setting *ngFor="let param of params"
                        [setting]="param.setting"
                        [config]="param.config"
                        (update)="updateSectionParams($event)"></berta-setting>
        </div>
        <h4>SEO</h4>
        <berta-long-text-input [label]="'Title'"
                                [value]="section.seoTitle"
                                (inputFocus)="updateComponentFocus($event)"
                                (update)="updateTextField2('seoTitle', $event)"></berta-long-text-input>

        <berta-long-text-input [label]="'Keywords'"
                                [value]="section.seoKeywords"
                                (inputFocus)="updateComponentFocus($event)"
                                (update)="updateTextField2('seoKeywords', $event)"></berta-long-text-input>

        <berta-long-text-input [label]="'Description'"
                                [value]="section.seoDescription"
                                (inputFocus)="updateComponentFocus($event)"
                                (update)="updateTextField2('seoDescription', $event)"></berta-long-text-input>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    label, textarea {
      display: block;
    }
    label[for=type] {
      display: flex;
      justify-content: space-between;
    }
    h3 {
      display: flex;
    }
    .expand,
    h3 input[type=text] {
      flex-grow: 1;
    }
  `]
})
export class SectionComponent implements OnInit {
  @Input('section') section: SiteSectionStateModel;
  @Input('isExpanded') isExpanded: boolean;
  @Input('templateSectionTypes') templateSectionTypes: SiteTemplateSectionTypesModel;
  @Input('params') params: any[] = [];
  edit: false | 'title' = false;

  @Output('update') update = new EventEmitter<{section: string|number, data: {[k: string]: any}}>();

  constructor(private store: Store) { }

  ngOnInit() {
  }

  updateComponentFocus(isFocused) {
    this.store.dispatch(new UpdateInputFocus(isFocused));
  }

  updateTextField(field, value, $event) {
    if (this.edit === false || $event instanceof KeyboardEvent && !($event.key === 'Enter' || $event.keyCode === 13)) {
      return;
    }
    if (this.section[field] === value) {
      return;
    }
    this.edit = false;
    const data = {};
    data[field] = value;

    this.updateField(data);
  }

  updateTextField2(field, value) {
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

  editField(field) {
    this.edit = field;
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
