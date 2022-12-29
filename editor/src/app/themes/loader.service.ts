import {ComponentFactoryResolver, Injectable, ViewContainerRef} from '@angular/core';
import {Store} from "@ngxs/store";
import {UserState} from "../user/user.state";
import {SiteSettingsState} from "../sites/settings/site-settings.state";
import {DefaultThemeComponent} from "./default-theme/default-theme.component";
import {DefaultTemplateRenderService} from "../render/default-template-render.service";
import {ThemeItem} from "../../types/theme-item";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(
    private store: Store,
    private componentFactoryResolver: ComponentFactoryResolver,
    private defaultRenderService: DefaultTemplateRenderService
  ) {}

  loadTheme(dom: Document, vcRef: ViewContainerRef) {
    const isLoggedIn = this.store.selectSnapshot(UserState.isLoggedIn);
    if (!isLoggedIn) {
      return;
    }

    const comp = this.loadThemeComponent()

    const compFactory = this.componentFactoryResolver.resolveComponentFactory(comp.component)
    const componentRef = vcRef.createComponent(compFactory)
    componentRef.instance.data = comp.data
    Array.from(dom.childNodes).forEach((node) =>
      node.remove()
    );
    dom.appendChild(componentRef.location.nativeElement.firstChild)
  }

  private loadThemeComponent(): ThemeItem {
    const templateName = this.store
      .selectSnapshot(SiteSettingsState.getCurrentSiteTemplate)
      .split('-')
      .shift();

    switch (templateName) {
      case 'white':
        // this.whiteTemplateRenderService.startRender(contentWindow);
        break;

      case 'default':
        const viewData = this.defaultRenderService.getViewData()

        return new ThemeItem(
          DefaultThemeComponent,
          viewData
        )

      case 'mashup':
        // this.mashupTemplateRenderService.startRender(contentWindow);
        break;

      // Messy
      default:
        // this.messyTemplateRenderService.startRender(contentWindow);
        break;
    }
  }
}
