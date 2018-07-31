import { Component, OnInit, Input } from '@angular/core';
import { SiteSectionStateModel } from './sections-state/site-sections-state.model';
import { SectionTypes } from '../template-settings/site-template-settings.interface';

@Component({
  selector: 'berta-section',
  template: `
    <h3>
      <span [style.display]="(edit==='title' ? 'none' : '')">{{ section.title || '...' }}</span>
      <input #title *ngIf="edit==='title'" bertaAutofocus
             type="text"
             [value]="section.title"
             (keydown)="updateField('title', title.value, $event)"
             (blur)="updateField('title', title.value, $event)">
      <button *ngIf="edit!=='title' && !modificationDisabled"
              title="Edit"
              type="button"
              (click)="editField('title')">E</button>
      <div *ngIf="edit!=='title'" class="expand"></div>
      <button [attr.disabled]="modificationDisabled"
              [class.bt-active]="section['@attributes'].published"
              title="publish">P</button>
      <button [attr.disabled]="modificationDisabled" title="delete">X</button>
      <button title="copy">CP</button>
    </h3>
    <label for="type">
      <strong>Type</strong>
      <select name="type">
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
        <textarea name="seo-title">{{section.seoTitle}}</textarea>
      </label>
      <label for="seo-keywords">
        Keywords:
        <textarea name="seo-keywords">{{section.seoKeywords}}</textarea>
      </label>
      <label for="seo-description">
        Description:
        <textarea name="seo-description">{{section.seoDescription}}</textarea>
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

  constructor() { }

  ngOnInit() {
  }

  updateField(field, value, $event) {
    this.edit = false;
  }

  editField(field) {
    this.edit = field;
  }

}