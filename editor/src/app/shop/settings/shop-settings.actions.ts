import { SettingModel } from '../../shared/interfaces';

export class UpdateShopSettingsAction {
  static readonly type = 'SHOP_SETTINGS:UPDATE';
  constructor(
    public groupSlug: string,
    public payload: {
      field: string;
      value: SettingModel['value'];
    }) {
  }
}
