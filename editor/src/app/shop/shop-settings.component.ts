import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';

@Component({
  selector: 'berta-shop',
  template: `
    <h2>Shop</h2>
    <p>
      site name: {{ (appState$ | async).site }}
    </p>
  `,
  styles: []
})
export class ShopSettingsComponent implements OnInit {

  constructor() { }

  @Select(state => state.app) appState$;

  ngOnInit() {
  }

}
