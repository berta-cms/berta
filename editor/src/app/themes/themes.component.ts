import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'berta-themes',
  template: `
  <div class="themes-container setting-group">
    [themes list]
  </div>
  `
})
export class ThemesComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {

  }
}
