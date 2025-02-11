import { Cart, CartItem } from "../../models";

export enum CartItemActionType {
  SUCCESS = 0,
  CREATED = 1,
  UPDATED = 2,
  DELETED = 3,
  NOT_FOUND = 4,
}

export interface GetCartResult extends Cart {
  items?: CartItem[]
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export interface CartProduct {
  id: number;
  quantity: number;
  product: Product;
}

export type Total = { total: number }
export type Data = GetCartResult | CartProduct[] | Total | CartItem

export type CartServiceResult = Promise<{
  type: CartItemActionType,
  message?: string,
  data?: Data,
}>