import {Component, Input, OnInit} from '@angular/core';
import {SectionsMenuRenderService} from "../../sites/sections/sections-menu-render.service";
import {Actions, ofActionSuccessful} from "@ngxs/store";
import {ReOrderSiteSectionsAction} from "../../sites/sections/sections-state/site-sections.actions";
import {DefaultTemplateRenderService} from "../../render/default-template-render.service";
import {ClassAttr} from "../../../types/attributes";
import {UserCopyright} from "../../../types/user-copyright";

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
  entries
  portfolioThumbnails
  additionalFooterText
  bertaCopyright
  siteBanners
  sectionFooter

  bodyClasses: string
  isResponsive: boolean
  pageEntriesAttributes: ClassAttr
  userCopyright: UserCopyright

  constructor(
    private defaultRenderService: DefaultTemplateRenderService,
    private sectionsMenuRenderService: SectionsMenuRenderService,
    private actions$: Actions,
  ) {}

  ngOnInit() {
    console.log(this.data)
    this.sectionHead = this.data.sectionHead
    this.sectionsMenu = this.data.sectionsMenu
    this.sitesMenu = this.data.sitesMenu
    this.siteHeader = this.data.siteHeader
    this.additionalTextBlock = this.data.additionalTextBlock
    this.entries = this.data.entries
    this.portfolioThumbnails = this.data.portfolioThumbnails
    this.additionalFooterText = this.data.additionalFooterText
    this.bertaCopyright = this.data.bertaCopyright
    this.siteBanners = this.data.siteBanners
    this.sectionFooter = this.data.sectionFooter

    this.bodyClasses = this.data.bodyClasses
    this.isResponsive = this.data.isResponsive
    this.pageEntriesAttributes = this.data.pageEntriesAttributes
    this.userCopyright = this.data.userCopyright

    this.actions$.pipe(ofActionSuccessful(ReOrderSiteSectionsAction)).subscribe(
      () => {
        const viewData = this.defaultRenderService.getViewData()
        this.sectionsMenu = viewData.sectionsMenu
      }
    );
  }
}
