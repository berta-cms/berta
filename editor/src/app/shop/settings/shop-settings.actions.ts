import { SettingModel } from '../../shared/interfaces';

export class UpdateShopSettingsAction {
  static readonly type = 'SHOP_SETTINGS:UPDATE';
  constructor(
    public groupSlug: string,
    public payload: {
      field: string;
      value: SettingModel['value'];
    }
  ) {}
}

export class RenameShopSettingsSiteAction {
  static readonly type = 'SHOP_SETTINGS:SITE_RENAME';
  constructor(public siteName: string, public payload: string) {}
}

export class DeleteShopSettingsSiteAction {
  static readonly type = 'SHOP_SETTINGS:SITE_DELETE';
  constructor(public payload: string) {}
}

export class AddShopSettingsSiteAction {
  static readonly type = 'SHOP_SETTINGS:SITE_ADD';
  constructor(public payload: string) {}
}

/* Init: */
export class InitShopSettingsAction {
  public static type = 'SHOP_SETTINGS:INIT';
  constructor(public payload: any) {}
}
export class InitShopSettingsConfigAction {
  public static type = 'SHOP_SETTINGS_CONFIG:INIT';
  constructor(public payload: any) {}
}

/* Reset: */
export class ResetShopSettingsAction {
  public static type = 'SHOP_SETTINGS:RESET';
}

export class ResetShopSettingsConfigAction {
  public static type = 'SHOP_SETTINGS_CONFIG:RESET';
}
