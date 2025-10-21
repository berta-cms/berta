import { Component } from '@angular/core';

@Component({
  selector: 'bt-icon-crop',
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <path
        d="M5 .5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5V3H.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H3v7a1 1 0 0 0 1 1h6v-2H5zM15.5 11H13V4a1 1 0 0 0-1-1H6v2h5v10.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V13h2.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"
      />
    </svg>
  `,
  standalone: false,
})
export class IconCropComponent {}
