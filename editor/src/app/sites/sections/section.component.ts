import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngxs/store';
import { SiteSectionStateModel } from './sections-state/site-sections-state.model';
import { SectionTypes } from '../template-settings/site-template-settings.interface';
import { DeleteSiteSectionAction, CloneSectionAction } from './sections-state/site-sections.actions';

@Component({
  selector: 'berta-section',
  template: `
    <h3>
      <span [style.display]="(edit==='title' ? 'none' : '')">{{ section.title || '...' }}</span>
      <input #title *ngIf="edit==='title'" bertaAutofocus
             type="text"
             [value]="section.title"
             (keydown)="updateTextField('title', title.value, $event)"
             (blur)="updateTextField('title', title.value, $event)">
      <button *ngIf="edit!=='title'"
              title="Edit"
              type="button"
              (click)="editField('title')">E</button>
      <div *ngIf="edit!=='title'" class="expand"></div>
      <button [class.bt-active]="section['@attributes'].published"
              title="publish">P</button>
      <button title="copy"
              (click)="cloneSection()">Clone</button>
      <button title="delete"
              (click)="deleteSection()">X</button>
    </h3>
    <label for="type">
      <strong>Type</strong>
      <select #sectionType name="type" (change)="updateField({'@attributes': {type: sectionType.value}})">
        <option *ngFor="let sectionType of templateSectionTypes"
                [value]="sectionType.slug"
                [attr.selected]="(sectionType.slug === section['@attributes'].type ? '' : null)">
          {{ sectionType.title }}</option>
      </select>
    </label>

    <h4>SEO</h4>
    <div class="section-seo">
      <label for="seo-title">
        Title:
        <textarea name="seo-title"
                  (blur)="updateTextField('seoTitle', $event.target.value, $event)"
                  (focus)="editField('seoTitle')">{{section.seoTitle}}</textarea>
      </label>
      <label for="seo-keywords">
        Keywords:
        <textarea name="seo-keywords"
                  (blur)="updateTextField('seoKeywords', $event.target.value, $event)"
                  (focus)="editField('seoKeywords')">{{section.seoKeywords}}</textarea>
      </label>
      <label for="seo-description">
        Description:
        <textarea name="seo-description"
                  (blur)="updateTextField('seoDescription', $event.target.value, $event)"
                  (focus)="editField('seoDescription')">{{section.seoDescription}}</textarea>
      </label>
    </div>
    <h4 *ngIf="params.length > 0">Params</h4>
    <div *ngIf="params.length > 0" class="section-params">
      <berta-setting *ngFor="let param of params" [setting]="param.setting" [config]="param.config"></berta-setting>
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
    .section-seo {
      padding-left: 1rem;
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
  @Input('templateSectionTypes') templateSectionTypes: SectionTypes;
  @Input('params') params: any[] = [];
  edit: false | 'title' = false;

  @Output('update') update = new EventEmitter<{section: string|number, data: {[k: string]: any}}>();

  constructor(private store: Store) { }

  ngOnInit() {
  }

  updateTextField(field, value, $event) {
    if (this.edit === false || $event instanceof KeyboardEvent && !($event.key === 'Enter' || $event.keyCode === 13)) {
      return;
    }
    this.edit = false;
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

  cloneSection() {
    this.store.dispatch(new CloneSectionAction(this.section));
  }

  deleteSection() {
    this.store.dispatch(new DeleteSiteSectionAction(this.section));
  }
}
