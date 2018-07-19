import { Component, OnInit, Input } from '@angular/core';
import { SiteStateModel } from '../sites-state/site-state.model';

@Component({
  selector: 'berta-site',
  template: `
  <div class="control-line">
    <div class="input-container">
      <input #title type="text" [value]="site.title">
    </div>
    <button [attr.disabled]="modificationDisabled"
            [class.bt-active]="site['@attributes'].published"
            title="publish">P</button>
    <button [attr.disabled]="modificationDisabled" title="delete">X</button>
    <button title="copy">CP</button>
  </div>
  <div class="url">http://berta.me/<input type="text" [value]="site.name" [attr.disabled]="modificationDisabled"></div>
  `,
  styles: [`
    :host {
      display: block;
      margin: 10px 0;
    }
    .control-line {
      display: flex;
    }
    .input-container {
      flex-grow: 1;
    }
  `]
})
export class SiteComponent implements OnInit {
  @Input('site') site: SiteStateModel;
  modificationDisabled: null | true = null;

  constructor() { }

  ngOnInit() {
    this.modificationDisabled = this.site.name === '' || null;
  }

}
