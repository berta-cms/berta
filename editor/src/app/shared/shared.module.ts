import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { IconGoogleComponent } from './icon-google.component';
import { IconFacebookComponent } from './icon-facebook.component';
@NgModule({
  declarations: [LoadingComponent, IconGoogleComponent, IconFacebookComponent],
  imports: [CommonModule],
  exports: [LoadingComponent, IconGoogleComponent, IconFacebookComponent],
})
export class SharedModule {}
