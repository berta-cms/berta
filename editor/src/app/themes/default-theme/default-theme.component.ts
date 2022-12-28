import {Component, Input, OnInit} from '@angular/core';
import {SectionsMenuRenderService} from "../../sites/sections/sections-menu-render.service";
import {Actions, ofActionSuccessful} from "@ngxs/store";
import {ReOrderSiteSectionsAction} from "../../sites/sections/sections-state/site-sections.actions";
import {DefaultTemplateRenderService} from "../../render/default-template-render.service";

@Component({
  selector: 'berta-default-theme',
  templateUrl: './default-theme.component.html',
  styles: [``]
})
export class DefaultThemeComponent implements OnInit {
  @Input() data: any;
  sectionHead
  sectionsMenu
  sitesMenu
  siteHeader
  additionalTextBlock

  bodyClasses: string
  isResponsive: boolean

  constructor(
    private defaultRenderService: DefaultTemplateRenderService,
    private sectionsMenuRenderService: SectionsMenuRenderService,
    private actions$: Actions,
  ) {}

  ngOnInit() {
    this.sectionHead = this.data.sectionHead
    this.sectionsMenu = this.data.sectionsMenu
    this.sitesMenu = this.data.sitesMenu
    this.siteHeader = this.data.siteHeader
    this.additionalTextBlock = this.data.additionalTextBlock

    this.bodyClasses = this.data.bodyClasses
    this.isResponsive = this.data.isResponsive
    this.actions$.pipe(ofActionSuccessful(ReOrderSiteSectionsAction)).subscribe(
      () => {
        const viewData = this.defaultRenderService.getViewData()
        this.sectionsMenu = viewData.sectionsMenu
      }
    );
  }
}
