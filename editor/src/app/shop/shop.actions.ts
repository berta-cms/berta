import { ShopModel } from './shop.interface';

export class ResetShopAction {
  public static type = 'SHOP:RESET';
}

export class InitShopAction {
  public static type = 'SHOP:INIT';
  constructor(public payload: ShopModel) {}
}
